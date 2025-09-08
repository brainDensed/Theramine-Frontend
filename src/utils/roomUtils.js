/**
 * Utility functions for room management
 */

/**
 * Generate a consistent room ID for a user-therapist pair
 * @param {string} userId - User identifier
 * @param {string} therapistId - Therapist identifier
 * @returns {string} - Consistent room ID
 */
export const generateRoomId = (userId, therapistId) => {
  // Sort IDs to ensure consistency regardless of order
  const sortedIds = [userId, therapistId].sort();
  return `room_${sortedIds[0]}_${sortedIds[1]}`;
};

/**
 * Parse room ID to extract user and therapist IDs
 * @param {string} roomId - Room ID to parse
 * @returns {Object} - Object with userId and therapistId
 */
export const parseRoomId = (roomId) => {
  const parts = roomId.replace('room_', '').split('_');
  if (parts.length !== 2) {
    throw new Error('Invalid room ID format');
  }
  return {
    userId: parts[0],
    therapistId: parts[1]
  };
};

/**
 * Validate room ID format
 * @param {string} roomId - Room ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidRoomId = (roomId) => {
  return /^room_[^_]+_[^_]+$/.test(roomId);
};

/**
 * Get the other participant in a room
 * @param {string} roomId - Room ID
 * @param {string} currentUserId - Current user's ID
 * @returns {string} - Other participant's ID
 */
export const getOtherParticipant = (roomId, currentUserId) => {
  const { userId, therapistId } = parseRoomId(roomId);
  return userId === currentUserId ? therapistId : userId;
};

/**
 * Check if user is a participant in the room
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID to check
 * @returns {boolean} - True if user is a participant
 */
export const isParticipant = (roomId, userId) => {
  try {
    const { userId: roomUserId, therapistId } = parseRoomId(roomId);
    return roomUserId === userId || therapistId === userId;
  } catch {
    return false;
  }
};

export default {
  generateRoomId,
  parseRoomId,
  isValidRoomId,
  getOtherParticipant,
  isParticipant
};