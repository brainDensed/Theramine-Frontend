import { getWalletClient, getAccount, writeContract } from "wagmi/actions";
import { Identity } from "@semaphore-protocol/identity";
import {
  TheramineRegistryAddress,
  TheramineRegistryABI,
} from "../contracts/TheramineRegistry";
import { config } from "../../config/config";

export async function RegisterUser() {
  try {
    const walletClient = await getWalletClient(config);
    const address = getAccount(config);

    if (!walletClient || !address) {
      return { success: false, error: "Wallet not connected" };
    }

    const signature = await walletClient.signMessage({
      message: "Theramine User Registration",
    });

    const identity = new Identity(signature);
    const commitment = identity.commitment;

    await writeContract(config, {
      address: TheramineRegistryAddress,
      abi: TheramineRegistryABI,
      functionName: "registerUser",
      args: [commitment],
    });
    return {
      success: true,
      commitment: commitment.toString(),
      identity,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Unknown error",
    };
  }
}
