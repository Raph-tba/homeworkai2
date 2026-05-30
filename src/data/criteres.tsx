// ─── Grilles de critères officiels par matière ───────────────
// Inspirées des grilles d'évaluation du Baccalauréat et du Brevet

export interface Critere {
  id: string;
  nom: string;
  description: string;
  poids: number; // Pourcentage du total (ex: 25 = 25%)
}

export interface GrilleMatiere {
  matiere: string;
  criteres: Critere[];
  langueAttendue?: 'fr' | 'en' | 'es' | 'de' | 'it' | null; // null = pas de contrainte
}

// ─── FRANÇAIS ────────────────────────────────────────────────
// Basé sur la grille du Bac français (commentaire/dissertation)

export const grilleFrancais: GrilleMatiere = {
  matiere: 'Français',
  langueAttendue: 'fr',
  criteres: [
    {
      id: 'comprehension',
      nom: 'Compréhension du sujet',
      description: 'Le sujet est compris et la problématique est clairement identifiée.',
      poids: 20,
    },
    {
      id: 'argumentation',
      nom: 'Qualité de l\'argumentation',
      description: 'Les arguments sont pertinents, organisés logiquement et convaincants.',
      poids: 25,
    },
    {
      id: 'references',
      nom: 'Références et citations',
      description: 'Utilisation appropriée de citations du texte, références aux œuvres et auteurs.',
      poids: 25,
    },
    {
      id: 'expression',
      nom: 'Expression écrite',
      description: 'Orthographe, grammaire, syntaxe, richesse du vocabulaire.',
      poids: 15,
    },
    {
      id: 'structure',
      nom: 'Structure et organisation',
      description: 'Introduction, développement structuré, conclusion. Paragraphes distincts.',
      poids: 15,
    },
  ],
};

// ─── MATHÉMATIQUES ───────────────────────────────────────────
// Basé sur la grille du Bac maths

export const grilleMaths: GrilleMatiere = {
  matiere: 'Mathématiques',
  langueAttendue: 'fr',
  criteres: [
    {
      id: 'connaissances',
      nom: 'Maîtrise des connaissances',
      description: 'Théorèmes, formules et propriétés correctement cités et utilisés.',
      poids: 25,
    },
    {
      id: 'raisonnement',
      nom: 'Qualité du raisonnement',
      description: 'Démarche logique, étapes clairement justifiées, rigueur mathématique.',
      poids: 30,
    },
    {
      id: 'calculs',
      nom: 'Exactitude des calculs',
      description: 'Calculs corrects, résultats exacts, unités appropriées.',
      poids: 30,
    },
    {
      id: 'redaction',
      nom: 'Clarté de la rédaction',
      description: 'Présentation soignée, réponse finale claire, phrases de conclusion.',
      poids: 15,
    },
  ],
};

// ─── HISTOIRE-GÉOGRAPHIE ─────────────────────────────────────

export const grilleHistoire: GrilleMatiere = {
  matiere: 'Histoire-Géographie',
  langueAttendue: 'fr',
  criteres: [
    {
      id: 'connaissances',
      nom: 'Connaissances factuelles',
      description: 'Dates, événements, personnages, lieux correctement mentionnés.',
      poids: 25,
    },
    {
      id: 'comprehension',
      nom: 'Compréhension des enjeux',
      description: 'Analyse des causes, conséquences et enjeux historiques/géographiques.',
      poids: 25,
    },
    {
      id: 'argumentation',
      nom: 'Argumentation et analyse',
      description: 'Capacité à construire un raisonnement, à nuancer, à critiquer les sources.',
      poids: 25,
    },
    {
      id: 'expression',
      nom: 'Expression et organisation',
      description: 'Qualité de l\'expression écrite, structure du propos, vocabulaire spécifique.',
      poids: 25,
    },
  ],
};

// ─── PHILOSOPHIE ─────────────────────────────────────────────

export const grillePhilo: GrilleMatiere = {
  matiere: 'Philosophie',
  langueAttendue: 'fr',
  criteres: [
    {
      id: 'problematisation',
      nom: 'Problématisation',
      description: 'Capacité à dégager une problématique, à questionner les présupposés du sujet.',
      poids: 25,
    },
    {
      id: 'conceptualisation',
      nom: 'Conceptualisation',
      description: 'Définition des concepts, utilisation d\'un vocabulaire philosophique précis.',
      poids: 20,
    },
    {
      id: 'argumentation',
      nom: 'Argumentation',
      description: 'Construction logique, articulation des idées, exemples pertinents.',
      poids: 25,
    },
    {
      id: 'references',
      nom: 'Références philosophiques',
      description: 'Mobilisation d\'auteurs, de doctrines, de textes philosophiques.',
      poids: 15,
    },
    {
      id: 'expression',
      nom: 'Expression et rédaction',
      description: 'Clarté, précision, orthographe, structure dissertation.',
      poids: 15,
    },
  ],
};

// ─── SCIENCES (Physique-Chimie, SVT) ─────────────────────────

export const grilleSciences: GrilleMatiere = {
  matiere: 'Sciences',
  langueAttendue: 'fr',
  criteres: [
    {
      id: 'connaissances',
      nom: 'Connaissances scientifiques',
      description: 'Lois, formules, définitions, vocabulaire scientifique.',
      poids: 25,
    },
    {
      id: 'demarche',
      nom: 'Démarche scientifique',
      description: 'Hypothèses, protocole, analyse, interprétation des résultats.',
      poids: 25,
    },
    {
      id: 'calculs',
      nom: 'Calculs et unités',
      description: 'Applications numériques correctes, unités appropriées, chiffres significatifs.',
      poids: 30,
    },
    {
      id: 'communication',
      nom: 'Communication scientifique',
      description: 'Schémas, graphiques, tableaux, phrases de conclusion.',
      poids: 20,
    },
  ],
};

// ─── LANGUES VIVANTES (Anglais, Espagnol, Allemand) ──────────

export const grilleAnglais: GrilleMatiere = {
  matiere: 'Anglais',
  langueAttendue: 'en',
  criteres: [
    {
      id: 'langue',
      nom: 'Utilisation de la langue cible',
      description: 'La réponse doit être rédigée en anglais (sauf consigne contraire).',
      poids: 20,
    },
    {
      id: 'grammaire',
      nom: 'Correction grammaticale',
      description: 'Temps verbaux, accords, structures syntaxiques correctes.',
      poids: 25,
    },
    {
      id: 'vocabulaire',
      nom: 'Richesse du vocabulaire',
      description: 'Variété lexicale, expressions idiomatiques, registre approprié.',
      poids: 20,
    },
    {
      id: 'contenu',
      nom: 'Pertinence du contenu',
      description: 'Réponse à la consigne, idées développées, cohérence.',
      poids: 20,
    },
    {
      id: 'expression',
      nom: 'Qualité de l\'expression',
      description: 'Fluidité, enchaînements logiques, absence de calques du français.',
      poids: 15,
    },
  ],
};

export const grilleEspagnol: GrilleMatiere = {
  matiere: 'Espagnol',
  langueAttendue: 'es',
  criteres: [
    {
      id: 'langue',
      nom: 'Utilisation de la langue cible',
      description: 'La réponse doit être rédigée en espagnol (sauf consigne contraire).',
      poids: 20,
    },
    {
      id: 'grammaire',
      nom: 'Correction grammaticale',
      description: 'Conjugaisons, accords, ser/estar, subjonctif si nécessaire.',
      poids: 25,
    },
    {
      id: 'vocabulaire',
      nom: 'Richesse du vocabulaire',
      description: 'Variété lexicale, expressions, registre approprié.',
      poids: 20,
    },
    {
      id: 'contenu',
      nom: 'Pertinence du contenu',
      description: 'Réponse à la consigne, idées développées, cohérence.',
      poids: 20,
    },
    {
      id: 'expression',
      nom: 'Qualité de l\'expression',
      description: 'Fluidité, enchaînements, authenticité de l\'expression.',
      poids: 15,
    },
  ],
};

export const grilleAllemand: GrilleMatiere = {
  matiere: 'Allemand',
  langueAttendue: 'de',
  criteres: [
    {
      id: 'langue',
      nom: 'Utilisation de la langue cible',
      description: 'La réponse doit être rédigée en allemand (sauf consigne contraire).',
      poids: 20,
    },
    {
      id: 'grammaire',
      nom: 'Correction grammaticale',
      description: 'Déclinaisons, place du verbe, cas, conjugaisons.',
      poids: 25,
    },
    {
      id: 'vocabulaire',
      nom: 'Richesse du vocabulaire',
      description: 'Variété lexicale, mots composés, registre approprié.',
      poids: 20,
    },
    {
      id: 'contenu',
      nom: 'Pertinence du contenu',
      description: 'Réponse à la consigne, idées développées, cohérence.',
      poids: 20,
    },
    {
      id: 'expression',
      nom: 'Qualité de l\'expression',
      description: 'Fluidité, enchaînements logiques, structure des phrases.',
      poids: 15,
    },
  ],
};

// ─── GRILLE GÉNÉRIQUE ────────────────────────────────────────

export const grilleGenerique: GrilleMatiere = {
  matiere: 'Général',
  langueAttendue: null,
  criteres: [
    {
      id: 'comprehension',
      nom: 'Compréhension de la question',
      description: 'La question est comprise et la réponse est pertinente.',
      poids: 25,
    },
    {
      id: 'contenu',
      nom: 'Qualité du contenu',
      description: 'Exactitude des informations, pertinence des arguments.',
      poids: 30,
    },
    {
      id: 'justification',
      nom: 'Justification',
      description: 'Explications claires, raisonnement logique, exemples.',
      poids: 25,
    },
    {
      id: 'expression',
      nom: 'Expression écrite',
      description: 'Orthographe, grammaire, clarté, structure.',
      poids: 20,
    },
  ],
};

// ─── Sélectionner la grille selon la matière ─────────────────

export function getGrilleMatiere(matiere: string): GrilleMatiere {
  const m = matiere.toLowerCase();
  
  if (m.includes('français') || m.includes('francais') || m.includes('littéra')) {
    return grilleFrancais;
  }
  if (m.includes('math')) {
    return grilleMaths;
  }
  if (m.includes('histoire') || m.includes('géo') || m.includes('geo') || m.includes('hggsp')) {
    return grilleHistoire;
  }
  if (m.includes('philo')) {
    return grillePhilo;
  }
  if (m.includes('physique') || m.includes('chimie') || m.includes('svt') || m.includes('bio') || m.includes('nsi')) {
    return grilleSciences;
  }
  if (m.includes('anglais') || m === 'english') {
    return grilleAnglais;
  }
  if (m.includes('espagnol') || m === 'español') {
    return grilleEspagnol;
  }
  if (m.includes('allemand') || m === 'deutsch') {
    return grilleAllemand;
  }
  
  return grilleGenerique;
}
