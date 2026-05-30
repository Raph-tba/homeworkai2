# 🚀 Guide de Déploiement HomeworkAI

Ce guide t'explique comment déployer HomeworkAI sur Vercel **étape par étape**.

---

## 📋 Prérequis

Avant de commencer, tu dois avoir :

1. ✅ Un compte **GitHub** (gratuit) → [github.com](https://github.com)
2. ✅ Un compte **Vercel** (gratuit) → [vercel.com](https://vercel.com)
3. ✅ Une clé API **Mistral** → [console.mistral.ai](https://console.mistral.ai)
4. ✅ **Git** installé sur ton PC → [git-scm.com](https://git-scm.com)
5. ✅ **Node.js** installé → [nodejs.org](https://nodejs.org)

---

## 🔧 Étape 1 : Créer ton repo GitHub

### Option A : Depuis le terminal (recommandé)

```bash
# 1. Va dans ton dossier projet
cd chemin/vers/homeworkai

# 2. Initialise Git (si pas déjà fait)
git init

# 3. Ajoute tous les fichiers
git add .

# 4. Crée ton premier commit
git commit -m "Initial commit - HomeworkAI"

# 5. Va sur GitHub et crée un nouveau repo vide :
#    - Va sur https://github.com/new
#    - Nom : homeworkai
#    - Ne coche PAS "Initialize with README"
#    - Clique "Create repository"

# 6. Connecte ton repo local à GitHub (remplace TON_USERNAME)
git remote add origin https://github.com/TON_USERNAME/homeworkai.git

# 7. Pousse ton code
git branch -M main
git push -u origin main
```

### Option B : Depuis l'interface GitHub

1. Va sur [github.com/new](https://github.com/new)
2. Crée un repo nommé `homeworkai`
3. Téléverse tes fichiers via "Upload files"

---

## 🔑 Étape 2 : Obtenir ta clé API Mistral

1. Va sur [console.mistral.ai](https://console.mistral.ai)
2. Crée un compte ou connecte-toi
3. Va dans **API Keys** → **Create API Key**
4. Copie la clé (elle ressemble à : `sk-xxxxxxxxxxxxxxxxxxxxx`)
5. **GARDE-LA SECRÈTE** — ne la mets jamais dans ton code !

---

## 🌐 Étape 3 : Déployer sur Vercel

### 3.1 Connecter Vercel à GitHub

1. Va sur [vercel.com](https://vercel.com)
2. Clique **Sign Up** → **Continue with GitHub**
3. Autorise Vercel à accéder à ton compte GitHub

### 3.2 Importer ton projet

1. Sur le dashboard Vercel, clique **Add New...** → **Project**
2. Sélectionne ton repo `homeworkai`
3. Clique **Import**

### 3.3 Configurer le build

Dans les paramètres de configuration :

| Paramètre | Valeur |
|-----------|--------|
| Framework Preset | **Vite** |
| Root Directory | `.` (laisser vide) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 3.4 Ajouter la variable d'environnement

**⚠️ TRÈS IMPORTANT** — C'est là que tu mets ta clé API :

1. Déroule la section **Environment Variables**
2. Ajoute :
   - **Name** : `MISTRAL_API_KEY`
   - **Value** : `sk-ta-clé-api-mistral-ici`
3. Clique **Add**

### 3.5 Déployer !

1. Clique **Deploy**
2. Attends 1-2 minutes ⏳
3. Vercel te donne une URL comme : `https://homeworkai-xxx.vercel.app`

**🎉 Ton site est en ligne !**

---

## 🔄 Étape 4 : Mettre à jour ton site

À chaque fois que tu modifies ton code :

```bash
# 1. Ajoute tes modifications
git add .

# 2. Crée un commit
git commit -m "Description de ce que tu as changé"

# 3. Pousse sur GitHub
git push
```

**Vercel redéploie automatiquement** à chaque push sur GitHub !

---

## 🧪 Étape 5 : Tester l'API

Une fois déployé, tu peux tester l'API :

### Avec curl :

```bash
curl -X POST https://TON-SITE.vercel.app/api/check-homework \
  -H "Content-Type: application/json" \
  -d '{
    "matiere": "Mathématiques",
    "niveau": "3ème",
    "sujet": "Théorème de Pythagore",
    "questions": [
      {
        "question": "Calculer AB dans un triangle rectangle...",
        "reponse": "AB = 5 cm"
      }
    ]
  }'
```

### Avec JavaScript (dans ton frontend) :

```javascript
const response = await fetch('/api/check-homework', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    matiere: 'Mathématiques',
    niveau: '3ème',
    sujet: 'Théorème de Pythagore',
    questions: [
      {
        question: 'Calculer AB...',
        reponse: 'AB = 5 cm'
      }
    ],
    modeComparatif: false, // Optionnel
    multiRun: false        // Optionnel
  })
});

const data = await response.json();
console.log(data.correction);
```

---

## 🐛 Résolution de problèmes

### "MISTRAL_API_KEY is not defined"

→ Tu as oublié d'ajouter la variable d'environnement dans Vercel.
→ Va dans Project Settings → Environment Variables → Ajoute-la.

### "Build failed"

→ Lance `npm run build` en local pour voir l'erreur.
→ Corrige l'erreur, commit et push.

### "API returns 500"

→ Va dans Vercel → Ton projet → Functions → Regarde les logs.
→ L'erreur exacte s'affiche là.

### "CORS error"

→ C'est normal si tu testes depuis un autre domaine.
→ L'API est configurée pour accepter toutes les origines (`*`).

---

## 📁 Structure finale du projet

```
homeworkai/
├── api/
│   └── check-homework.js    ← Serverless function (backend)
├── src/
│   ├── components/          ← Composants React
│   ├── data/                ← Données et logique
│   └── App.tsx              ← Point d'entrée
├── public/                  ← Fichiers statiques
├── index.html               ← HTML de base
├── package.json             ← Dépendances
├── vercel.json              ← Config Vercel
├── vite.config.ts           ← Config Vite
└── DEPLOIEMENT.md           ← Ce guide
```

---

## 🎓 Pour aller plus loin

### Ajouter un domaine personnalisé

1. Va dans Vercel → Project Settings → Domains
2. Ajoute `homeworkai.fr` (ou autre)
3. Configure les DNS chez ton registrar

### Ajouter Supabase pour stocker les corrections

1. Crée un compte sur [supabase.com](https://supabase.com)
2. Crée un projet
3. Ajoute les variables d'environnement dans Vercel :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Modifie `api/check-homework.js` pour sauvegarder les corrections

### Ajouter l'authentification

1. Utilise Supabase Auth ou NextAuth
2. Ajoute un système de login/signup
3. Limite le nombre de corrections par utilisateur

---

## 🆘 Besoin d'aide ?

- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Documentation Mistral : [docs.mistral.ai](https://docs.mistral.ai)
- GitHub Issues : Crée une issue sur ton repo

---

**Bonne chance pour ton déploiement ! 🚀**
