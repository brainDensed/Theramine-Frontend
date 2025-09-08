import { PinataSDK } from "pinata-web3";
import { generateRoomId } from "../utils/roomUtils.js";

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
   * Generate a unique room ID for user-therapist pair
   * @param {string} userId - User ID
   * @param {string} therapistId - Therapist ID
   * @returns {string} - Unique room ID
   */
  generateRoomId(userId, therapistId) {
    return generateRoomId(userId, therapistId);
  }

  /**
   * Store or update a complete chat room with all messages
   * @param {string} roomId - The room ID
   * @param {Array} messages - Array of all messages in the room
   * @param {Object} metadata - Additional metadata (userInfo, therapistInfo)
   * @returns {Promise<string>} - Returns IPFS hash
   */
  async storeChatRoom(roomId, messages, metadata = {}) {
    try {
      const chatRoomData = {
        roomId: roomId,
        messages: messages || [],
        messageCount: messages ? messages.length : 0,
        lastUpdated: new Date().toISOString(),
        createdAt: metadata.createdAt || new Date().toISOString(),
        userInfo: metadata.userInfo || {},
        therapistInfo: metadata.therapistInfo || {},
        sessions: this.groupMessagesBySessions(messages || []),
        ...metadata,
      };

      const result = await pinata.upload.json(chatRoomData, {
        metadata: {
          name: `chat-room-${roomId}`,
          keyvalues: {
            type: "chatroom",
            roomId: roomId,
            messageCount: chatRoomData.messageCount.toString(),
            lastUpdated: chatRoomData.lastUpdated,
            userId: metadata.userInfo?.id || "unknown",
            therapistId: metadata.therapistInfo?.id || "unknown",
          },
        },
      });

      console.log("✅ Chat room stored to IPFS:", result.IpfsHash);
      
      // Update cache
      this.chatCache.set(roomId, {
        hash: result.IpfsHash,
        data: chatRoomData,
        lastUpdated: chatRoomData.lastUpdated
      });

      return result.IpfsHash;
    } catch (error) {
      console.error("❌ Error storing chat room to IPFS:", error);
      throw error;
    }
  }

  /**
   * Group messages by sessions (by date)
   * @param {Array} messages - Array of messages
   * @returns {Array} - Array of session objects
   */
  groupMessagesBySessions(messages) {
    const sessionMap = new Map();
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!sessionMap.has(date)) {
        sessionMap.set(date, {
          date: date,
          messages: [],
          messageCount: 0,
          startTime: message.timestamp,
          endTime: message.timestamp
        });
      }
      
      const session = sessionMap.get(date);
      session.messages.push(message);
      session.messageCount++;
      session.endTime = message.timestamp;
    });

    return Array.from(sessionMap.values()).sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
  }

  /**
   * List all chat rooms from IPFS
   * @param {string} userId - Optional user ID to filter by
   * @param {string} therapistId - Optional therapist ID to filter by
   * @returns {Promise<Array>} - Returns array of chat room files
   */
  async listChatFiles(userId = null, therapistId = null) {
    try {
      const files = await pinata.listFiles();
      console.log("🔍 All IPFS files:", files);
      
      if (!files.files || !Array.isArray(files.files)) {
        return [];
      }

      // Filter for chat room files
      const chatFiles = files.files.filter(file => {
        // Check if it's a chat room file
        const isChatRoom = file.metadata?.keyvalues?.type === "chatroom";
        if (!isChatRoom) return false;

        // If filtering by user/therapist, check those too
        if (userId && file.metadata?.keyvalues?.userId !== userId) return false;
        if (therapistId && file.metadata?.keyvalues?.therapistId !== therapistId) return false;

        return true;
      });

      console.log("✅ Found chat room files:", chatFiles.length);
      return chatFiles;

    } catch (error) {
      console.error("❌ Error listing chat files:", error);
      return [];
    }
  }

  /**
   * Retrieve a specific chat room by room ID
   * @param {string} roomId - The room ID to retrieve
   * @returns {Promise<Object>} - Returns the chat room data
   */
  async getChatRoom(roomId) {
    try {
      // Check cache first
      const cached = this.chatCache.get(roomId);
      if (cached) {
        console.log("📋 Retrieved from cache:", roomId);
        return cached.data;
      }

      // Get all files and find the one with matching roomId
      const files = await this.listChatFiles();
      const roomFile = files.find(file => 
        file.metadata?.keyvalues?.roomId === roomId
      );

      if (!roomFile) {
        throw new Error(`Chat room ${roomId} not found`);
      }

      // Retrieve the file content
      const response = await fetch(`${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${roomFile.ipfs_pin_hash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chat room: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update cache
      this.chatCache.set(roomId, {
        hash: roomFile.ipfs_pin_hash,
        data: data,
        lastUpdated: data.lastUpdated
      });

      console.log("✅ Retrieved chat room from IPFS:", roomId);
      return data;

    } catch (error) {
      console.error("❌ Error retrieving chat room:", error);
      throw error;
    }
  }

  /**
   * Add a new message to an existing chat room
   * @param {string} roomId - The room ID
   * @param {Object} newMessage - The new message to add
   * @param {Object} metadata - Room metadata (userInfo, therapistInfo)
   * @returns {Promise<string>} - Returns new IPFS hash
   */
  async addMessageToRoom(roomId, newMessage, metadata = {}) {
    try {
      let existingRoom;
      
      try {
        // Try to get existing room
        existingRoom = await this.getChatRoom(roomId);
      } catch (error) {
        // Room doesn't exist, create new one
        console.log("📝 Creating new chat room:", roomId);
        existingRoom = {
          roomId: roomId,
          messages: [],
          createdAt: new Date().toISOString(),
        };
      }

      // Add the new message
      const messageWithTimestamp = {
        ...newMessage,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
      };

      const updatedMessages = [...(existingRoom.messages || []), messageWithTimestamp];

      // Store the updated room
      return await this.storeChatRoom(roomId, updatedMessages, {
        ...metadata,
        createdAt: existingRoom.createdAt,
      });

    } catch (error) {
      console.error("❌ Error adding message to room:", error);
      throw error;
    }
  }

  /**
   * Get chat history for a specific user-therapist pair
   * @param {string} userId - User ID
   * @param {string} therapistId - Therapist ID
   * @returns {Promise<Object>} - Returns the chat room data
   */
  async getChatHistory(userId, therapistId) {
    const roomId = this.generateRoomId(userId, therapistId);
    return await this.getChatRoom(roomId);
  }
}

// Create singleton instance
const ipfsChatService = new IPFSChatService();

// Export both named and default
export { ipfsChatService };
export default ipfsChatService;
