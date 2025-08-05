import { parseAbi } from "viem";

export const TheramineRegistryAddress = "0xF71F01290E5fa5AD34e0319af39941a4B8C61Df9";
export const TheramineRegistryABI = parseAbi([
  "function registerUser(uint256 identityCommitment) external",
  "event UserRegistered(uint256 identityCommitment)"
])