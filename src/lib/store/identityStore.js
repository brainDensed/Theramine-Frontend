import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useIdentityStore = create(
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
        identity: state.identity,
      }),
    }
  )
)
