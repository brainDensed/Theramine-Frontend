import { parseAbi } from "viem";

export const TheramineRegistryAddress = "0x2ca55f8b8ade4f777a60a0186eb6ebbcbdba8429";
export const TheramineRegistryABI = parseAbi([
  "function registerUser(uint256 identityCommitment) external",
  "event UserRegistered(uint256 identityCommitment)"
])