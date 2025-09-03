import { useState, useCallback } from 'react';
import { ipfsChatService } from '../services/ipfsService';

export const useIPFSChat = (roomId) => {
  const [isStoring, setIsStoring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Store a single message to IPFS
   */
  const storeMessage = useCallback(async (messageData) => {
    setIsStoring(true);
    setError(null);
    
    try {
      const ipfsHash = await ipfsChatService.storeMessage({
        ...messageData,
        roomId,
      });
      
      return ipfsHash;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsStoring(false);
    }
  }, [roomId]);

  /**
   * Store entire chat room to IPFS
   */
  const storeChatRoom = useCallback(async (messages) => {
    setIsStoring(true);
    setError(null);
    
    try {
      const ipfsHash = await ipfsChatService.storeChatRoom(roomId, messages);
      return ipfsHash;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsStoring(false);
    }
  }, [roomId]);

  /**
   * Load chat room from IPFS
   */
  const loadChatRoom = useCallback(async (ipfsHash) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const chatRoomData = await ipfsChatService.getChatRoom(ipfsHash);
      return chatRoomData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a permanent chat log
   */
  const createChatLog = useCallback(async (messages) => {
    setIsStoring(true);
    setError(null);
    
    try {
      const ipfsHash = await ipfsChatService.createChatLog(roomId, messages);
      return ipfsHash;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsStoring(false);
    }
  }, [roomId]);

  /**
   * List existing chat files for this room
   */
  const listChatFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const files = await ipfsChatService.listChatFiles(roomId);
      return files;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  return {
    storeMessage,
    storeChatRoom,
    loadChatRoom,
    createChatLog,
    listChatFiles,
    isStoring,
    isLoading,
    error,
  };
};
