'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'

const registerSchema = z.object({
    nom: z.string().min(2, 'Minimum 2 caractères'),
    prenom: z.string().min(2, 'Minimum 2 caractères'),
    email: z.string().email('Email invalide'),
    mot_de_passe: z.string().min(8, 'Minimum 8 caractères'),
    confirmPassword: z.string(),
    matricule: z.string().min(4, 'Matricule invalide'),
    filiere: z.string().min(2, 'Filière requise'),
    niveau: z.string().min(1, 'Niveau requis'),
}).refine((data) => data.mot_de_passe === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            nom: '', prenom: '', email: '', mot_de_passe: '',
            confirmPassword: '', matricule: '',
            filiere: 'Génie Logiciel', niveau: 'Licence 1',
        },
    })

    const onSubmit = async (data: RegisterForm) => {
        setError('')
        setIsLoading(true)
        try {
            await axiosInstance.post('/auth/register', {
                nom: data.nom, prenom: data.prenom, email: data.email,
                mot_de_passe: data.mot_de_passe, role: 'etudiant',
                matricule: data.matricule, filiere: data.filiere, niveau: data.niveau,
            })
            router.push('/login')
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription.")
        } finally {
            setIsLoading(false)
        }
    }

    const fields = [
        { name: 'nom' as const, label: 'Nom', type: 'text' },
        { name: 'prenom' as const, label: 'Prénom', type: 'text' },
        { name: 'matricule' as const, label: 'Matricule', type: 'text', placeholder: 'IUT2026XXX' },
        { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'exemple@iut.cm' },
        { name: 'filiere' as const, label: 'Filière', type: 'text', placeholder: 'Génie Logiciel / Réseaux' },
        { name: 'niveau' as const, label: 'Niveau', type: 'text', placeholder: 'Licence 1 / Licence 2' },
        { name: 'mot_de_passe' as const, label: 'Mot de passe', type: 'password' },
        { name: 'confirmPassword' as const, label: 'Confirmer le mot de passe', type: 'password' },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center py-8"
            style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-full max-w-sm mx-4 rounded-2xl p-8"
                style={{ backgroundColor: 'var(--bg-secondary)' }}>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-widest"
                        style={{ color: 'var(--text-primary)' }}>JANNGO</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Créer un compte étudiant
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-xs mb-1"
                                style={{ color: 'var(--text-secondary)' }}>
                                {field.label}
                            </label>
                            <input
                                {...register(field.name)}
                                type={field.type}
                                placeholder={field.placeholder || ''}
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
                        {isLoading ? 'INSCRIPTION...' : "S'INSCRIRE"}
                    </button>
                </form>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
                    Déjà un compte ?{' '}
                    <a href="/login" style={{ color: 'var(--link)' }} className="hover:underline">
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    )
}