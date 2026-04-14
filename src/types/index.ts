export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: 'etudiant' | 'enseignant' | 'admin' | 'administration'
  matricule?: string
  filiere?: string
  niveau?: string
}

export interface LoginCredentials {
  email: string
  mot_de_passe: string
}

export interface LoginResponse {
  message: string
  token: string
  user: User
}

export interface Requete {
  id: number
  type_requete: string
  titre: string
  statut_actuel: string
  created_at: string
  details?: any
}