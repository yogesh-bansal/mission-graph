import { Implementation, toMetaMaskSmartAccount } from "@metamask/smart-accounts-kit";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

export async function bootstrapMissionSmartAccount({
  rpcUrl = process.env.MISSION_RPC_URL,
  privateKey = process.env.MISSION_OWNER_PRIVATE_KEY
} = {}) {
  if (!rpcUrl || !privateKey) {
    throw new Error("MISSION_RPC_URL and MISSION_OWNER_PRIVATE_KEY must be set.");
  }

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl)
  });

  const account = privateKeyToAccount(privateKey);

  return toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [account.address, [], [], []],
    deploySalt: "0x",
    signer: { account }
  });
}
