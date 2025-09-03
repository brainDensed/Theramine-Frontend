import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIPFSChat } from '../hooks/useIPFSChat';

function IPFSChatHistory({ roomId }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loadChatRoom, listChatFiles } = useIPFSChat(roomId);

  useEffect(() => {
    loadStoredChats();
  }, [roomId]);

  const loadStoredChats = () => {
    // Load from localStorage
    const stored = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`chat-session-${roomId}`) || key.startsWith(`chat-log-${roomId}`)) {
        const value = localStorage.getItem(key);
        try {
          const data = key.startsWith('chat-log') ? JSON.parse(value) : { hash: value };
          stored.push({
            key,
            type: key.startsWith('chat-log') ? 'log' : 'session',
            ...data,
          });
        } catch (e) {
          stored.push({
            key,
            type: key.startsWith('chat-log') ? 'log' : 'session',
            hash: value,
          });
        }
      }
    }
    setChatHistory(stored.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)));
  };

  const loadChatFromIPFS = async (hash) => {
    setIsLoading(true);
    try {
      const chatData = await loadChatRoom(hash);
      setSelectedChat(chatData);
    } catch (error) {
      console.error('Failed to load chat from IPFS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">📚 Chat History (IPFS)</h3>
      
      {chatHistory.length === 0 ? (
        <p className="text-white/50 italic">No saved chat history found</p>
      ) : (
        <div className="space-y-2">
          {chatHistory.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 rounded-lg p-3 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'log' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.type === 'log' ? '📚 Archive' : '💾 Session'}
                    </span>
                    {item.messageCount && (
                      <span className="text-white/70 text-sm">
                        {item.messageCount} messages
                      </span>
                    )}
                  </div>
                  {item.timestamp && (
                    <p className="text-white/50 text-xs mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loadChatFromIPFS(item.hash)}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition disabled:opacity-50"
                  >
                    👁️ View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(item.hash)}
                    className="px-3 py-1 text-xs rounded-lg bg-gray-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30 transition"
                  >
                    📋 Copy Hash
                  </motion.button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-white/60 text-xs font-mono break-all">
                  {item.hash}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Chat Display */}
      {selectedChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white/10 rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-white">
              📖 Viewing Chat: {selectedChat.roomId}
            </h4>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedChat(null)}
              className="text-white/70 hover:text-white"
            >
              ✕
            </motion.button>
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedChat.messages?.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === 'me'
                    ? 'ml-auto bg-blue-500/30 text-white'
                    : 'mr-auto bg-gray-500/30 text-white'
                }`}
              >
                <p className="text-xs opacity-70 font-semibold">{msg.sender}</p>
                <p>{msg.message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(msg.time).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Total Messages: {selectedChat.messages?.length || 0}</span>
              <span>
                {selectedChat.lastUpdated && `Updated: ${new Date(selectedChat.lastUpdated).toLocaleString()}`}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white/70">Loading from IPFS...</span>
        </div>
      )}
    </div>
  );
}

export default IPFSChatHistory;
