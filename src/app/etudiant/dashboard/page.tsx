'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios'

interface Requete {
    id: number
    type_requete: string
    titre: string
    statut_actuel: string
    created_at: string
}

export default function EtudiantDashboard() {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()
    const [requetes, setRequetes] = useState<Requete[]>([])
    const [loadingRequetes, setLoadingRequetes] = useState(true)

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (user) {
            fetchRequetes()
        }
    }, [user])

    const fetchRequetes = async () => {
        try {
            const response = await axiosInstance.get(`/requetes/etudiant/${user?.id}`)
            setRequetes(response.data)
        } catch (error) {
            console.error('Erreur chargement requêtes:', error)
        } finally {
            setLoadingRequetes(false)
        }
    }

    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'en_attente': return 'bg-yellow-500/20 text-yellow-400'
            case 'en_cours': return 'bg-blue-500/20 text-blue-400'
            case 'traitee': return 'bg-green-500/20 text-green-400'
            case 'rejetee': return 'bg-red-500/20 text-red-400'
            default: return 'bg-gray-500/20 text-gray-400'
        }
    }

    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case 'en_attente': return 'En attente'
            case 'en_cours': return 'En cours'
            case 'traitee': return 'Traitée'
            case 'rejetee': return 'Rejetée'
            default: return statut
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d2137' }}>
                <div className="text-white">Chargement...</div>
            </div>
        )
    }

    if (!user) return null

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
                                <p className="text-xs" style={{ color: '#7a9bb5' }}>Étudiant</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne gauche - Nouvelle requête */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg p-6" style={{ backgroundColor: '#0f2d45' }}>
                            <h2 className="text-white font-semibold mb-4">Nouvelle requête</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/requetes/nouveau/erreur-nom')}
                                    className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
                                    style={{ backgroundColor: '#1a3a52', color: '#fff' }}
                                >
                                    Correction de nom
                                </button>
                                <button
                                    onClick={() => router.push('/requetes/nouveau/changement-note')}
                                    className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
                                    style={{ backgroundColor: '#1a3a52', color: '#fff' }}
                                >
                                    Contestation de note
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Mes requêtes */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg p-6" style={{ backgroundColor: '#0f2d45' }}>
                            <h2 className="text-white font-semibold mb-4">Mes requêtes</h2>
                            {loadingRequetes ? (
                                <p className="text-sm" style={{ color: '#7a9bb5' }}>Chargement...</p>
                            ) : requetes.length === 0 ? (
                                <p className="text-sm" style={{ color: '#7a9bb5' }}>Aucune requête pour le moment.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b" style={{ borderColor: '#1a3a52' }}>
                                                <th className="text-left py-2" style={{ color: '#7a9bb5' }}>TYPE</th>
                                                <th className="text-left py-2" style={{ color: '#7a9bb5' }}>SUJET</th>
                                                <th className="text-left py-2" style={{ color: '#7a9bb5' }}>DATE</th>
                                                <th className="text-left py-2" style={{ color: '#7a9bb5' }}>STATUT</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}