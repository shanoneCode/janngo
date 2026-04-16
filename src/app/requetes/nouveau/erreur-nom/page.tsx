'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'

const erreurNomSchema = z.object({
    titre: z.string().min(3, 'Titre trop court'),
    description: z.string().min(10, 'Description trop courte'),
    ancien_nom: z.string().min(2, 'Ancien nom requis'),
    nouveau_nom: z.string().min(2, 'Nouveau nom requis'),
    justificatif_url: z.string().min(1, 'Veuillez fournir un justificatif'),
})

type ErreurNomForm = z.infer<typeof erreurNomSchema>

export default function ErreurNomPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [fileName, setFileName] = useState('')
    const router = useRouter()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ErreurNomForm>({
        resolver: zodResolver(erreurNomSchema),
        defaultValues: { titre: 'Correction de mon nom' },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            setValue('justificatif_url', file.name, { shouldValidate: true })
        }
    }

    const onSubmit = async (data: ErreurNomForm) => {
        setError('')
        setIsLoading(true)
        try {
            await axiosInstance.post('/requetes/erreur-nom', data)
            setSuccess(true)
            setTimeout(() => router.push('/dashboard'), 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la soumission.')
        } finally {
            setIsLoading(false)
        }
    }

    const inputStyle = (hasError: boolean) => ({
        backgroundColor: 'var(--bg-input)',
        color: 'var(--text-primary)',
        border: hasError ? '1px solid var(--danger)' : '1px solid transparent',
    })

    return (
        <div className="min-h-screen py-10 px-4"
            style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        ←
                    </button>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Correction de nom
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Soumettre une requête de correction
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="rounded-xl px-5 py-4 mb-6 text-sm"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)', color: 'var(--success)' }}>
                        ✓ Requête soumise avec succès ! Redirection...
                    </div>
                )}

                <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Titre */}
                        <div>
                            <label className="block text-xs mb-1 font-medium"
                                style={{ color: 'var(--text-secondary)' }}>
                                Titre de la requête
                            </label>
                            <input
                                {...register('titre')} type="text"
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                                style={inputStyle(!!errors.titre)}
                            />
                            {errors.titre && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.titre.message}</p>}
                        </div>

                        {/* Ancien nom */}
                        <div>
                            <label className="block text-xs mb-1 font-medium"
                                style={{ color: 'var(--text-secondary)' }}>
                                Ancien nom (tel qu'il apparaît dans les registres)
                            </label>
                            <input
                                {...register('ancien_nom')} type="text" placeholder="Ex: NYTAM"
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                                style={inputStyle(!!errors.ancien_nom)}
                            />
                            {errors.ancien_nom && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.ancien_nom.message}</p>}
                        </div>

                        {/* Nouveau nom */}
                        <div>
                            <label className="block text-xs mb-1 font-medium"
                                style={{ color: 'var(--text-secondary)' }}>
                                Nouveau nom (correct)
                            </label>
                            <input
                                {...register('nouveau_nom')} type="text" placeholder="Ex: NYETAM"
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                                style={inputStyle(!!errors.nouveau_nom)}
                            />
                            {errors.nouveau_nom && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.nouveau_nom.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs mb-1 font-medium"
                                style={{ color: 'var(--text-secondary)' }}>
                                Description / Motif
                            </label>
                            <textarea
                                {...register('description')} rows={3}
                                placeholder="Expliquez pourquoi vous demandez cette correction..."
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-none"
                                style={inputStyle(!!errors.description)}
                            />
                            {errors.description && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.description.message}</p>}
                        </div>

                        {/* Justificatif */}
                        <div>
                            <label className="block text-xs mb-1 font-medium"
                                style={{ color: 'var(--text-secondary)' }}>
                                Justificatif (acte de naissance, CNI...)
                            </label>
                            <label
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg cursor-pointer transition-all"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    border: errors.justificatif_url ? '1px solid var(--danger)' : '1px dashed var(--border-accent)',
                                }}>
                                <span style={{ color: 'var(--link)' }}>📎</span>
                                <span className="text-sm"
                                    style={{ color: fileName ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                    {fileName || 'Cliquer pour choisir un fichier'}
                                </span>
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange} className="hidden" />
                            </label>
                            {errors.justificatif_url && (
                                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>
                                    {errors.justificatif_url.message}
                                </p>
                            )}
                            <p className="text-xs mt-1" style={{ color: 'var(--text-hint)' }}>
                                Formats acceptés : PDF, JPG, PNG
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-lg px-4 py-3 text-sm"
                                style={{ backgroundColor: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)' }}>
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => router.back()}
                                className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                Annuler
                            </button>
                            <button type="submit" disabled={isLoading || success}
                                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all"
                                style={{
                                    backgroundColor: isLoading ? 'var(--bg-tertiary)' : 'var(--accent)',
                                    color: isLoading ? 'var(--text-secondary)' : 'var(--text-primary)',
                                }}>
                                {isLoading ? 'Envoi...' : 'Soumettre'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}