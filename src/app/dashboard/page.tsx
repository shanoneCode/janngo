'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardRedirect() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login')
            } else if (user.role === 'admin' || user.role === 'administration') {
                router.push('/admin/dashboard')
            } else if (user.role === 'enseignant') {
                router.push('/enseignant/dashboard')
            } else {
                router.push('/etudiant/dashboard')
            }
        }
    }, [user, isLoading, router])

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d2137' }}>
            <div className="text-white">Redirection...</div>
        </div>
    )
}