import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useSocket } from "../context/SocketContext";
import { useLocation, useParams } from "react-router";
import { motion } from "framer-motion";

function ChatComponent() {
  const { address } = useAccount();
  const { socket, messages, setMessages } = useSocket();
  const { roomId } = useParams();
  const location = useLocation();
  const [input, setInput] = useState("");

  const { therapistId, userId } = location.state || {};
  const endRef = useRef(null);

  const handleSend = () => {
    socket.send(
      JSON.stringify({
        type: "chat",
        userId,
        therapistId,
        roomId,
        message: input,
        time: new Date().toISOString(),
      })
    );

    const msg = {
      message: input,
      sender: "me",
      time: new Date().toISOString(),
      type: "chat",
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-full">
      {/* Messages Container */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div
          className={`flex-1 px-3 space-y-3 ${
            messages.length > 0
              ? "overflow-y-auto"
              : "flex items-center justify-center"
          }`}
        >
          {messages.length === 0 ? (
            <p className="text-white/50 italic">No messages yet...</p>
          ) : (
            <div className="py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md backdrop-blur-md mb-3 ${
                    m.sender === "me"
                      ? "ml-auto bg-[var(--color-accent)] text-black"
                      : "mr-auto bg-[var(--color-secondary)] text-black"
                  }`}
                >
                  <p className="text-xs opacity-70 font-semibold">{m.sender}</p>
                  <p className="text-base">{m.message}</p>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="flex items-center gap-2 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg mb-2">
          <input
            className="flex-1 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
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
