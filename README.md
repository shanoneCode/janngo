# IUT Requêtes — Frontend (Next.js et tailwind css)

# version utilisée
```
Next.js v16.2.3
node js v20.20.1
"tailwindcss": "^4"

```

**État d’avancement** : Authentification complète, dashboards par rôle, structure prête pour les formulaires de requêtes.

## Installation et lancement

```bash
npm install
npm run dev
#L’application tourne sur http://localhost:3000
```
Assurez-vous que le **backend**  est démarré sur `http://localhost:5000` et que la variable d’environnement est correcte :

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Fonctionnalités déjà réalisées 

### Authentification
- **Connexion** (`/login`) avec email + mot de passe  
- **Inscription** (`/register`) avec validation des champs (nom, prénom, email, matricule, filière, niveau)  
- **Stockage sécurisé** du token JWT dans les cookies  
- **Context** `AuthContext` + hook `useAuth`  
- **Interceptor Axios** : ajout automatique du `Bearer` token à chaque requête  
- **Gestion des erreurs** (identifiants incorrects, email déjà utilisé, etc.)  
- **Déconnexion** (suppression des cookies, redirection)

### Navigation et rôles
- Redirection automatique après connexion vers le **dashboard** adapté au rôle :
  - `etudiant` → `/etudiant/dashboard`
  - `admin` / `administration` → `/admin/dashboard`
- Page `dashboard` générique qui redirige en fonction du rôle stocké.

### Dashboards

####  Dashboard étudiant (`/etudiant/dashboard`)
- Section **Nouvelle requête** (boutons pour correction de nom / contestation de note) – *pages à implémenter*
- Section **Mes requêtes** – tableau listant toutes les requêtes de l’étudiant avec :
  - Type (correction de nom / changement de note)
  - Sujet (titre)
  - Date
  - Statut

#### Dashboard administrateur (`/admin/dashboard`)
- Barre latérale : Aperçu, Transmises, Paramètres
- **Cartes de statistiques** : Total / En attente / En cours / Transmise
- Liste des requêtes **en attente de traitement** avec nom de l’étudiant, sujet, type et statut

## Structure actuelle du projet

```
frontend/
├── app/
│   ├── (auth)/               # Layout dédié à l’auth
│   │   ├── login/page.tsx    Connexion
│   │   └── register/page.tsx Inscription
│   ├── admin/dashboard/      Dashboard admin
│   ├── dashboard/page.tsx    Redirection par rôle
│   ├── etudiant/dashboard/   Dashboard étudiant
│   └── layout.tsx
├── contexts/
│   └── AuthContext.tsx       Authentification + token
├── lib/
│   └── axios.ts              Intercepteurs JWT
├── types/                    Types TypeScript
├── .env.local                À configurer (API_URL)
```

##  Prochaines étapes (T3 & T4)

| Tâche | Description | Deadline |
|-------|-------------|----------|
| T3 | Page `/requetes/nouveau/erreur-nom` – formulaire correction de nom avec upload justificatif | 12/04 |
| T4 | Page `/requetes/nouveau/changement-note` – formulaire contestation de note | 13/04 |

 Les formulaires devront utiliser `React Hook Form` + `Zod` et appeler les endpoints `/requetes/erreur-nom` et `/requetes/changement-note`.

## 🔧 Scripts utiles

```bash
npm run dev      # Mode développement
npm run build    # Build production
npm run start    # Lancer le build
```

## Auteurs

- **shanone** – Frontend  et integration API
- **Austine** – Frontend 

---

**Documentation mise à jour le 14/04/2026** – Backend fonctionnel, authentification et dashboards opérationnels.

