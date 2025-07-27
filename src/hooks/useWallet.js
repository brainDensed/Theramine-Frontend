import { useConnect } from 'wagmi'

export function useWallet() {
  const { connect, connectors, isLoading, error } = useConnect()

  const connectMetaMask = async () => {
    const connector = connectors.find(c => c.name === 'MetaMask')
    if (connector) {
      await connect({ connector })
    }
  }

  return {
    connectMetaMask,
    isLoading,
    error
  }
}