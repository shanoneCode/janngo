'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
    const { user, logout, isLoading } = useAuth()
    const router = useRouter()


    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d2137' }}>
                <div className="text-white">Chargement...</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0d2137' }}>
            {/* Header */}
            <header className="border-b" style={{ backgroundColor: '#0f2d45', borderColor: '#1a3a52' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-white">JANNGO</h1>
                            <p className="text-xs" style={{ color: '#7a9bb5' }}>
                                Gestion des requêtes étudiantes
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-white">{user.prenom} {user.nom}</p>
                                <p className="text-xs" style={{ color: '#7a9bb5' }}>{user.role}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-lg text-sm transition-all"
                                style={{ backgroundColor: '#2a5a7c', color: '#fff' }}
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Carte d'information */}
                    <div className="rounded-lg p-6" style={{ backgroundColor: '#0f2d45' }}>
                        <h2 className="text-white font-semibold mb-2">Bienvenue</h2>
                        <p className="text-sm" style={{ color: '#7a9bb5' }}>
                            Vous êtes connecté en tant qu'étudiant à l'IUT.
                        </p>
                    </div>

                    {/* Carte statistiques */}
                    <div className="rounded-lg p-6" style={{ backgroundColor: '#0f2d45' }}>
                        <h2 className="text-white font-semibold mb-2">Statistiques</h2>
                        <p className="text-sm" style={{ color: '#7a9bb5' }}>
                            Consultez vos requêtes et leur statut.
                        </p>
                    </div>

                    {/* Carte actions */}
                    <div className="rounded-lg p-6" style={{ backgroundColor: '#0f2d45' }}>
                        <h2 className="text-white font-semibold mb-2">Actions rapides</h2>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ backgroundColor: '#1a3a52', color: '#fff' }}>
                                Nouvelle requête
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ backgroundColor: '#1a3a52', color: '#fff' }}>
                                Mes requêtes
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}