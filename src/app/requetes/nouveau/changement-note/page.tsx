'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'

const changementNoteSchema = z.object({
    code_matiere: z.string().min(1, 'Ce champ est requis'),
    intitule_matiere: z.string().min(2, 'Minimum 2 caractères'),
    note_obtenue: z
        .string()
        .min(1, 'Ce champ est requis')
        .refine((v) => !isNaN(parseFloat(v)), 'Doit être un nombre')
        .refine((v) => parseFloat(v) >= 0 && parseFloat(v) <= 20, 'La note doit être entre 0 et 20'),
    note_attendue: z
        .string()
        .min(1, 'Ce champ est requis')
        .refine((v) => !isNaN(parseFloat(v)), 'Doit être un nombre')
        .refine((v) => parseFloat(v) >= 0 && parseFloat(v) <= 20, 'La note doit être entre 0 et 20'),
    semestre: z.enum(['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], {
        errorMap: () => ({ message: 'Veuillez sélectionner un semestre' }),
    }),
    annee_academique: z.string().min(1, 'Ce champ est requis'),
    motif: z.string().min(20, 'Veuillez détailler votre motif (min. 20 caractères)'),
    type_erreur: z.enum(['saisie', 'calcul', 'absence_note', 'autre'], {
        errorMap: () => ({ message: 'Veuillez sélectionner un type d\'erreur' }),
    }),
}).refine(
    (data) => parseFloat(data.note_attendue) !== parseFloat(data.note_obtenue),
    {
        message: 'La note attendue doit être différente de la note obtenue',
        path: ['note_attendue'],
    }
)

type ChangementNoteForm = z.infer<typeof changementNoteSchema>

const TYPE_ERREUR_LABELS: Record<string, string> = {
    saisie: 'Erreur de saisie',
    calcul: 'Erreur de calcul',
    absence_note: 'Note absente / non enregistrée',
    autre: 'Autre',
}

export default function ChangementNotePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ChangementNoteForm>({
        resolver: zodResolver(changementNoteSchema),
    })

    const noteObtenue = watch('note_obtenue')
    const noteAttendue = watch('note_attendue')

    const onSubmit = async (data: ChangementNoteForm) => {
        setError('')
        setIsLoading(true)
        try {
            await axiosInstance.post('/requetes/changement-note', {
                code_matiere: data.code_matiere,
                intitule_matiere: data.intitule_matiere,
                note_obtenue: parseFloat(data.note_obtenue),
                note_attendue: parseFloat(data.note_attendue),
                semestre: data.semestre,
                annee_academique: data.annee_academique,
                type_erreur: data.type_erreur,
                motif: data.motif,
            })
            setSuccess(true)
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d2137' }}>
                <div className="w-full max-w-sm mx-4 rounded-2xl p-8 text-center" style={{ backgroundColor: '#0f2d45' }}>
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#0d3320' }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Requête envoyée</h2>
                    <p className="text-sm mb-6" style={{ color: '#7a9bb5' }}>
                        Votre contestation de note a bien été transmise. Le service de scolarité en sera informé.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-3 rounded-lg font-semibold text-sm tracking-widest"
                        style={{ backgroundColor: '#2a5a7c', color: '#ffffff' }}
                    >
                        RETOUR AU TABLEAU DE BORD
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0d2137' }}>
            <div className="w-full max-w-lg mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm mb-4 transition-opacity hover:opacity-70"
                        style={{ color: '#7a9bb5' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#7a9bb5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Retour
                    </button>
                    <h1 className="text-2xl font-bold text-white">Contestation de note</h1>
                    <p className="text-sm mt-1" style={{ color: '#7a9bb5' }}>
                        Signalez une erreur sur une note enregistrée dans votre relevé.
                    </p>
                </div>

                <div className="rounded-2xl p-6" style={{ backgroundColor: '#0f2d45' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Matière */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a9eca' }}>
                                Matière concernée
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Code matière</label>
                                    <input
                                        {...register('code_matiere')}
                                        type="text"
                                        placeholder="ex. INF301"
                                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: '#1a3a52',
                                            border: errors.code_matiere ? '1px solid #e24b4a' : '1px solid transparent',
                                        }}
                                    />
                                    {errors.code_matiere && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.code_matiere.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Semestre</label>
                                    <select
                                        {...register('semestre')}
                                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: '#1a3a52',
                                            border: errors.semestre ? '1px solid #e24b4a' : '1px solid transparent',
                                        }}
                                    >
                                        <option value="">-- Semestre --</option>
                                        {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    {errors.semestre && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.semestre.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Intitulé de la matière</label>
                                <input
                                    {...register('intitule_matiere')}
                                    type="text"
                                    placeholder="ex. Algorithmique et structures de données"
                                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                    style={{
                                        backgroundColor: '#1a3a52',
                                        border: errors.intitule_matiere ? '1px solid #e24b4a' : '1px solid transparent',
                                    }}
                                />
                                {errors.intitule_matiere && (
                                    <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.intitule_matiere.message}</p>
                                )}
                            </div>

                            <div className="mt-3">
                                <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Année académique</label>
                                <input
                                    {...register('annee_academique')}
                                    type="text"
                                    placeholder="ex. 2024-2025"
                                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                    style={{
                                        backgroundColor: '#1a3a52',
                                        border: errors.annee_academique ? '1px solid #e24b4a' : '1px solid transparent',
                                    }}
                                />
                                {errors.annee_academique && (
                                    <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.annee_academique.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a9eca' }}>
                                Notes
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Note obtenue (enregistrée)</label>
                                    <div className="relative">
                                        <input
                                            {...register('note_obtenue')}
                                            type="number"
                                            step="0.25"
                                            min="0"
                                            max="20"
                                            placeholder="0 – 20"
                                            className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all pr-10"
                                            style={{
                                                backgroundColor: '#1a3a52',
                                                border: errors.note_obtenue ? '1px solid #e24b4a' : '1px solid transparent',
                                            }}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#7a9bb5' }}>/20</span>
                                    </div>
                                    {errors.note_obtenue && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.note_obtenue.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Note attendue (correcte)</label>
                                    <div className="relative">
                                        <input
                                            {...register('note_attendue')}
                                            type="number"
                                            step="0.25"
                                            min="0"
                                            max="20"
                                            placeholder="0 – 20"
                                            className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all pr-10"
                                            style={{
                                                backgroundColor: '#1a3a52',
                                                border: errors.note_attendue ? '1px solid #e24b4a' : '1px solid transparent',
                                            }}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#7a9bb5' }}>/20</span>
                                    </div>
                                    {errors.note_attendue && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.note_attendue.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Visualisation de l'écart */}
                            {noteObtenue && noteAttendue &&
                                !isNaN(parseFloat(noteObtenue)) && !isNaN(parseFloat(noteAttendue)) &&
                                parseFloat(noteAttendue) !== parseFloat(noteObtenue) && (
                                    <div
                                        className="mt-3 px-4 py-2.5 rounded-lg flex items-center justify-between text-sm"
                                        style={{ backgroundColor: '#1a3a52' }}
                                    >
                                        <span style={{ color: '#7a9bb5' }}>Écart constaté</span>
                                        <span
                                            className="font-semibold"
                                            style={{
                                                color: parseFloat(noteAttendue) > parseFloat(noteObtenue) ? '#4ade80' : '#e24b4a',
                                            }}
                                        >
                                            {parseFloat(noteAttendue) > parseFloat(noteObtenue) ? '+' : ''}
                                            {(parseFloat(noteAttendue) - parseFloat(noteObtenue)).toFixed(2)} pts
                                        </span>
                                    </div>
                                )}
                        </div>

                        {/* Type d'erreur */}
                        <div>
                            <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Type d&apos;erreur constatée</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.entries(TYPE_ERREUR_LABELS) as [ChangementNoteForm['type_erreur'], string][]).map(([val, label]) => (
                                    <label
                                        key={val}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                                        style={{ backgroundColor: '#1a3a52' }}
                                    >
                                        <input
                                            {...register('type_erreur')}
                                            type="radio"
                                            value={val}
                                            className="accent-blue-400"
                                        />
                                        <span className="text-xs" style={{ color: '#c0d8ea' }}>{label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.type_erreur && (
                                <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.type_erreur.message}</p>
                            )}
                        </div>

                        {/* Motif */}
                        <div>
                            <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>
                                Détails et justification
                            </label>
                            <textarea
                                {...register('motif')}
                                rows={4}
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all resize-none"
                                style={{
                                    backgroundColor: '#1a3a52',
                                    border: errors.motif ? '1px solid #e24b4a' : '1px solid transparent',
                                }}
                                placeholder="Expliquez précisément pourquoi vous contestez cette note (éléments de preuve, circonstances…)"
                            />
                            {errors.motif && (
                                <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.motif.message}</p>
                            )}
                        </div>

                        {/* Erreur API */}
                        {error && (
                            <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#3d1a1a', color: '#e24b4a' }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-lg font-semibold text-sm tracking-widest transition-all mt-2"
                            style={{
                                backgroundColor: isLoading ? '#1a3a52' : '#2a5a7c',
                                color: isLoading ? '#7a9bb5' : '#ffffff',
                            }}
                        >
                            {isLoading ? 'ENVOI EN COURS...' : 'SOUMETTRE LA CONTESTATION'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
