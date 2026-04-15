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
    const [activeTab, setActiveTab] = useState<'toutes' | 'en_attente' | 'en_cours' | 'traitee'>('toutes')

    useEffect(() => {
        if (!isLoading && !user) router.push('/login')
    }, [user, isLoading, router])

    useEffect(() => {
        if (!user) return
        const fetchRequetes = async () => {
            try {
                const response = await axiosInstance.get(`/requetes/etudiant/${user.id}`)
                setRequetes(response.data)
            } catch (error) {
                console.error('Erreur chargement requêtes:', error)
            } finally {
                setLoadingRequetes(false)
            }
        }
        fetchRequetes()
        const interval = setInterval(fetchRequetes, 30000)
        return () => clearInterval(interval)
    }, [user])

    const total = requetes.length
    const enAttente = requetes.filter(r => r.statut_actuel === 'en_attente').length
    const enCours = requetes.filter(r => r.statut_actuel === 'en_cours').length
    const traitee = requetes.filter(r => r.statut_actuel === 'traitee').length
    const rejetee = requetes.filter(r => r.statut_actuel === 'rejetee').length

    const requetesFiltrees = activeTab === 'toutes'
        ? requetes
        : requetes.filter(r => r.statut_actuel === activeTab)

    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'en_attente': return { backgroundColor: '#2a1f00', color: '#f59e0b' }
            case 'en_cours': return { backgroundColor: '#001a3a', color: '#60a5fa' }
            case 'traitee': return { backgroundColor: '#002a1a', color: '#4ade80' }
            case 'rejetee': return { backgroundColor: '#3d1a1a', color: '#e24b4a' }
            default: return { backgroundColor: '#1a3a52', color: '#7a9bb5' }
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

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'erreur_nom': return 'Scolarité'
            case 'changement_note': return 'Administrative'
            default: return type
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d2137' }}>
                <div className="text-white text-sm">Chargement...</div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0d2137' }}>

            {/* ========== LAYOUT DESKTOP ========== */}
            <div className="hidden md:flex min-h-screen">

                {/* Sidebar desktop */}
                <aside className="w-64 min-h-screen flex flex-col border-r"
                    style={{ backgroundColor: '#0f2d45', borderColor: '#1a3a52' }}>

                    {/* Logo */}
                    <div className="p-6 border-b" style={{ borderColor: '#1a3a52' }}>
                        <h1 className="text-2xl font-bold text-white tracking-wider">JANNGO</h1>
                    </div>

                    {/* User info */}
                    <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ borderColor: '#1a3a52' }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: '#2a5a7c', color: '#fff' }}>
                            {user.prenom?.[0]}{user.nom?.[0]}
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium">{user.prenom} {user.nom}</p>
                            <p className="text-xs" style={{ color: '#7a9bb5' }}>{user.role}</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-4">
                        <button className="w-full text-left px-6 py-3 flex items-center gap-3 border-l-4 transition-all"
                            style={{ backgroundColor: '#1a3a52', borderColor: '#2a5a7c', color: '#ffffff' }}>
                            <span></span>
                            <span className="text-sm">Mes requêtes</span>
                        </button>
                        <button className="w-full text-left px-6 py-3 flex items-center gap-3 border-l-4 border-transparent transition-all"
                            style={{ color: '#7a9bb5' }}>
                            <span></span>
                            <span className="text-sm">Assistant</span>
                        </button>
                        <button className="w-full text-left px-6 py-3 flex items-center gap-3 border-l-4 border-transparent transition-all"
                            style={{ color: '#7a9bb5' }}>
                            <span></span>
                            <span className="text-sm">Paramètres</span>
                        </button>
                    </nav>

                    {/* Déconnexion */}
                    <div className="p-4 border-t" style={{ borderColor: '#1a3a52' }}>
                        <button onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all"
                            style={{ color: '#e24b4a' }}>
                            <span></span>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </aside>

                {/* Contenu desktop */}
                <main className="flex-1 p-8">
                    <DashboardContent
                        user={user}
                        requetes={requetes}
                        requetesFiltrees={requetesFiltrees}
                        loadingRequetes={loadingRequetes}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        total={total}
                        enAttente={enAttente}
                        enCours={enCours}
                        traitee={traitee}
                        rejetee={rejetee}
                        getStatutColor={getStatutColor}
                        getStatutLabel={getStatutLabel}
                        getTypeLabel={getTypeLabel}
                        router={router}
                    />
                </main>
            </div>

            {/* ========== LAYOUT MOBILE ========== */}
            <div className="md:hidden flex flex-col min-h-screen pb-20">

                {/* Header mobile */}
                <header className="px-4 py-4 flex items-center justify-between border-b"
                    style={{ backgroundColor: '#0f2d45', borderColor: '#1a3a52' }}>
                    <h1 className="text-lg font-bold text-white tracking-wider">janngo</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: '#2a5a7c', color: '#fff' }}>
                            {user.prenom?.[0]}{user.nom?.[0]}
                        </div>
                    </div>
                </header>

                {/* Contenu mobile */}
                <main className="flex-1 px-4 py-5 overflow-y-auto">
                    <DashboardContent
                        user={user}
                        requetes={requetes}
                        requetesFiltrees={requetesFiltrees}
                        loadingRequetes={loadingRequetes}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        total={total}
                        enAttente={enAttente}
                        enCours={enCours}
                        traitee={traitee}
                        rejetee={rejetee}
                        getStatutColor={getStatutColor}
                        getStatutLabel={getStatutLabel}
                        getTypeLabel={getTypeLabel}
                        router={router}
                    />
                </main>

                {/* Bottom navigation mobile */}
                <nav className="fixed bottom-0 left-0 right-0 flex border-t z-50"
                    style={{ backgroundColor: '#0f2d45', borderColor: '#1a3a52' }}>
                    <button className="flex-1 flex flex-col items-center py-3 gap-1"
                        style={{ color: '#4a9eca' }}>
                        <span className="text-xl"></span>
                        <span className="text-xs">Requêtes</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center py-3 gap-1"
                        style={{ color: '#7a9bb5' }}>
                        <span className="text-xl"></span>
                        <span className="text-xs">Assistant</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center py-3 gap-1"
                        style={{ color: '#7a9bb5' }}>
                        <span className="text-xl"></span>
                        <span className="text-xs">Paramètres</span>
                    </button>
                    <button onClick={logout}
                        className="flex-1 flex flex-col items-center py-3 gap-1"
                        style={{ color: '#e24b4a' }}>
                        <span className="text-xl"></span>
                        <span className="text-xs">Deconnexion</span>
                    </button>
                </nav>
            </div>
        </div>
    )
}

// ========== COMPOSANT CONTENU PARTAGÉ ==========
function DashboardContent({
    user, requetes, requetesFiltrees, loadingRequetes,
    activeTab, setActiveTab, total, enAttente, enCours, traitee, rejetee,
    getStatutColor, getStatutLabel, getTypeLabel, router
}: any) {

    return (
        <>
            {/* Titre + bouton */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Tableau de bord</h2>
                    <p className="text-xs mt-0.5" style={{ color: '#7a9bb5' }}>
                        Bonjour , {user.prenom}
                    </p>
                </div>
                <button
                    onClick={() => router.push('/requetes/nouveau/erreur-nom')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: '#2a5a7c', color: '#fff' }}>
                    <span>+</span>
                    <span className="hidden sm:inline">Nouvelle requête</span>
                    <span className="sm:hidden">Nouveau</span>
                </button>
            </div>

            {/* Cartes stats — 5 colonnes */}
            <div className="grid grid-cols-5 gap-2 mb-6">
                {[
                    { label: 'Total', value: total, color: '#60a5fa', border: '#1a4a7a' },
                    { label: 'En attente', value: enAttente, color: '#f59e0b', border: '#3a2a00' },
                    { label: 'En cours', value: enCours, color: '#60a5fa', border: '#1a3a6a' },
                    { label: 'Traitée', value: traitee, color: '#4ade80', border: '#003a20' },
                    { label: 'Rejetée', value: rejetee, color: '#e24b4a', border: '#3d1a1a' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-2 text-center border"
                        style={{ backgroundColor: '#0f2d45', borderColor: stat.border }}>
                        <div className="w-6 h-1 rounded mx-auto mb-2" style={{ backgroundColor: stat.color }} />
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                        <p className="text-xs mt-1 leading-tight" style={{ color: '#7a9bb5' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Section requêtes */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0f2d45' }}>

                {/* Header + filtres */}
                <div className="px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2"
                    style={{ borderColor: '#1a3a52' }}>
                    <h3 className="text-sm font-medium text-white">Mes requêtes</h3>
                    <div className="flex gap-1 flex-wrap">
                        {[
                            { key: 'toutes', label: 'Toutes' },
                            { key: 'en_attente', label: 'En attente' },
                            { key: 'en_cours', label: 'En cours' },
                            { key: 'traitee', label: 'traitee' },
                            { key: 'rejetee', label: 'rejetee' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="px-3 py-1 rounded-full text-xs transition-all"
                                style={{
                                    backgroundColor: activeTab === tab.key ? '#2a5a7c' : '#1a3a52',
                                    color: activeTab === tab.key ? '#fff' : '#7a9bb5',
                                }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tableau desktop / Cartes mobile */}
                {loadingRequetes ? (
                    <div className="text-center py-10" style={{ color: '#7a9bb5' }}>Chargement...</div>
                ) : requetesFiltrees.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-sm" style={{ color: '#7a9bb5' }}>Aucune requête trouvée.</p>
                    </div>
                ) : (
                    <>
                        {/* Vue tableau — desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b" style={{ borderColor: '#1a3a52', backgroundColor: '#0d2137' }}>
                                        {['TYPE', 'SUJET', 'DATE', 'STATUT'].map(h => (
                                            <th key={h} className="text-left py-3 px-6 text-xs font-medium"
                                                style={{ color: '#7a9bb5' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {requetesFiltrees.map((req: Requete) => (
                                        <tr key={req.id} className="border-b transition-all hover:opacity-80"
                                            style={{ borderColor: '#1a3a52' }}>
                                            <td className="py-3 px-6 text-white">{getTypeLabel(req.type_requete)}</td>
                                            <td className="py-3 px-6 text-white">{req.titre}</td>
                                            <td className="py-3 px-6 text-xs" style={{ color: '#7a9bb5' }}>
                                                {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className="px-2 py-1 rounded-full text-xs"
                                                    style={getStatutColor(req.statut_actuel)}>
                                                    {getStatutLabel(req.statut_actuel)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Vue cartes — mobile */}
                        <div className="md:hidden divide-y" style={{ borderColor: '#1a3a52' }}>
                            {requetesFiltrees.map((req: Requete) => (
                                <div key={req.id} className="px-4 py-4 flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs mb-1" style={{ color: '#7a9bb5' }}>
                                            {getTypeLabel(req.type_requete)}
                                        </p>
                                        <p className="text-sm text-white font-medium truncate">{req.titre}</p>
                                        <p className="text-xs mt-1" style={{ color: '#4a6a7a' }}>
                                            {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 rounded-full text-xs shrink-0"
                                        style={getStatutColor(req.statut_actuel)}>
                                        {getStatutLabel(req.statut_actuel)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}