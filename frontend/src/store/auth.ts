import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserData } from '@/lib/types'

interface AuthState {
    token: string | null
    user: UserData | null
    logindata: (token: string, user: UserData) => void
    logout: () => void
}

const initialState = {
    token: null,
    user: null,
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            ...initialState,
            logindata: (token, user) => {
                localStorage.setItem('auth_token', token)
                localStorage.setItem('auth_user', JSON.stringify(user))
                set({ token, user })
            },
            logout: () => {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                set(initialState)
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                token: state.token,
                user: state.user
            }),
            onRehydrateStorage: () => (state) => {
                // Intentar recuperar datos del localStorage al iniciar
                const token = localStorage.getItem('auth_token')
                const userStr = localStorage.getItem('auth_user')
                
                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr)
                        state?.logindata(token, user)
                    } catch (e) {
                        console.error('Error al recuperar datos de autenticación:', e)
                        state?.logout()
                    }
                }
            }
        }
    )
)