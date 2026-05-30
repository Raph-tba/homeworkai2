// ═══════════════════════════════════════════════════════════════════════════
// HomeworkAI - Pipeline de Correction Avancé
// Serverless Function pour Vercel
// ═══════════════════════════════════════════════════════════════════════════

// ─── Configuration ───────────────────────────────────────────────────────────

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-large-latest';

// ─── Grilles de critères par matière ─────────────────────────────────────────

const GRILLES = {
  mathematiques: {
    criteres: [
      { id: 'connaissances', nom: 'Maîtrise des connaissances', poids: 25, description: 'Théorèmes, formules et propriétés correctement cités et utilisés.' },
      { id: 'raisonnement', nom: 'Qualité du raisonnement', poids: 30, description: 'Démarche logique, étapes clairement justifiées, rigueur mathématique.' },
      { id: 'calculs', nom: 'Exactitude des calculs', poids: 30, description: 'Calculs corrects, résultats exacts, unités appropriées.' },
      { id: 'redaction', nom: 'Clarté de la rédaction', poids: 15, description: 'Présentation soignée, réponse finale claire, phrases de conclusion.' },
    ],
  },
  francais: {
    criteres: [
      { id: 'comprehension', nom: 'Compréhension du sujet', poids: 20, description: 'Le sujet est compris et la problématique est clairement identifiée.' },
      { id: 'argumentation', nom: 'Qualité de l\'argumentation', poids: 25, description: 'Arguments pertinents, organisés logiquement et convaincants.' },
      { id: 'references', nom: 'Références et citations', poids: 25, description: 'Utilisation appropriée de citations du texte, références aux œuvres.' },
      { id: 'expression', nom: 'Expression écrite', poids: 15, description: 'Orthographe, grammaire, syntaxe, richesse du vocabulaire.' },
      { id: 'structure', nom: 'Structure et organisation', poids: 15, description: 'Introduction, développement structuré, conclusion.' },
    ],
  },
  histoire: {
    criteres: [
      { id: 'connaissances', nom: 'Connaissances factuelles', poids: 25, description: 'Dates, événements, personnages, lieux correctement mentionnés.' },
      { id: 'comprehension', nom: 'Compréhension des enjeux', poids: 25, description: 'Analyse des causes, conséquences et enjeux historiques.' },
      { id: 'argumentation', nom: 'Argumentation et analyse', poids: 25, description: 'Capacité à construire un raisonnement, à nuancer.' },
      { id: 'expression', nom: 'Expression et organisation', poids: 25, description: 'Qualité de l\'expression écrite, structure du propos.' },
    ],
  },
  philosophie: {
    criteres: [
      { id: 'problematisation', nom: 'Problématisation', poids: 25, description: 'Capacité à dégager une problématique, à questionner les présupposés.' },
      { id: 'conceptualisation', nom: 'Conceptualisation', poids: 20, description: 'Définition des concepts, vocabulaire philosophique précis.' },
      { id: 'argumentation', nom: 'Argumentation', poids: 25, description: 'Construction logique, articulation des idées, exemples pertinents.' },
      { id: 'references', nom: 'Références philosophiques', poids: 15, description: 'Mobilisation d\'auteurs, de doctrines, de textes.' },
      { id: 'expression', nom: 'Expression et rédaction', poids: 15, description: 'Clarté, précision, orthographe, structure.' },
    ],
  },
  sciences: {
    criteres: [
      { id: 'connaissances', nom: 'Connaissances scientifiques', poids: 25, description: 'Lois, formules, définitions, vocabulaire scientifique.' },
      { id: 'demarche', nom: 'Démarche scientifique', poids: 25, description: 'Hypothèses, protocole, analyse, interprétation.' },
      { id: 'calculs', nom: 'Calculs et unités', poids: 30, description: 'Applications numériques correctes, unités appropriées.' },
      { id: 'communication', nom: 'Communication scientifique', poids: 20, description: 'Schémas, graphiques, phrases de conclusion.' },
    ],
  },
  langues: {
    criteres: [
      { id: 'langue', nom: 'Utilisation de la langue cible', poids: 20, description: 'Réponse rédigée dans la bonne langue.' },
      { id: 'grammaire', nom: 'Correction grammaticale', poids: 25, description: 'Temps verbaux, accords, structures syntaxiques.' },
      { id: 'vocabulaire', nom: 'Richesse du vocabulaire', poids: 20, description: 'Variété lexicale, expressions idiomatiques.' },
      { id: 'contenu', nom: 'Pertinence du contenu', poids: 20, description: 'Réponse à la consigne, idées développées.' },
      { id: 'expression', nom: 'Qualité de l\'expression', poids: 15, description: 'Fluidité, enchaînements logiques.' },
    ],
  },
  general: {
    criteres: [
      { id: 'comprehension', nom: 'Compréhension', poids: 25, description: 'La question est comprise et la réponse est pertinente.' },
      { id: 'contenu', nom: 'Qualité du contenu', poids: 30, description: 'Exactitude des informations, pertinence des arguments.' },
      { id: 'justification', nom: 'Justification', poids: 25, description: 'Explications claires, raisonnement logique.' },
      { id: 'expression', nom: 'Expression écrite', poids: 20, description: 'Orthographe, grammaire, clarté, structure.' },
    ],
  },
};

// ─── Few-shot Examples ───────────────────────────────────────────────────────

const FEW_SHOT_EXAMPLES = `
<exemple_correction_1>
<question>Calculer AB dans un triangle rectangle ABC, rectangle en C, avec AC = 3 cm et BC = 4 cm.</question>
<reponse_eleve>AB = 5 cm</reponse_eleve>
<correction>
{
  "sous_notes": [
    {
      "critere": "Maîtrise des connaissances",
      "points_obtenus": 3,
      "points_max": 5,
      "justification": "Le résultat est correct mais le théorème de Pythagore n'est pas cité. En mathématiques, il faut TOUJOURS écrire : 'D'après le théorème de Pythagore...' avant d'appliquer la formule."
    },
    {
      "critere": "Qualité du raisonnement",
      "points_obtenus": 2,
      "points_max": 6,
      "justification": "Aucune étape de calcul n'est montrée. Le correcteur ne peut pas vérifier si la méthode est comprise. Il faut écrire : AB² = AC² + BC² = 9 + 16 = 25, donc AB = 5 cm."
    },
    {
      "critere": "Exactitude des calculs",
      "points_obtenus": 6,
      "points_max": 6,
      "justification": "Le résultat numérique est exact."
    },
    {
      "critere": "Clarté de la rédaction",
      "points_obtenus": 1,
      "points_max": 3,
      "justification": "Réponse trop brève. Il manque une phrase de conclusion du type : 'Donc la longueur AB est de 5 cm.'"
    }
  ],
  "note_finale": 12,
  "erreurs_majeures": [
    "Théorème de Pythagore non cité",
    "Calculs intermédiaires absents"
  ],
  "points_forts": [
    "Résultat correct"
  ],
  "recommandations_prioritaires": [
    "TOUJOURS citer le théorème avant de l'appliquer",
    "Montrer TOUTES les étapes du calcul",
    "Terminer par une phrase de réponse"
  ]
}
</correction>
</exemple_correction_1>

<exemple_correction_2>
<question>Analysez la figure de style dans : "La terre était grise et morte"</question>
<reponse_eleve>Il y a une métaphore car la terre est comparée à quelque chose de mort.</reponse_eleve>
<correction>
{
  "sous_notes": [
    {
      "critere": "Compréhension du sujet",
      "points_obtenus": 2,
      "points_max": 4,
      "justification": "L'élève identifie qu'il y a un procédé mais se trompe sur la nature exacte. 'Morte' n'est pas une métaphore ici mais une personnification (attribuer des caractéristiques humaines à la terre)."
    },
    {
      "critere": "Qualité de l'argumentation",
      "points_obtenus": 2,
      "points_max": 5,
      "justification": "L'explication est trop vague. Il faut analyser : 1) Le procédé exact (personnification), 2) Citer le texte entre guillemets, 3) Expliquer l'EFFET produit sur le lecteur."
    },
    {
      "critere": "Références et citations",
      "points_obtenus": 3,
      "points_max": 5,
      "justification": "La citation du texte est implicite mais pas mise entre guillemets. Il faut écrire : L'auteur utilise les termes « grise » et « morte »..."
    },
    {
      "critere": "Expression écrite",
      "points_obtenus": 2,
      "points_max": 3,
      "justification": "Expression correcte mais vocabulaire d'analyse littéraire insuffisant."
    },
    {
      "critere": "Structure",
      "points_obtenus": 1,
      "points_max": 3,
      "justification": "Réponse en une seule phrase. Structure attendue : Identification du procédé → Citation → Analyse → Effet."
    }
  ],
  "note_finale": 10,
  "erreurs_majeures": [
    "Confusion métaphore/personnification",
    "Absence d'analyse de l'effet sur le lecteur"
  ],
  "points_forts": [
    "Identification qu'il y a un procédé stylistique",
    "Tentative d'explication"
  ],
  "recommandations_prioritaires": [
    "Revoir les définitions des figures de style",
    "Utiliser la méthode P.A.E. : Procédé - Analyse - Effet",
    "Toujours citer le texte entre guillemets « »"
  ]
}
</correction>
</exemple_correction_2>
`;

// ─── Prompt V3 structuré ─────────────────────────────────────────────────────

function buildPromptV3(matiere, niveau, sujet, questions, grille, modeComparatif, previousCorrection) {
  const criteresTexte = grille.criteres
    .map((c) => `- ${c.nom} (${c.poids}%) : ${c.description}`)
    .join('\n');

  const questionsTexte = questions
    .map((q, i) => `Question ${i + 1}: ${q.question}\nRéponse de l'élève: ${q.reponse}`)
    .join('\n\n');

  const modeIteratifSection = previousCorrection
    ? `
<mode_iteratif>
ATTENTION : Ceci est une RESSOUMISSION. L'élève a corrigé sa copie après une première correction.

Correction précédente :
- Note précédente : ${previousCorrection.note_finale}/20
- Erreurs signalées : ${previousCorrection.erreurs_majeures?.join(', ') || 'Aucune'}

Tu dois :
1. Évaluer la nouvelle version
2. Identifier les AMÉLIORATIONS par rapport à la version précédente
3. Identifier les RÉGRESSIONS éventuelles
4. Évaluer la PROGRESSION globale
5. Remplir les champs "mode_iteratif" du JSON
</mode_iteratif>
`
    : '';

  const modeComparatifSection = modeComparatif
    ? `
<mode_comparatif>
L'élève a activé le MODE COMPARATIF. Tu dois fournir DEUX notes :
1. "note_officielle" : Note stricte selon les barèmes officiels, sans indulgence
2. "note_pedagogique" : Note encourageante qui valorise les efforts et les bonnes intuitions

Les deux notes doivent être justifiées.
</mode_comparatif>
`
    : '';

  return `<system>
Tu es un correcteur de devoirs expert pour le système éducatif français.
Tu dois être RIGOUREUX, PÉDAGOGIQUE et BIENVEILLANT.

RÈGLES ABSOLUES :
1. Ne JAMAIS inventer d'informations ou de règles qui n'existent pas
2. TOUJOURS justifier chaque point attribué ou retiré
3. La somme des sous-notes DOIT être égale à la note finale
4. La somme des barèmes DOIT être égale à 20
5. Si tu n'es pas sûr d'une information, DIS-LE explicitement
6. Sois DIRECT dans tes commentaires : dis ce qui ne va pas clairement
7. Indique ce que l'élève doit ARRÊTER de faire et ce qu'il DOIT faire
</system>

<context>
Matière : ${matiere}
Niveau : ${niveau || 'À détecter automatiquement'}
Sujet : ${sujet}
Barème total : 20 points
Référentiel : Programme officiel de l'Éducation nationale française
</context>

<grille_evaluation>
Critères de notation pour ${matiere} :
${criteresTexte}
</grille_evaluation>

<few_shot_examples>
Voici des exemples de corrections bien faites pour t'inspirer :
${FEW_SHOT_EXAMPLES}
</few_shot_examples>

${modeComparatifSection}
${modeIteratifSection}

<devoir_eleve>
${questionsTexte}
</devoir_eleve>

<instructions_correction>
1. Lis attentivement chaque réponse
2. Évalue selon CHAQUE critère de la grille
3. Attribue des points justifiés
4. Sois PRÉCIS sur les erreurs : cite ce qui ne va pas
5. Sois CONSTRUCTIF : explique comment s'améliorer
6. Vérifie que la somme des sous-notes = note finale
7. Vérifie la COHÉRENCE : une note élevée = peu d'erreurs majeures
8. Si le niveau n'est pas précisé, DÉTECTE-LE à partir du contenu
9. Indique ton niveau de CONFIANCE dans ta correction (0-100)
</instructions_correction>

<output_format>
Réponds UNIQUEMENT en JSON valide. Pas de texte avant ni après.
Structure EXACTE attendue :
{
  "niveau_detecte": "college_6e | college_5e | college_4e | college_3e | seconde | premiere | terminale | superieur",
  "matiere": "${matiere}",
  "note_finale": <number 0-20>,
  "bareme_total": 20,
  "confiance": <number 0-100>,
  "sous_notes": [
    {
      "critere": "<nom du critère>",
      "points_obtenus": <number>,
      "points_max": <number>,
      "justification": "<explication détaillée>"
    }
  ],
  "points_forts": ["<string>"],
  "erreurs_majeures": ["<string>"],
  "a_arreter": ["<ce que l'élève doit arrêter de faire>"],
  "a_faire_absolument": ["<ce que l'élève doit faire>"],
  "recommandations_prioritaires": ["<string>"],
  "explication_pedagogique": "<explication longue et détaillée de la correction, avec analyse des erreurs et conseils>",
  "coherence_note": "<explication de pourquoi cette note est cohérente avec les erreurs/points forts>",
  "ressources_suggerees": ["<liens ou références pour progresser>"]${
    modeComparatif
      ? `,
  "mode_comparatif": {
    "note_officielle": <number>,
    "note_pedagogique": <number>,
    "justification_ecart": "<pourquoi les notes diffèrent>"
  }`
      : ''
  }${
    previousCorrection
      ? `,
  "mode_iteratif": {
    "progression": "significative | moderee | faible | regression",
    "ameliorations": ["<ce qui s'est amélioré>"],
    "regressions": ["<ce qui a régressé, si applicable>"],
    "evolution_note": "<comparaison avec la note précédente>",
    "encouragements": "<message d'encouragement personnalisé>"
  }`
      : ''
  }
}
</output_format>`;
}

// ─── Prompt de Self-Review ───────────────────────────────────────────────────

function buildSelfReviewPrompt(originalCorrection, matiere, niveau) {
  return `<system>
Tu es un VÉRIFICATEUR de corrections. Tu dois relire une correction faite par une IA et vérifier qu'elle est cohérente et juste.
</system>

<correction_a_verifier>
${JSON.stringify(originalCorrection, null, 2)}
</correction_a_verifier>

<instructions_verification>
Vérifie les points suivants :

1. COHÉRENCE MATHÉMATIQUE :
   - La somme des points_obtenus de chaque sous_note = note_finale ?
   - La somme des points_max de chaque sous_note = 20 ?
   - Si non, CORRIGE les valeurs.

2. COHÉRENCE LOGIQUE :
   - Si note_finale >= 16 : il ne devrait PAS y avoir beaucoup d'erreurs_majeures
   - Si note_finale <= 8 : il ne devrait PAS y avoir beaucoup de points_forts
   - Si incohérence, AJUSTE la note ou les commentaires.

3. QUALITÉ DES COMMENTAIRES :
   - Les justifications sont-elles assez détaillées ?
   - Les recommandations sont-elles concrètes ?
   - Si non, AMÉLIORE-les.

4. NIVEAU DE CONFIANCE :
   - Le score de confiance est-il réaliste ?
   - Ajuste-le si nécessaire.

5. BIENVEILLANCE :
   - Le ton est-il trop sévère ou trop indulgent ?
   - Ajuste si nécessaire.

Renvoie la correction CORRIGÉE en JSON, avec le même format exact.
Ajoute un champ "verification_effectuee": true
Ajoute un champ "modifications_apportees": ["liste des modifications"]
</instructions_verification>`;
}

// ─── Détection de la matière ─────────────────────────────────────────────────

function detectMatiere(matiere) {
  const m = matiere.toLowerCase();
  if (m.includes('math')) return 'mathematiques';
  if (m.includes('français') || m.includes('francais') || m.includes('lettres')) return 'francais';
  if (m.includes('histoire') || m.includes('géo') || m.includes('hggsp')) return 'histoire';
  if (m.includes('philo')) return 'philosophie';
  if (m.includes('physique') || m.includes('chimie') || m.includes('svt') || m.includes('nsi')) return 'sciences';
  if (m.includes('anglais') || m.includes('espagnol') || m.includes('allemand')) return 'langues';
  return 'general';
}

// ─── Appel à l'API Mistral ───────────────────────────────────────────────────

async function callMistral(prompt, temperature = 0.1) {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from Mistral');
  }

  return JSON.parse(content);
}

// ─── Validation et correction des sous-notes ─────────────────────────────────

function validateAndFixCorrection(correction) {
  const issues = [];

  // Vérifier que sous_notes existe
  if (!correction.sous_notes || !Array.isArray(correction.sous_notes)) {
    issues.push('sous_notes manquant ou invalide');
    return { correction, issues, isValid: false };
  }

  // Calculer les sommes
  const sommePoints = correction.sous_notes.reduce((sum, sn) => sum + (sn.points_obtenus || 0), 0);
  const sommeBareme = correction.sous_notes.reduce((sum, sn) => sum + (sn.points_max || 0), 0);

  // Vérifier somme des barèmes = 20
  if (Math.abs(sommeBareme - 20) > 0.1) {
    issues.push(`Somme des barèmes = ${sommeBareme}, devrait être 20`);
    // Ajuster proportionnellement
    const ratio = 20 / sommeBareme;
    correction.sous_notes.forEach((sn) => {
      sn.points_max = Math.round(sn.points_max * ratio * 2) / 2;
      sn.points_obtenus = Math.min(sn.points_obtenus, sn.points_max);
    });
  }

  // Vérifier somme des points = note finale
  const nouvelleSomme = correction.sous_notes.reduce((sum, sn) => sum + sn.points_obtenus, 0);
  if (Math.abs(nouvelleSomme - correction.note_finale) > 0.5) {
    issues.push(`Somme des points (${nouvelleSomme}) ≠ note finale (${correction.note_finale})`);
    correction.note_finale = Math.round(nouvelleSomme * 2) / 2;
  }

  // Vérifier cohérence note/erreurs
  const nbErreurs = (correction.erreurs_majeures || []).length;
  const nbPointsForts = (correction.points_forts || []).length;

  if (correction.note_finale >= 16 && nbErreurs >= 3) {
    issues.push('Incohérence : note >= 16 mais >= 3 erreurs majeures');
    // Ajuster la note à la baisse
    correction.note_finale = Math.min(correction.note_finale, 15);
    correction.coherence_note = 'Note ajustée à la baisse car trop d\'erreurs majeures pour une note >= 16.';
  }

  if (correction.note_finale <= 8 && nbPointsForts >= 3 && nbErreurs <= 1) {
    issues.push('Incohérence : note <= 8 mais >= 3 points forts et peu d\'erreurs');
    // Ajuster la note à la hausse
    correction.note_finale = Math.max(correction.note_finale, 10);
    correction.coherence_note = 'Note ajustée à la hausse car plusieurs points forts identifiés.';
  }

  // Confiance
  if (typeof correction.confiance !== 'number') {
    correction.confiance = 75;
  }
  correction.confiance = Math.max(0, Math.min(100, correction.confiance));

  // Bareme total
  correction.bareme_total = 20;

  return {
    correction,
    issues,
    isValid: issues.length === 0,
  };
}

// ─── Suggestions de ressources ───────────────────────────────────────────────

function generateRessources(matiere, erreurs) {
  const ressources = [];
  const m = detectMatiere(matiere);

  // Ressources générales par matière
  const ressourcesParMatiere = {
    mathematiques: [
      'Khan Academy - Cours de mathématiques gratuits',
      'Maths et Tiques - Vidéos de cours et exercices',
      'Annales Bac/Brevet - Sujets corrigés',
    ],
    francais: [
      'Études Littéraires - Fiches de révision',
      'Lettrines - Méthodologie du commentaire',
      'Annabac - Corrigés de dissertations',
    ],
    histoire: [
      'Lumni - Cours d\'histoire-géographie',
      'L\'Histoire par les cartes',
      'Annales du Bac d\'histoire',
    ],
    philosophie: [
      'Philolog - Cours de philosophie',
      'Les Chemins de la Philosophie (France Culture)',
      'Méthodologie de la dissertation philosophique',
    ],
    sciences: [
      'Physique-Chimie - Paul Olivier',
      'Cours de SVT en ligne',
      'Exercices corrigés de sciences',
    ],
    langues: [
      'BBC Learning English / Duolingo',
      'Conjugueur de verbes',
      'Exercices de grammaire en ligne',
    ],
    general: [
      'Lumni - Tous les cours',
      'Kartable - Fiches de révision',
      'Afterclasse - Exercices interactifs',
    ],
  };

  // Ajouter les ressources de base
  ressources.push(...(ressourcesParMatiere[m] || ressourcesParMatiere.general));

  // Ajouter des ressources spécifiques selon les erreurs
  if (erreurs && erreurs.length > 0) {
    const erreursTexte = erreurs.join(' ').toLowerCase();

    if (erreursTexte.includes('théorème') || erreursTexte.includes('formule')) {
      ressources.push('Formulaire de mathématiques à imprimer et mémoriser');
    }
    if (erreursTexte.includes('citation') || erreursTexte.includes('guillemets')) {
      ressources.push('Fiche méthode : Comment citer un texte correctement');
    }
    if (erreursTexte.includes('structure') || erreursTexte.includes('plan')) {
      ressources.push('Fiche méthode : Construire un plan de dissertation/commentaire');
    }
    if (erreursTexte.includes('justification') || erreursTexte.includes('argumentation')) {
      ressources.push('Fiche méthode : Argumenter et justifier ses réponses');
    }
  }

  return [...new Set(ressources)].slice(0, 5);
}

// ─── Handler Principal ──────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      matiere,
      niveau,
      sujet,
      questions,
      modeComparatif = false,
      previousCorrection = null,
      multiRun = false,
    } = req.body;

    // Validation des entrées
    if (!matiere || !sujet || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'matiere, sujet et questions sont requis',
      });
    }

    // Vérifier qu'il y a au moins une question avec une réponse
    const questionsValides = questions.filter((q) => q.question?.trim() && q.reponse?.trim());
    if (questionsValides.length === 0) {
      return res.status(400).json({
        error: 'Aucune question valide',
        details: 'Chaque question doit avoir un énoncé et une réponse',
      });
    }

    // Sélectionner la grille
    const matiereType = detectMatiere(matiere);
    const grille = GRILLES[matiereType] || GRILLES.general;

    // ═══════════════════════════════════════════════════════════════════════
    // ÉTAPE 1 : Correction initiale
    // ═══════════════════════════════════════════════════════════════════════

    const promptV3 = buildPromptV3(
      matiere,
      niveau,
      sujet,
      questionsValides,
      grille,
      modeComparatif,
      previousCorrection
    );

    let correction = await callMistral(promptV3, 0.1);

    // ═══════════════════════════════════════════════════════════════════════
    // ÉTAPE 2 : Validation et correction automatique
    // ═══════════════════════════════════════════════════════════════════════

    const validation1 = validateAndFixCorrection(correction);
    correction = validation1.correction;

    // Ajouter les ressources suggérées
    if (!correction.ressources_suggerees || correction.ressources_suggerees.length === 0) {
      correction.ressources_suggerees = generateRessources(matiere, correction.erreurs_majeures);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ÉTAPE 3 : Self-review (vérification par l'IA)
    // ═══════════════════════════════════════════════════════════════════════

    const selfReviewPrompt = buildSelfReviewPrompt(correction, matiere, niveau);
    const correctionVerifiee = await callMistral(selfReviewPrompt, 0.0);

    // Fusionner les corrections
    if (correctionVerifiee.verification_effectuee) {
      correction = {
        ...correction,
        ...correctionVerifiee,
        _verification: {
          effectuee: true,
          modifications: correctionVerifiee.modifications_apportees || [],
        },
      };
    }

    // Validation finale
    const validationFinale = validateAndFixCorrection(correction);
    correction = validationFinale.correction;

    // ═══════════════════════════════════════════════════════════════════════
    // ÉTAPE 4 : Multi-run (optionnel)
    // ═══════════════════════════════════════════════════════════════════════

    if (multiRun) {
      // Faire 2 corrections supplémentaires
      const corrections = [correction];

      for (let i = 0; i < 2; i++) {
        const c = await callMistral(promptV3, 0.15 + i * 0.05);
        const v = validateAndFixCorrection(c);
        corrections.push(v.correction);
      }

      // Calculer la note médiane
      const notes = corrections.map((c) => c.note_finale).sort((a, b) => a - b);
      const noteMediane = notes[1]; // Médiane des 3

      // Prendre la correction dont la note est la plus proche de la médiane
      correction = corrections.reduce((best, c) =>
        Math.abs(c.note_finale - noteMediane) < Math.abs(best.note_finale - noteMediane) ? c : best
      );

      correction._multiRun = {
        effectue: true,
        notes: notes,
        noteMediane: noteMediane,
        ecartType: Math.sqrt(
          notes.reduce((sum, n) => sum + Math.pow(n - noteMediane, 2), 0) / notes.length
        ).toFixed(2),
      };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // RÉPONSE FINALE
    // ═══════════════════════════════════════════════════════════════════════

    return res.status(200).json({
      success: true,
      correction,
      _meta: {
        matiere_detectee: matiereType,
        grille_utilisee: grille.criteres.map((c) => c.nom),
        validation_issues: validationFinale.issues,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Erreur:', error);

    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la correction',
      details: error.message,
    });
  }
}
