// src/utils/getGroupDetails.ts

import { readContract } from '@wagmi/core'
import { TheramineRegistryABI, TheramineRegistryAddress } from '../contracts/TheramineRegistry'
import { config } from '../../config/config'
import { TherapySessionABI, TherapySessionAddress } from '../contracts/TherapySession'

/**
 * Fetch group details directly from the Semaphore contract.
 * @param groupId - bigint ID of the group (e.g. 1n)
 */
export async function getGroupDetails(groupId) {
  const [root, depth, size] = await Promise.all([
    readContract(config, {
      address: TherapySessionAddress,
      abi: TherapySessionABI,
      functionName: 'getMerkleTreeRoot',
      args: [groupId],
    }),
    readContract(config, {
      address: TherapySessionAddress,
      abi: TherapySessionABI,
      functionName: 'getMerkleTreeDepth',
      args: [groupId],
    }),
    readContract(config, {
      address: TherapySessionAddress,
      abi: TherapySessionABI,
      functionName: 'getMerkleTreeSize',
      args: [groupId],
    }),
  ])

  return {
    id: groupId,
    root: BigInt(root),
    depth: Number(depth),
    size: Number(size),
  }
}
