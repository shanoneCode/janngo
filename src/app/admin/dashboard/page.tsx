'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios'

interface Requete {
    id: number
    titre: string
    type_requete: string
    statut_actuel: string
    etudiant: {
        nom: string
        prenom: string
        email: string
    }
    created_at: string
}

export default function AdminDashboard() {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()
    const [requetes, setRequetes] = useState<Requete[]>([])
    const [stats, setStats] = useState({ total: 0, enAttente: 0, enCours: 0, transmise: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        try {
            // Récupérer toutes les requêtes (à adapter selon votre API)
            const response = await axiosInstance.get('/requetes')
            const allRequetes = response.data

            setRequetes(allRequetes)

            // Calculer les statistiques
            const total = allRequetes.length
            const enAttente = allRequetes.filter((r: Requete) => r.statut_actuel === 'en_attente').length
            const enCours = allRequetes.filter((r: Requete) => r.statut_actuel === 'en_cours').length
            const transmise = allRequetes.filter((r: Requete) => r.statut_actuel === 'traitee').length

            setStats({ total, enAttente, enCours, transmise })
        } catch (error) {
            console.error('Erreur chargement données:', error)
        } finally {
            setLoading(false)
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
            case 'traitee': return 'Transmise'
            case 'rejetee': return 'Rejetée'
            default: return statut
        }
    }

    if (isLoading || loading) {
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
                                Administration - Gestion des requêtes
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-white">{user.prenom} {user.nom}</p>
                                <p className="text-xs" style={{ color: '#7a9bb5' }}>Administrateur</p>
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

            {/* Sidebar + Main layout */}
            <div className="flex">
                {/* Sidebar gauche */}
                <aside className="w-64 min-h-screen border-r" style={{ backgroundColor: '#0f2d45', borderColor: '#1a3a52' }}>
                    <nav className="p-4 space-y-2">
                        <button className="w-full text-left px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: '#2a5a7c', color: '#fff' }}>
                            📊 Aperçu
                        </button>
                        <button className="w-full text-left px-4 py-2 rounded-lg text-sm" style={{ color: '#7a9bb5' }}>
                            📋 Transmises
                        </button>
                        <button className="w-full text-left px-4 py-2 rounded-lg text-sm" style={{ color: '#7a9bb5' }}>
                            ⚙️ Paramètres
                        </button>
                    </nav>
                </aside>

                {/* Contenu principal */}
                <main className="flex-1 p-6">
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0f2d45' }}>
                            <p className="text-xs" style={{ color: '#7a9bb5' }}>Total</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0f2d45' }}>
                            <p className="text-xs" style={{ color: '#7a9bb5' }}>En attente</p>
                            <p className="text-2xl font-bold text-yellow-400">{stats.enAttente}</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0f2d45' }}>
                            <p className="text-xs" style={{ color: '#7a9bb5' }}>En cours</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.enCours}</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0f2d45' }}>
                            <p className="text-xs" style={{ color: '#7a9bb5' }}>Transmise</p>
                            <p className="text-2xl font-bold text-green-400">{stats.transmise}</p>
                        </div>
                    </div>

                    {/* Liste des requêtes en attente */}
                    <div className="rounded-lg p-6" style={{ backgroundColor: '#0f2d45' }}>
                        <h2 className="text-white font-semibold mb-4">En attente de traitement</h2>
                        {requetes.filter(r => r.statut_actuel === 'en_attente').length === 0 ? (
                            <p className="text-sm" style={{ color: '#7a9bb5' }}>Aucune requête en attente.</p>
                        ) : (
                            <div className="space-y-3">
                                {requetes.filter(r => r.statut_actuel === 'en_attente').map((req) => (
                                    <div key={req.id} className="p-4 rounded-lg" style={{ backgroundColor: '#1a3a52' }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-white font-medium">{req.etudiant?.nom} {req.etudiant?.prenom}</p>
                                                <p className="text-xs" style={{ color: '#7a9bb5' }}>{req.titre}</p>
                                                <p className="text-xs" style={{ color: '#7a9bb5' }}>Type: {req.type_requete === 'erreur_nom' ? 'Correction nom' : 'Contestation note'}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(req.statut_actuel)}`}>
                                                {getStatutLabel(req.statut_actuel)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}