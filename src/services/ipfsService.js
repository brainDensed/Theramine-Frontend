import { PinataSDK } from "pinata-web3";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

class IPFSChatService {
  constructor() {
    this.chatCache = new Map(); // Cache for quick access
  }

  /**
   * Store a chat message to IPFS
   * @param {Object} messageData - The message data to store
   * @returns {Promise<string>} - Returns the IPFS hash
   */
  async storeMessage(messageData) {
    try {
      const messageWithMetadata = {
        ...messageData,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
      };

      const result = await pinata.upload.json(messageWithMetadata, {
        metadata: {
          name: `chat-message-${messageWithMetadata.id}`,
          keyvalues: {
            type: "chat-message",
            roomId: messageData.roomId,
            sender: messageData.sender,
            timestamp: messageWithMetadata.timestamp,
          },
        },
      });

      // Cache the message locally
      this.chatCache.set(result.IpfsHash, messageWithMetadata);
      
      console.log("✅ Message stored to IPFS:", result.IpfsHash);
      return result.IpfsHash;
    } catch (error) {
      console.error("❌ Error storing message to IPFS:", error);
      throw error;
    }
  }

  /**
   * Retrieve a message from IPFS
   * @param {string} ipfsHash - The IPFS hash of the message
   * @returns {Promise<Object>} - Returns the message data
   */
  async getMessage(ipfsHash) {
    try {
      // Check cache first
      if (this.chatCache.has(ipfsHash)) {
        return this.chatCache.get(ipfsHash);
      }

      const data = await pinata.gateways.get(ipfsHash);
      this.chatCache.set(ipfsHash, data);
      
      return data;
    } catch (error) {
      console.error("❌ Error retrieving message from IPFS:", error);
      throw error;
    }
  }

  /**
   * Store chat room messages as a single file
   * @param {string} roomId - The room ID
   * @param {Array} messages - Array of messages
   * @returns {Promise<string>} - Returns the IPFS hash
   */
  async storeChatRoom(roomId, messages) {
    try {
      const chatRoomData = {
        roomId,
        messages,
        lastUpdated: new Date().toISOString(),
        messageCount: messages.length,
      };

      const result = await pinata.upload.json(chatRoomData, {
        metadata: {
          name: `chat-room-${roomId}`,
          keyvalues: {
            type: "chat-room",
            roomId: roomId,
            messageCount: messages.length.toString(),
            lastUpdated: chatRoomData.lastUpdated,
          },
        },
      });

      console.log("✅ Chat room stored to IPFS:", result.IpfsHash);
      return result.IpfsHash;
    } catch (error) {
      console.error("❌ Error storing chat room to IPFS:", error);
      throw error;
    }
  }

  /**
   * Retrieve chat room messages
   * @param {string} ipfsHash - The IPFS hash of the chat room
   * @returns {Promise<Object>} - Returns the chat room data
   */
  async getChatRoom(ipfsHash) {
    try {
      const data = await pinata.gateways.get(ipfsHash);
      return data;
    } catch (error) {
      console.error("❌ Error retrieving chat room from IPFS:", error);
      throw error;
    }
  }

  /**
   * List files by metadata (useful for finding chat rooms)
   * @param {string} roomId - Optional room ID to filter by
   * @returns {Promise<Array>} - Returns array of files
   */
  async listChatFiles(roomId = null) {
    try {
      const filters = {
        keyvalues: {
          type: "chat-room",
        },
      };

      if (roomId) {
        filters.keyvalues.roomId = roomId;
      }

      const files = await pinata.listFiles(filters);
      return files.files;
    } catch (error) {
      console.error("❌ Error listing chat files:", error);
      throw error;
    }
  }

  /**
   * Create a persistent chat log for a room
   * @param {string} roomId - The room ID
   * @param {Array} messages - Current messages in the room
   * @returns {Promise<string>} - Returns the IPFS hash
   */
  async createChatLog(roomId, messages) {
    try {
      const chatLog = {
        roomId,
        messages: messages.map(msg => ({
          ...msg,
          ipfsHash: msg.ipfsHash || null, // Store individual message hashes if available
        })),
        createdAt: new Date().toISOString(),
        totalMessages: messages.length,
      };

      const result = await pinata.upload.json(chatLog, {
        metadata: {
          name: `chat-log-${roomId}-${Date.now()}`,
          keyvalues: {
            type: "chat-log",
            roomId: roomId,
            messageCount: messages.length.toString(),
            createdAt: chatLog.createdAt,
          },
        },
      });

      return result.IpfsHash;
    } catch (error) {
      console.error("❌ Error creating chat log:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const ipfsChatService = new IPFSChatService();
export default ipfsChatService;
