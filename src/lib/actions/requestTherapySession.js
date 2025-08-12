import { generateProof } from "@semaphore-protocol/proof";
import { keccak256, toHex } from "viem";
import { useIdentityStore } from "../store/identityStore";
import {
  TherapySessionABI,
  TherapySessionAddress,
} from "../contracts/TherapySession";
import { TheramineRegistryAddress } from "../contracts/TheramineRegistry";
import { getGroupDetails } from "./GetGroupDetails";


export async function requestTherapySession({ therapist }, publicClient) {
  try {
    // 1. Load identity from store
    const { identity, commitment } = useIdentityStore.getState();
    if (!identity || !commitment) throw new Error("Identity not set");

    const details = await getGroupDetails(1n)
    console.log("details", details);

    // 2. Fetch all members from the Semaphore subgraph
    // const {semaphoreAddress, group} = await getGroupInfo(TheramineRegistryAddress, publicClient);
    // console.log("semaphoreAddress", semaphoreAddress);
    // console.log("group",group);
    // // 4. Prepare signal + chat room ID
    const offChainRoomId = generateChatRoomId(commitment, therapist);
    const signal = BigInt(`0x${offChainRoomId.slice(2)}`);

    // 5. Generate proof
    // const fullProof = await generateProof(identity, group, group.root, signal);

    // const solidityProof = [
    //   fullProof.proof.a[0],
    //   fullProof.proof.a[1],
    //   fullProof.proof.b[0][0],
    //   fullProof.proof.b[0][1],
    //   fullProof.proof.b[1][0],
    //   fullProof.proof.b[1][1],
    //   fullProof.proof.c[0],
    //   fullProof.proof.c[1],
    // ];

    // 6. Call contract
    // const walletClient = await getWalletClient(config);
    // const hash = await walletClient.writeContract({
    //   address: TherapySessionAddress,
    //   abi: TherapySessionABI,
    //   functionName: "requestSession",
    //   args: [
    //     therapist,
    //     fullProof.merkleTreeRoot,
    //     fullProof.nullifier,
    //     signal,
    //     solidityProof,
    //     offChainRoomId,
    //   ],
    // });

    return { success: true };
  } catch (err) {
    console.error("Request session failed:", err);
    // return { success: false, error: err.message };
  }
  }

function generateChatRoomId(commitment, therapistAddress, salt = "") {
  const input = commitment.toString() + therapistAddress.toLowerCase() + salt;
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(input);
  const hash = keccak256(toHex(byteArray)); // viem needs hex input
  return hash.slice(0, 42);
}
