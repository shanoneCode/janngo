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

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setError('')
        setIsLoading(true)
        try {
            await login({ email: data.email, mot_de_passe: data.mot_de_passe })
        } catch (err: any) {
            setError(err.message || 'Identifiants incorrects. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-full max-w-sm mx-4 rounded-2xl p-8"
                style={{ backgroundColor: 'var(--bg-secondary)' }}>

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-widest"
                        style={{ color: 'var(--text-primary)' }}>JANNGO</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Gestion des requêtes étudiantes
                    </p>
                </div>

                {/* Toggle rôle */}
                <div className="flex rounded-lg p-1 mb-6"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    {(['etudiant', 'admin'] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                            style={{
                                backgroundColor: role === r ? 'var(--accent)' : 'transparent',
                                color: role === r ? 'var(--text-primary)' : 'var(--text-secondary)',
                            }}
                        >
                            {r === 'etudiant' ? 'Etudiants' : 'Administration'}
                        </button>
                    ))}
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {[
                        { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'exemple@iut.cm' },
                        { name: 'mot_de_passe' as const, label: 'Mot de passe', type: 'password', placeholder: '' },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-xs mb-1"
                                style={{ color: 'var(--text-secondary)' }}>
                                {field.label}
                            </label>
                            <input
                                {...register(field.name)}
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    color: 'var(--text-primary)',
                                    border: errors[field.name] ? '1px solid var(--danger)' : '1px solid transparent',
                                }}
                            />
                            {errors[field.name] && (
                                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>
                                    {errors[field.name]?.message}
                                </p>
                            )}
                        </div>
                    ))}

                    {error && (
                        <div className="rounded-lg px-4 py-3 text-sm"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg font-semibold text-sm tracking-widest transition-all mt-2"
                        style={{
                            backgroundColor: isLoading ? 'var(--bg-tertiary)' : 'var(--accent)',
                            color: isLoading ? 'var(--text-secondary)' : 'var(--text-primary)',
                        }}
                    >
                        {isLoading ? 'CONNEXION...' : 'CONNEXION'}
                    </button>
                </form>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
                    Pas encore de compte ?{' '}
                    <a href="/register" style={{ color: 'var(--link)' }} className="hover:underline">
                        S'inscrire
                    </a>
                </p>
            </div>
        </div>
    )
}