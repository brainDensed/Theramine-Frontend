import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useSocket } from "../context/SocketContext";
import { useLocation, useParams } from "react-router";
import { motion } from "framer-motion";
import { ipfsChatService } from "../services/ipfsService";

function ChatComponent() {
  const { address } = useAccount();
  const { socket, messages, setMessages } = useSocket();
  const { roomId } = useParams();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [lastSavedHash, setLastSavedHash] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { therapistId, userId } = location.state || {};
  const endRef = useRef(null);

  // Generate persistent room ID for this user-therapist pair
  const persistentRoomId = ipfsChatService.generateRoomId(
    userId || address || "user", 
    therapistId || "therapist"
  );

  // Load existing chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, [persistentRoomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      console.log("📚 Loading chat history for room:", persistentRoomId);
      
      const chatHistory = await ipfsChatService.getChatRoom(persistentRoomId);
      
      if (chatHistory && chatHistory.messages) {
        console.log(`✅ Loaded ${chatHistory.messages.length} messages from history`);
        setMessages(chatHistory.messages);
      }
    } catch (error) {
      console.log("ℹ️ No existing chat history found, starting fresh");
      setMessages([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageData = {
      message: input,
      sender: "me",
      timestamp: new Date().toISOString(),
      type: "chat",
      userId: userId || address || "user",
      therapistId: therapistId || "therapist",
    };

    // Add message to local state immediately
    const newMessages = [...messages, messageData];
    setMessages(newMessages);
    setInput("");

    try {
      setIsSaving(true);

      // Send via WebSocket for real-time communication
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "chat",
          ...messageData,
          roomId: persistentRoomId,
        }));
      }

      // Store to IPFS with updated message list
      const ipfsHash = await ipfsChatService.addMessageToRoom(
        persistentRoomId,
        messageData,
        {
          userInfo: { id: userId || address || "user" },
          therapistInfo: { id: therapistId || "therapist" },
        }
      );

      setLastSavedHash(ipfsHash);
      console.log("💾 Message saved to IPFS:", ipfsHash);

    } catch (error) {
      console.error("❌ Error saving message:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentSession = async () => {
    if (messages.length === 0) return;

    try {
      setIsSaving(true);
      const ipfsHash = await ipfsChatService.storeChatRoom(
        persistentRoomId,
        messages,
        {
          userInfo: { id: userId || address || "user" },
          therapistInfo: { id: therapistId || "therapist" },
        }
      );
      setLastSavedHash(ipfsHash);
      console.log("💾 Session manually saved to IPFS:", ipfsHash);
    } catch (error) {
      console.error("❌ Error saving session:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p>Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[var(--color-background)] to-[var(--color-background-secondary)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              Chat with {therapistId || "Therapist"}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Room: {persistentRoomId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastSavedHash && (
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                ✅ Saved to IPFS
              </div>
            )}
            {isSaving && (
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                💾 Saving...
              </div>
            )}
            <button
              onClick={saveCurrentSession}
              disabled={isSaving || messages.length === 0}
              className="px-3 py-1 text-xs bg-[var(--color-primary)] text-black rounded hover:opacity-80 disabled:opacity-50"
            >
              Save Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-[var(--color-text-secondary)] mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender === "me"
                    ? "bg-[var(--color-primary)] text-black"
                    : "bg-[var(--color-surface)] text-[var(--color-text)]"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp || msg.time).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isSaving}
            className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-black font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
