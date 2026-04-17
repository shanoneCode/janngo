'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

const erreurNomSchema = z.object({
    nom_actuel: z.string().min(1, 'Ce champ est requis'),
    prenom_actuel: z.string().min(1, 'Ce champ est requis'),
    nom_correct: z.string().min(2, 'Minimum 2 caractères'),
    prenom_correct: z.string().min(2, 'Minimum 2 caractères'),
    motif: z.string().min(10, 'Veuillez préciser le motif (min. 10 caractères)'),
    justificatif: z
        .custom<FileList>()
        .refine((files) => files && files.length > 0, 'Un justificatif est requis')
        .refine(
            (files) => files && files[0]?.size <= MAX_FILE_SIZE,
            'Le fichier ne doit pas dépasser 5 Mo'
        )
        .refine(
            (files) => files && ACCEPTED_TYPES.includes(files[0]?.type),
            'Format accepté : JPG, PNG ou PDF'
        ),
})

type ErreurNomForm = z.infer<typeof erreurNomSchema>

export default function ErreurNomPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [fileName, setFileName] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
    } = useForm<ErreurNomForm>({
        resolver: zodResolver(erreurNomSchema),
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setFileName(files[0].name)
            setValue('justificatif', files)
            trigger('justificatif')
        }
    }

    const onSubmit = async (data: ErreurNomForm) => {
        setError('')
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('nom_actuel', data.nom_actuel)
            formData.append('prenom_actuel', data.prenom_actuel)
            formData.append('nom_correct', data.nom_correct)
            formData.append('prenom_correct', data.prenom_correct)
            formData.append('motif', data.motif)
            formData.append('justificatif', data.justificatif[0])

            await axiosInstance.post('/requetes/erreur-nom', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
                        Votre demande de correction de nom a bien été transmise. Vous serez notifié de son traitement.
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
                    <h1 className="text-2xl font-bold text-white">Correction de nom</h1>
                    <p className="text-sm mt-1" style={{ color: '#7a9bb5' }}>
                        Renseignez les informations correctes et joignez un justificatif officiel.
                    </p>
                </div>

                <div className="rounded-2xl p-6" style={{ backgroundColor: '#0f2d45' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Nom / Prénom actuel */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a9eca' }}>
                                Informations actuelles (erronées)
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Nom actuel</label>
                                    <input
                                        {...register('nom_actuel')}
                                        type="text"
                                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: '#1a3a52',
                                            border: errors.nom_actuel ? '1px solid #e24b4a' : '1px solid transparent',
                                        }}
                                    />
                                    {errors.nom_actuel && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.nom_actuel.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Prénom actuel</label>
                                    <input
                                        {...register('prenom_actuel')}
                                        type="text"
                                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: '#1a3a52',
                                            border: errors.prenom_actuel ? '1px solid #e24b4a' : '1px solid transparent',
                                        }}
                                    />
                                    {errors.prenom_actuel && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.prenom_actuel.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Séparateur */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px" style={{ backgroundColor: '#1a3a52' }} />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="#4a9eca" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex-1 h-px" style={{ backgroundColor: '#1a3a52' }} />
                        </div>

                        {/* Nom / Prénom correct */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4ade80' }}>
                                Informations correctes
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Nom correct</label>
                                    <input
                                        {...register('nom_correct')}
                                        type="text"
                                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: '#1a3a52',
                                            border: errors.nom_correct ? '1px solid #e24b4a' : '1px solid transparent',
                                        }}
                                    />
                                    {errors.nom_correct && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.nom_correct.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Prénom correct</label>
                                    <input
                                        {...register('prenom_correct')}
                                        type="text"
                                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: '#1a3a52',
                                            border: errors.prenom_correct ? '1px solid #e24b4a' : '1px solid transparent',
                                        }}
                                    />
                                    {errors.prenom_correct && (
                                        <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.prenom_correct.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Motif */}
                        <div>
                            <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>Motif de la demande</label>
                            <textarea
                                {...register('motif')}
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-all resize-none"
                                style={{
                                    backgroundColor: '#1a3a52',
                                    border: errors.motif ? '1px solid #e24b4a' : '1px solid transparent',
                                }}
                                placeholder="Expliquez brièvement la raison de cette correction..."
                            />
                            {errors.motif && (
                                <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>{errors.motif.message}</p>
                            )}
                        </div>

                        {/* Upload justificatif */}
                        <div>
                            <label className="block text-xs mb-1" style={{ color: '#7a9bb5' }}>
                                Justificatif (acte de naissance, CNI, passeport…)
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-3 rounded-lg text-sm transition-all flex items-center gap-3"
                                style={{
                                    backgroundColor: '#1a3a52',
                                    border: errors.justificatif ? '1px solid #e24b4a' : '1px dashed #2a5a7c',
                                    color: fileName ? '#ffffff' : '#7a9bb5',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={fileName ? '#4a9eca' : '#7a9bb5'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="truncate">
                                    {fileName || 'Choisir un fichier (JPG, PNG, PDF — max 5 Mo)'}
                                </span>
                            </button>
                            {errors.justificatif && (
                                <p className="text-xs mt-1" style={{ color: '#e24b4a' }}>
                                    {errors.justificatif.message as string}
                                </p>
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
                            {isLoading ? 'ENVOI EN COURS...' : 'SOUMETTRE LA REQUÊTE'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
