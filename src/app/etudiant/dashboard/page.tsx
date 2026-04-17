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
    const [activeTab, setActiveTab] = useState<'toutes' | 'en_attente' | 'en_cours' | 'traitee' | 'rejetee'>('toutes')

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

    const getStatutColor = (statut: string): React.CSSProperties => {
        switch (statut) {
            case 'en_attente': return { backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)', color: 'var(--warning)' }
            case 'en_cours': return { backgroundColor: 'color-mix(in srgb, var(--info) 15%, transparent)', color: 'var(--info)' }
            case 'traitee': return { backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)', color: 'var(--success)' }
            case 'rejetee': return { backgroundColor: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)' }
            default: return { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }
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
            <div className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ color: 'var(--text-primary)' }} className="text-sm">Chargement...</div>
            </div>
        )
    }

    if (!user) return null

    const sidebarNavItems = [
        { label: 'Mes requêtes', active: true, onClick: () => { } },
        { label: 'Assistant', active: false, onClick: () => { } },
        { label: 'Paramètres', active: false, onClick: () => router.push('/parametres') },
    ]

    const bottomNavItems = [
        { label: 'Requêtes', active: true, onClick: () => { } },
        { label: 'Assistant', active: false, onClick: () => { } },
        { label: 'Paramètres', active: false, onClick: () => router.push('/parametres') },
        { label: 'Déconnexion', active: false, onClick: logout, danger: true },
    ]

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>

            {/* ========== LAYOUT DESKTOP ========== */}
            <div className="hidden md:flex min-h-screen">
                <aside className="w-64 min-h-screen flex flex-col border-r"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>

                    <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h1 className="text-2xl font-bold tracking-wider"
                            style={{ color: 'var(--text-primary)' }}>JANNGO</h1>
                    </div>

                    <div className="px-6 py-4 flex items-center gap-3 border-b"
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}>
                            {user.prenom?.[0]}{user.nom?.[0]}
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                {user.prenom} {user.nom}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.role}</p>
                        </div>
                    </div>

                    <nav className="flex-1 py-4">
                        {sidebarNavItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className="w-full text-left px-6 py-3 flex items-center gap-3 border-l-4 transition-all"
                                style={{
                                    backgroundColor: item.active ? 'var(--bg-tertiary)' : 'transparent',
                                    borderColor: item.active ? 'var(--border-accent)' : 'transparent',
                                    color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)',
                                }}>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <button onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all"
                            style={{ color: 'var(--danger)' }}>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-8">
                    <DashboardContent
                        user={user} requetes={requetes} requetesFiltrees={requetesFiltrees}
                        loadingRequetes={loadingRequetes} activeTab={activeTab} setActiveTab={setActiveTab}
                        total={total} enAttente={enAttente} enCours={enCours} traitee={traitee} rejetee={rejetee}
                        getStatutColor={getStatutColor} getStatutLabel={getStatutLabel}
                        getTypeLabel={getTypeLabel} router={router}
                    />
                </main>
            </div>

            {/* ========== LAYOUT MOBILE ========== */}
            <div className="md:hidden flex flex-col min-h-screen pb-20">
                <header className="px-4 py-4 flex items-center justify-between border-b"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                    <h1 className="text-lg font-bold tracking-wider"
                        style={{ color: 'var(--text-primary)' }}>JANNGO</h1>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}>
                        {user.prenom?.[0]}{user.nom?.[0]}
                    </div>
                </header>

                <main className="flex-1 px-4 py-5 overflow-y-auto">
                    <DashboardContent
                        user={user} requetes={requetes} requetesFiltrees={requetesFiltrees}
                        loadingRequetes={loadingRequetes} activeTab={activeTab} setActiveTab={setActiveTab}
                        total={total} enAttente={enAttente} enCours={enCours} traitee={traitee} rejetee={rejetee}
                        getStatutColor={getStatutColor} getStatutLabel={getStatutLabel}
                        getTypeLabel={getTypeLabel} router={router}
                    />
                </main>

                <nav className="fixed bottom-0 left-0 right-0 flex border-t z-50"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                    {bottomNavItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className="flex-1 flex flex-col items-center py-3 gap-1 transition-all"
                            style={{
                                color: item.danger ? 'var(--danger)' : item.active ? 'var(--link)' : 'var(--text-secondary)',
                            }}>
                            <span className="text-xl">{ }</span>
                            <span className="text-xs">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}

function DashboardContent({
    user, requetesFiltrees, loadingRequetes, activeTab, setActiveTab,
    total, enAttente, enCours, traitee, rejetee,
    getStatutColor, getStatutLabel, getTypeLabel, router
}: any) {
    return (
        <>
            {/* Titre + bouton */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Tableau de bord
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Bonjour, {user.prenom}
                    </p>
                </div>
                <button
                    onClick={() => router.push('/requetes/nouveau/erreur-nom')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}>
                    <span>+</span>
                    <span className="hidden sm:inline">Nouvelle requête</span>
                    <span className="sm:hidden">Nouveau</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-2 mb-6">
                {[
                    { label: 'Total', value: total, color: 'var(--info)', border: 'color-mix(in srgb, var(--info) 30%, transparent)' },
                    { label: 'En attente', value: enAttente, color: 'var(--warning)', border: 'color-mix(in srgb, var(--warning) 30%, transparent)' },
                    { label: 'En cours', value: enCours, color: 'var(--info)', border: 'color-mix(in srgb, var(--info) 30%, transparent)' },
                    { label: 'Traitée', value: traitee, color: 'var(--success)', border: 'color-mix(in srgb, var(--success) 30%, transparent)' },
                    { label: 'Rejetée', value: rejetee, color: 'var(--danger)', border: 'color-mix(in srgb, var(--danger) 30%, transparent)' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-2 text-center border"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: stat.border }}>
                        <div className="w-6 h-1 rounded mx-auto mb-2"
                            style={{ backgroundColor: stat.color }} />
                        <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            {stat.value}
                        </p>
                        <p className="text-xs mt-1 leading-tight" style={{ color: 'var(--text-secondary)' }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Section requêtes */}
            <div className="rounded-xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary)' }}>

                <div className="px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2"
                    style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Mes requêtes
                    </h3>
                    <div className="flex gap-1 flex-wrap">
                        {[
                            { key: 'toutes', label: 'Toutes' },
                            { key: 'en_attente', label: 'En attente' },
                            { key: 'en_cours', label: 'En cours' },
                            { key: 'traitee', label: 'Traitée' },
                            { key: 'rejetee', label: 'Rejetée' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="px-3 py-1 rounded-full text-xs transition-all"
                                style={{
                                    backgroundColor: activeTab === tab.key ? 'var(--accent)' : 'var(--bg-tertiary)',
                                    color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                                }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loadingRequetes ? (
                    <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>
                        Chargement...
                    </div>
                ) : requetesFiltrees.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Aucune requête trouvée.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Vue tableau desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b"
                                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}>
                                        {['TYPE', 'SUJET', 'DATE', 'STATUT'].map(h => (
                                            <th key={h} className="text-left py-3 px-6 text-xs font-medium"
                                                style={{ color: 'var(--text-secondary)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {requetesFiltrees.map((req: Requete) => (
                                        <tr key={req.id} className="border-b transition-all"
                                            style={{ borderColor: 'var(--border)' }}>
                                            <td className="py-3 px-6" style={{ color: 'var(--text-primary)' }}>
                                                {getTypeLabel(req.type_requete)}
                                            </td>
                                            <td className="py-3 px-6" style={{ color: 'var(--text-primary)' }}>
                                                {req.titre}
                                            </td>
                                            <td className="py-3 px-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
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

                        {/* Vue cartes mobile */}
                        <div className="md:hidden divide-y" style={{ borderColor: 'var(--border)' }}>
                            {requetesFiltrees.map((req: Requete) => (
                                <div key={req.id} className="px-4 py-4 flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                                            {getTypeLabel(req.type_requete)}
                                        </p>
                                        <p className="text-sm font-medium truncate"
                                            style={{ color: 'var(--text-primary)' }}>{req.titre}</p>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-hint)' }}>
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