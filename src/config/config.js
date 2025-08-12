import { http, createConfig } from 'wagmi'
import { base, mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WC_PROJECT_ID
const sepoliaRPCUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;

export const config = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(sepoliaRPCUrl),
  },
})