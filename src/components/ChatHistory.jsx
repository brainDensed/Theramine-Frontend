import React, { useState, useEffect } from 'react';
import { ipfsChatService } from '../services/ipfsService';
import { motion } from 'framer-motion';

const ChatHistory = () => {
  const [chatFiles, setChatFiles] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📚 Loading chat history from IPFS...');
      const files = await ipfsChatService.listChatFiles();
      console.log('📁 Found chat files:', files);
      console.log('📊 Total files found:', files.length);
      
      // Process files to get room data
      const roomData = await Promise.all(
        files.map(async (file) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${file.ipfs_pin_hash}`);
            const data = await response.json();
            return {
              ...data,
              file: file,
              hash: file.ipfs_pin_hash,
              lastUpdated: data.lastUpdated || file.date_pinned,
              fileName: file.metadata?.name || `Room: ${data.roomId}`,
            };
          } catch (error) {
            console.error('Error loading room data:', error);
            return null;
          }
        })
      );

      // Filter out failed loads and ensure we have valid room data
      const validRooms = roomData.filter(room => room && room.roomId);
      setChatFiles(validRooms);
      
      if (validRooms.length === 0) {
        console.log('⚠️ No valid chat rooms found.');
      } else {
        console.log(`✅ Loaded ${validRooms.length} chat rooms`);
      }
    } catch (err) {
      setError('Failed to load chat history: ' + err.message);
      console.error('❌ Error loading chat history:', err);
      setChatFiles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadChatRoom = async (roomData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📖 Loading chat room:', roomData.roomId);
      
      // roomData already contains the full chat data from loadChatHistory
      setSelectedChat({
        ...roomData,
        fileName: roomData.fileName || `Room: ${roomData.roomId}`,
        ipfsHash: roomData.hash,
        datePinned: roomData.file?.date_pinned,
        fileSize: roomData.file?.size,
      });
    } catch (err) {
      setError('Failed to load chat room: ' + err.message);
      console.error('❌ Error loading chat room:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 IPFS hash copied to clipboard!');
  };

  const getFileTypeIcon = (metadata) => {
    const type = metadata?.keyvalues?.type;
    switch (type) {
      case 'chat-room': return '🏠';
      case 'chat-log': return '📝';
      case 'message': return '💬';
      default: return '📁';
    }
  };

  const filteredFiles = (chatFiles || []).filter(file => {
    const fileName = file.metadata?.name?.toLowerCase() || '';
    const roomId = file.metadata?.keyvalues?.roomId?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fileName.includes(search) || roomId.includes(search);
  });

  return (
    <div className="flex flex-col max-w-7xl mx-auto min-h-[70vh] p-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-white">📚 Chat History</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="🔍 Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadChatHistory} 
            disabled={loading}
            className="px-4 py-2 bg-blue-500/30 text-white border border-blue-400/50 rounded-xl hover:bg-blue-500/50 transition disabled:opacity-50"
          >
            {loading ? '⏳' : '🔄'} Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4 flex justify-between items-center"
        >
          <span className="text-red-300">❌ {error}</span>
          <button onClick={() => setError(null)} className="text-red-300 hover:text-white">✕</button>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Files Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/20 pb-2">
            📁 Stored Chats ({filteredFiles.length})
          </h3>
          
          {loading && !selectedChat && (
            <div className="flex flex-col items-center justify-center flex-1 text-white/70">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p>Loading chat history...</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.ipfs_pin_hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => loadChatRoom(file)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedChat?.ipfsHash === file.ipfs_pin_hash
                    ? 'bg-green-500/30 border-green-400/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } border`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{getFileTypeIcon(file.metadata)}</span>
                  <h4 className="text-white font-medium truncate flex-1">
                    {file.metadata?.name || 'Unnamed Chat'}
                  </h4>
                </div>
                
                <div className="space-y-1 text-sm text-white/70">
                  <p><span className="font-medium">Room:</span> {file.metadata?.keyvalues?.roomId || 'Unknown'}</p>
                  <p><span className="font-medium">Messages:</span> {file.metadata?.keyvalues?.messageCount || '0'}</p>
                  <p><span className="font-medium">Size:</span> {formatFileSize(file.size)}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(file.date_pinned)}</p>
                </div>

                <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(file.ipfs_pin_hash)}
                    className="px-2 py-1 bg-green-500/30 text-green-300 rounded-lg text-xs hover:bg-green-500/50 transition"
                    title="Copy IPFS Hash"
                  >
                    📋
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${file.ipfs_pin_hash}`, '_blank')}
                    className="px-2 py-1 bg-blue-500/30 text-blue-300 rounded-lg text-xs hover:bg-blue-500/50 transition"
                    title="View on IPFS"
                  >
                    🌐
                  </motion.button>
                </div>

                <div className="mt-2 font-mono text-xs text-white/50 truncate">
                  {file.ipfs_pin_hash.substring(0, 20)}...
                </div>
              </motion.div>
            ))}

            {!loading && filteredFiles.length === 0 && (
              <div className="text-center text-white/50 py-8">
                <p className="text-3xl mb-2">📭</p>
                <p>No chat history found</p>
                <p className="text-sm">Start chatting to see history here!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Viewer */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col"
        >
          {selectedChat ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">💬 {selectedChat.fileName}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChat(null)}
                    className="w-8 h-8 bg-red-500/30 text-red-300 rounded-full hover:bg-red-500/50 transition"
                  >
                    ✕
                  </motion.button>
                </div>
                
                {/* Metadata */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-white/70 text-sm">Room ID</div>
                    <div className="text-white font-medium">{selectedChat.roomId || 'Unknown'}</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-white/70 text-sm">Messages</div>
                    <div className="text-white font-medium">{selectedChat.messageCount || selectedChat.messages?.length || 0}</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-white/70 text-sm">File Size</div>
                    <div className="text-white font-medium">{formatFileSize(selectedChat.fileSize)}</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-white/70 text-sm">Stored</div>
                    <div className="text-white font-medium">{formatDate(selectedChat.datePinned)}</div>
                  </div>
                </div>
                
                {/* IPFS Hash */}
                <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                  <div className="text-blue-300 text-sm mb-1">IPFS Hash:</div>
                  <code 
                    className="text-white font-mono text-sm cursor-pointer hover:bg-white/10 p-1 rounded break-all"
                    onClick={() => copyToClipboard(selectedChat.ipfsHash)}
                  >
                    {selectedChat.ipfsHash}
                  </code>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedChat.messages && selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map((message, index) => (
                    <motion.div
                      key={message.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 rounded-xl p-4 border-l-4 border-blue-400"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-300 font-medium">{message.sender || 'Unknown'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/50 text-sm">
                            {message.timestamp ? formatDate(message.timestamp) : 'Unknown time'}
                          </span>
                          {message.ipfsHash && (
                            <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-full text-xs">
                              📁 IPFS
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-white mb-2">
                        {message.message || message.text || message.content || 'No content'}
                      </div>
                      
                      {message.ipfsHash && (
                        <div className="text-white/40 text-xs font-mono">
                          IPFS: {message.ipfsHash.substring(0, 30)}...
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-white/50 py-8">
                    <p className="text-3xl mb-2">📭</p>
                    <p>No messages in this chat</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-white/70">
              <div>
                <h3 className="text-2xl mb-4">👋 Welcome to Chat History</h3>
                <p className="mb-6">Select a chat from the sidebar to view its contents</p>
                <div className="bg-white/10 rounded-xl p-6 max-w-md">
                  <h4 className="text-lg mb-4 text-white">📖 How to use:</h4>
                  <ul className="text-left space-y-2 text-sm">
                    <li>📁 Click on any chat file to view messages</li>
                    <li>🔍 Use search to find specific chats</li>
                    <li>📋 Click copy button to get IPFS hash</li>
                    <li>🌐 Click globe button to view on IPFS</li>
                    <li>🔄 Click refresh to update the list</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatHistory;
