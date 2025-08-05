import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Identity } from '@semaphore-protocol/identity'

type IdentityState = {
  identity: Identity | null
  commitment: string | null
  role: 'User' | 'Therapist' | null
  setIdentity: (identity: Identity, commitment: string, role: 'User' | 'Therapist') => void
  clearIdentity: () => void
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      identity: null,
      commitment: null,
      role: null,
      setIdentity: (identity, commitment, role) =>
        set({ identity, commitment, role }),
      clearIdentity: () =>
        set({ identity: null, commitment: null, role: null }),
    }),
    {
      name: 'identity-store',
      partialize: (state) => ({
        commitment: state.commitment,
        role: state.role,
      }),
    }
  )
)
