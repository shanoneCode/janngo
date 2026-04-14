'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'


interface User {
    id: number
    nom: string
    prenom: string
    email: string
    role: 'etudiant' | 'enseignant' | 'admin' | 'administration'
}

interface LoginCredentials {
    email: string
    mot_de_passe: string
}

interface LoginResponse {
    message: string
    token: string
    user: User
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('access_token')
        const storedUser = Cookies.get('user')

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser)
                setUser(userData)
            } catch (error) {
                console.error('Erreur parsing user:', error)
                Cookies.remove('access_token')
                Cookies.remove('user')
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (credentials: LoginCredentials) => {
        try {


            const response = await axiosInstance.post<LoginResponse>('/auth/login', {
                email: credentials.email,
                mot_de_passe: credentials.mot_de_passe
            })

            const { token, user: userData } = response.data


            Cookies.set('access_token', token, { expires: 7 })
            Cookies.set('user', JSON.stringify(userData), { expires: 7 })

            setUser(userData)

            router.push('/dashboard')
            // if (userData.role === 'admin' || userData.role === 'administration') {
            //     router.push('/admin/dashboard')
            // } else if (userData.role === 'enseignant') {
            //     router.push('/enseignant/dashboard')
            // } else {
            //     router.push('/etudiant/dashboard')
            // }

        } catch (error: any) {
            console.error('Erreur login:', error)
            const message = error.response?.data?.message || 'Erreur de connexion'
            throw new Error(message)
        }
    }

    const logout = async () => {
        try {

            const token = Cookies.get('access_token')
            if (token) {
                await axiosInstance.post('/auth/logout')
            }
        } catch (error) {
            console.error('Erreur logout:', error)
        } finally {

            Cookies.remove('access_token')
            Cookies.remove('user')
            setUser(null)
            router.push('/login')
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider')
    }
    return context
}