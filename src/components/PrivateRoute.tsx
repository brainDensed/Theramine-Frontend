import { JSX } from 'react';
import { useIdentityStore } from '../lib/store/identityStore'
import { Navigate } from 'react-router';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { commitment } = useIdentityStore()

  if (!commitment) {
    // Not logged in → redirect to homepage or login
    return <Navigate to="/" replace />
  }

  return children
}
