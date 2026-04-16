// app/parametres/page.tsx
'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type Theme = 'ocean' | 'dark' | 'light'

const themes: { id: Theme; label: string; description: string; preview: string[] }[] = [
    {
        id: 'ocean',
        label: 'Océan',
        description: 'Thème bleu profond — par défaut',
        preview: ['#0d2137', '#0f2d45', '#2a5a7c'],
    },
    {
        id: 'dark',
        label: 'Sombre',
        description: 'Thème noir — idéal pour la nuit',
        preview: ['#0a0a0a', '#141414', '#3b82f6'],
    },
    {
        id: 'light',
        label: 'Clair',
        description: 'Thème blanc — confortable en journée',
        preview: ['#f0f4f8', '#ffffff', '#2563eb'],
    },
]

export default function ParametresPage() {
    const { theme, setTheme } = useTheme()
    const { user, logout } = useAuth()
    const router = useRouter()
    const [selectedTheme, setSelectedTheme] = useState<Theme>(theme)
    const [isChanged, setIsChanged] = useState(false)

    // Met à jour l'état local quand le thème global change (ex: via autre onglet)
    useEffect(() => {
        setSelectedTheme(theme)
        setIsChanged(false)
    }, [theme])

    const handleThemeChange = (newTheme: Theme) => {
        setSelectedTheme(newTheme)
        setIsChanged(true)
        // Appliquer immédiatement pour la preview (optionnel)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    const handleSave = () => {
        setTheme(selectedTheme)
        setIsChanged(false)
        // Optionnel : notification toast
        alert('Thème enregistré')
    }

    const handleCancel = () => {
        setSelectedTheme(theme)
        setIsChanged(false)
        document.documentElement.setAttribute('data-theme', theme)
    }

    return (
        <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Paramètres
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Personnalisez votre expérience
                        </p>
                    </div>
                </div>

                {/* Profil */}
                <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                        PROFIL
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                            {user?.prenom?.[0]}{user?.nom?.[0]}
                        </div>
                        <div>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {user?.prenom} {user?.nom}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Thèmes */}
                <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                        APPARENCE
                    </h2>
                    <div className="space-y-3">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleThemeChange(t.id)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left"
                                style={{
                                    backgroundColor: selectedTheme === t.id ? 'var(--accent)' : 'var(--bg-tertiary)',
                                    border: `2px solid ${selectedTheme === t.id ? 'var(--border-accent)' : 'transparent'}`,
                                }}
                            >
                                {/* Aperçu couleurs */}
                                <div className="flex gap-1 shrink-0">
                                    {t.preview.map((color, i) => (
                                        <div
                                            key={i}
                                            className="rounded-full"
                                            style={{
                                                backgroundColor: color,
                                                width: i === 0 ? '28px' : '20px',
                                                height: i === 0 ? '28px' : '20px',
                                                marginTop: i === 1 ? '4px' : i === 2 ? '8px' : '0',
                                                border: '2px solid rgba(255,255,255,0.1)',
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Label */}
                                <div className="flex-1">
                                    <p className="text-sm font-medium" style={{
                                        color: selectedTheme === t.id ? '#fff' : 'var(--text-primary)'
                                    }}>
                                        {t.label}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{
                                        color: selectedTheme === t.id ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'
                                    }}>
                                        {t.description}
                                    </p>
                                </div>

                                {/* Check */}
                                {selectedTheme === t.id && (
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Déconnexion */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                        SESSION
                    </h2>
                    <button
                        onClick={logout}
                        className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                        style={{ backgroundColor: '#3d1a1a', color: '#e24b4a' }}
                    >
                        Se déconnecter
                    </button>
                </div>

            </div>
        </div>
    )
}