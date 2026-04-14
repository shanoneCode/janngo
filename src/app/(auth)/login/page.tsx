'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    mot_de_passe: z.string().min(1, 'Ce champ est requis'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [role, setRole] = useState<'etudiant' | 'admin'>('etudiant')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginForm) => {
        setError('')
        setIsLoading(true)
        try {

            await login({
                email: data.email,
                mot_de_passe: data.mot_de_passe
            })
        } catch (err: any) {
            setError(err.message || 'Identifiants incorrects. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d2137' }}>
            <div className="w-full max-w-sm mx-4 rounded-2xl p-8" style={{ backgroundColor: '#0f2d45' }}>

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-widest">JANNGO</h1>
                    <p className="text-sm mt-1" style={{ color: '#7a9bb5' }}>
                        Gestion des requêtes étudiantes
                    </p>
                </div>

                {/* Toggle rôle (UI seulement, le backend détermine le rôle) */}
                <div className="flex rounded-lg p-1 mb-6" style={{ backgroundColor: '#1a3a52' }}>
                    <button
                        type="button"
                        onClick={() => setRole('etudiant')}
                        className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                        style={{
                            backgroundColor: role === 'etudiant' ? '#2a5a7c' : 'transparent',
                            color: role === 'etudiant' ? '#ffffff' : '#7a9bb5',
                        }}
                    >
                        Etudiants
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                        style={{
                            backgroundColor: role === 'admin' ? '#2a5a7c' : 'transparent',
                            color: role === 'admin' ? '#ffffff' : '#7a9bb5',
                        }}
                    >
                        Administration
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>
                            Email
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 transition-all"
                            style={{
                                backgroundColor: '#1a3a52',
                                border: errors.email ? '1px solid #e24b4a' : '1px solid transparent',
                            }}
                            placeholder="exemple@iut.cm"
                        />
                        {errors.email && (
                            <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>
                            Mot de passe
                        </label>
                        <input
                            {...register('mot_de_passe')}
                            type="password"
                            className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 transition-all"
                            style={{
                                backgroundColor: '#1a3a52',
                                border: errors.mot_de_passe ? '1px solid #e24b4a' : '1px solid transparent',
                            }}
                            placeholder=""
                        />
                        {errors.mot_de_passe && (
                            <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>
                                {errors.mot_de_passe.message}
                            </p>
                        )}
                    </div>

                    {/* Erreur API */}
                    {error && (
                        <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#3d1a1a', color: '#e24b4a' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg font-semibold text-sm tracking-widest transition-all mt-2"
                        style={{
                            backgroundColor: isLoading ? '#1a3a52' : '#2a5a7c',
                            color: isLoading ? '#7a9bb5' : '#ffffff',
                        }}
                    >
                        {isLoading ? 'CONNEXION...' : 'CONNEXION'}
                    </button>
                </form>

                {/* Lien register */}
                <p className="text-center text-xs mt-6" style={{ color: '#7a9bb5' }}>
                    Pas encore de compte ?{' '}
                    <a href="/register" style={{ color: '#4a9eca' }} className="hover:underline">
                        S'inscrire
                    </a>
                </p>

                {/* Infos de test */}
                {/* <div className="mt-4 p-2 rounded-lg" style={{ backgroundColor: '#1a3a52' }}>
                    <p className="text-xs text-center" style={{ color: '#7a9bb5' }}>
                        Test: samuel@iut.cm / password123
                    </p>
                </div> */}
            </div>
        </div>
    )
}