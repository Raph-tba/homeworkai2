// ─── Coefficients de difficulté par niveau scolaire ──────────
// Plus le coefficient est élevé, plus on est exigeant

export interface NiveauConfig {
  nom: string;
  coefficient: number;           // Multiplicateur de difficulté (1.0 = base)
  exigenceLongueur: number;      // Nombre de mots minimum attendu par réponse
  exigenceJustification: boolean; // Justification obligatoire ?
  exigenceStructure: boolean;     // Structure (intro/dev/conclu) obligatoire ?
  exigenceCitations: boolean;     // Citations obligatoires (français) ?
  exigenceFormules: boolean;      // Formules obligatoires (maths/sciences) ?
  toleranceErreurs: number;       // % d'erreurs tolérées avant pénalité
  description: string;            // Pour les commentaires
}

const niveauxConfig: Record<string, NiveauConfig> = {
  '6ème': {
    nom: '6ème',
    coefficient: 0.7,
    exigenceLongueur: 15,
    exigenceJustification: false,
    exigenceStructure: false,
    exigenceCitations: false,
    exigenceFormules: false,
    toleranceErreurs: 30,
    description: 'En 6ème, on attend des réponses simples et directes. La justification n\'est pas toujours exigée mais reste valorisée.',
  },
  '5ème': {
    nom: '5ème',
    coefficient: 0.75,
    exigenceLongueur: 20,
    exigenceJustification: false,
    exigenceStructure: false,
    exigenceCitations: false,
    exigenceFormules: false,
    toleranceErreurs: 25,
    description: 'En 5ème, les réponses doivent commencer à être plus développées. On valorise les premiers efforts de justification.',
  },
  '4ème': {
    nom: '4ème',
    coefficient: 0.8,
    exigenceLongueur: 25,
    exigenceJustification: true,
    exigenceStructure: false,
    exigenceCitations: false,
    exigenceFormules: false,
    toleranceErreurs: 20,
    description: 'En 4ème, la justification devient attendue. Les réponses doivent montrer un raisonnement, pas seulement un résultat.',
  },
  '3ème': {
    nom: '3ème',
    coefficient: 0.85,
    exigenceLongueur: 30,
    exigenceJustification: true,
    exigenceStructure: false,
    exigenceCitations: false,
    exigenceFormules: true,
    toleranceErreurs: 15,
    description: 'En 3ème (année du Brevet), on attend des réponses structurées avec une vraie justification. En maths, les formules doivent être citées.',
  },
  '2nde': {
    nom: '2nde',
    coefficient: 0.9,
    exigenceLongueur: 40,
    exigenceJustification: true,
    exigenceStructure: true,
    exigenceCitations: true,
    exigenceFormules: true,
    toleranceErreurs: 12,
    description: 'En Seconde, les exigences se rapprochent du lycée. Structure, justification et précision sont indispensables.',
  },
  '1ère': {
    nom: '1ère',
    coefficient: 1.0,
    exigenceLongueur: 50,
    exigenceJustification: true,
    exigenceStructure: true,
    exigenceCitations: true,
    exigenceFormules: true,
    toleranceErreurs: 10,
    description: 'En Première (épreuves anticipées du Bac), le niveau d\'exigence est élevé. Chaque réponse doit être rigoureuse, structurée et argumentée.',
  },
  'Terminale': {
    nom: 'Terminale',
    coefficient: 1.15,
    exigenceLongueur: 60,
    exigenceJustification: true,
    exigenceStructure: true,
    exigenceCitations: true,
    exigenceFormules: true,
    toleranceErreurs: 8,
    description: 'En Terminale (année du Bac), les attentes sont maximales. Rigueur absolue, argumentation solide, références précises, structure impeccable.',
  },
  'BTS': {
    nom: 'BTS',
    coefficient: 1.1,
    exigenceLongueur: 50,
    exigenceJustification: true,
    exigenceStructure: true,
    exigenceCitations: true,
    exigenceFormules: true,
    toleranceErreurs: 10,
    description: 'En BTS, on attend un niveau professionnel avec des réponses précises et applicables.',
  },
  'Licence': {
    nom: 'Licence',
    coefficient: 1.2,
    exigenceLongueur: 80,
    exigenceJustification: true,
    exigenceStructure: true,
    exigenceCitations: true,
    exigenceFormules: true,
    toleranceErreurs: 5,
    description: 'Au niveau Licence, les exigences sont universitaires : rigueur scientifique, sources citées, analyse approfondie.',
  },
  'Autre': {
    nom: 'Autre',
    coefficient: 0.9,
    exigenceLongueur: 30,
    exigenceJustification: true,
    exigenceStructure: false,
    exigenceCitations: false,
    exigenceFormules: false,
    toleranceErreurs: 15,
    description: 'Niveau non spécifié — évaluation standard.',
  },
};

export function getNiveauConfig(niveau: string): NiveauConfig {
  return niveauxConfig[niveau] || niveauxConfig['Autre'];
}

// Appliquer le coefficient de difficulté à un score
export function appliquerDifficulte(scoreBase: number, niveau: string): number {
  const config = getNiveauConfig(niveau);
  // Plus le coefficient est élevé, plus on est sévère
  // Un score de 70 en Terminale (coef 1.15) devient 70 / 1.15 = 60.8
  const scoreAjuste = scoreBase / config.coefficient;
  return Math.max(0, Math.min(100, Math.round(scoreAjuste)));
}

// Vérifier si la longueur est suffisante pour le niveau
export function verifierLongueurPourNiveau(nbMots: number, niveau: string): {
  suffisant: boolean;
  attendu: number;
  ratio: number;
  message: string;
} {
  const config = getNiveauConfig(niveau);
  const ratio = nbMots / config.exigenceLongueur;
  
  if (ratio >= 1.5) {
    return {
      suffisant: true,
      attendu: config.exigenceLongueur,
      ratio,
      message: `La réponse est bien développée (${nbMots} mots, minimum attendu : ${config.exigenceLongueur}).`,
    };
  } else if (ratio >= 1.0) {
    return {
      suffisant: true,
      attendu: config.exigenceLongueur,
      ratio,
      message: `La longueur est acceptable (${nbMots} mots pour ${config.exigenceLongueur} attendus).`,
    };
  } else if (ratio >= 0.5) {
    return {
      suffisant: false,
      attendu: config.exigenceLongueur,
      ratio,
      message: `La réponse est trop courte : ${nbMots} mots alors qu'on attend au minimum ${config.exigenceLongueur} mots en ${niveau}. Cela représente seulement ${Math.round(ratio * 100)}% de la longueur attendue.`,
    };
  } else {
    return {
      suffisant: false,
      attendu: config.exigenceLongueur,
      ratio,
      message: `La réponse est beaucoup trop courte : ${nbMots} mots pour ${config.exigenceLongueur} attendus en ${niveau}. Une réponse aussi brève ne peut pas être évaluée correctement et sera fortement pénalisée.`,
    };
  }
}
