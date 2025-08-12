import { parseAbi } from "viem";

export const TherapySessionAddress = "0x2ca55f8b8ade4f777a60a0186eb6ebbcbdba8429";

// Use parseAbi for everything except getSession
const flatABI = parseAbi([
  "function requestSession(address therapist, uint256 merkleTreeRoot, uint256 nullifierHash, uint256 signal, uint256[8] proof, string offChainRoomId) external",
  "function acceptSession(uint256 sessionId) external",
  "function completeSession(uint256 sessionId) external",
  "function cancelSession(uint256 sessionId) external",
  'function getMerkleTreeRoot(uint256 groupId) view returns (uint256)',
  'function getMerkleTreeDepth(uint256 groupId) view returns (uint8)',
  'function getMerkleTreeSize(uint256 groupId) view returns (uint256)',
  "event SessionRequested(uint256 indexed sessionId, address indexed therapist, string chatRoomId)",
  "event SessionStarted(uint256 indexed sessionId)",
  "event SessionCompleted(uint256 indexed sessionId)",
  "event SessionCancelled(uint256 indexed sessionId)"
]);

// Manually define the getSession function to support tuple return
const getSessionABI = [
  {
    type: "function",
    name: "getSession",
    stateMutability: "view",
    inputs: [{ name: "sessionId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "sessionId", type: "uint256" },
          { name: "therapist", type: "address" },
          { name: "userNullifier", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "endTime", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "offChainChatRoom", type: "string" }
        ]
      }
    ]
  }
];

// Merge both
export const TherapySessionABI = [...flatABI, ...getSessionABI];
