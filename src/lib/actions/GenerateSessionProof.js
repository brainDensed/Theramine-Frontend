import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"

async function generateSessionProof(
    identity, 
    group,
    therapistAddress
) {
    // 1. The signal is arbitrary data that will be part of the proof
    // Here we can use the therapist's address as the signal
    const signal = BigInt(therapistAddress)

    // 2. Generate the full proof
    const fullProof = await generateProof(
        identity,
        group,
        signal,
        signal, // Using same value for scope/external nullifier
        {
            zkeyFilePath: "./semaphore.zkey",
            wasmFilePath: "./semaphore.wasm"
        }
    )

    // 3. Return the required parameters
    return {
        therapist: therapistAddress,
        merkleTreeRoot: fullProof.merkleTreeRoot,
        nullifierHash: fullProof.nullifier,
        signal: signal.toString(),
        proof: fullProof.points, // This is the uint256[8] proof array
    }
}