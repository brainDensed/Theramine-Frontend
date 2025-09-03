import { useAccount } from 'wagmi'
import { Navigate } from 'react-router'

export default function PrivateRoute({ children }) {
  const { isConnected } = useAccount() // wagmi hook for wallet connection status

  if (!isConnected) {
    // Wallet not connected → redirect to homepage
    return <Navigate to="/" replace />
  }

  return children
}
