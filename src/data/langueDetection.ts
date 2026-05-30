// ─── Détection de langue basée sur des mots fréquents ───────

type Langue = 'fr' | 'en' | 'es' | 'de' | 'it' | 'unknown';

// Mots les plus fréquents par langue (articles, prépositions, conjonctions)
const motsFrequents: Record<Langue, string[]> = {
  fr: [
    'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'est', 'que', 'qui',
    'dans', 'pour', 'pas', 'sur', 'ce', 'cette', 'sont', 'avec', 'plus', 'par',
    'mais', 'ou', 'donc', 'car', 'ni', 'je', 'tu', 'il', 'elle', 'nous', 'vous',
    'ils', 'elles', 'mon', 'ton', 'son', 'notre', 'votre', 'leur', 'être', 'avoir',
    'fait', 'faire', 'peut', 'comme', 'tout', 'aussi', 'bien', 'même', 'après',
    'avant', 'chez', 'entre', 'sans', 'sous', 'très', 'peu', 'encore', 'alors',
    'ainsi', 'cependant', 'donc', 'ensuite', 'enfin', 'puis', "c'est", "n'est",
    "l'on", "qu'il", "qu'elle", "d'un", "d'une",
  ],
  en: [
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'and', 'but', 'or', 'if', 'then', 'because', 'as', 'of', 'at', 'by', 'for',
    'with', 'about', 'to', 'from', 'in', 'on', 'that', 'this', 'these', 'those',
    'it', 'its', 'they', 'them', 'their', 'he', 'she', 'his', 'her', 'we', 'you',
    'my', 'your', 'our', 'which', 'what', 'who', 'whom', 'how', 'when', 'where',
    'there', 'here', 'can', 'must', 'may', 'might', 'shall', 'not', "don't",
    "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't",
    'very', 'more', 'most', 'also', 'just', 'only', 'even', 'still', 'already',
  ],
  es: [
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
    'y', 'e', 'o', 'u', 'que', 'en', 'es', 'son', 'está', 'están', 'ser', 'estar',
    'por', 'para', 'con', 'sin', 'sobre', 'entre', 'pero', 'como', 'más', 'muy',
    'también', 'no', 'sí', 'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos',
    'mi', 'tu', 'su', 'nuestro', 'este', 'esta', 'esto', 'ese', 'esa', 'aquel',
    'hay', 'tiene', 'tienen', 'hace', 'hacen', 'puede', 'pueden', 'debe', 'deben',
    'cuando', 'donde', 'porque', 'aunque', 'si', 'mientras', 'después', 'antes',
  ],
  de: [
    'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'einem',
    'und', 'oder', 'aber', 'wenn', 'weil', 'dass', 'ob', 'als', 'wie', 'so',
    'ist', 'sind', 'war', 'waren', 'sein', 'haben', 'hat', 'hatte', 'wird', 'werden',
    'kann', 'können', 'muss', 'müssen', 'soll', 'sollen', 'will', 'wollen',
    'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'Sie', 'mein', 'dein', 'sein',
    'in', 'an', 'auf', 'für', 'mit', 'von', 'zu', 'bei', 'nach', 'aus', 'über',
    'nicht', 'auch', 'noch', 'nur', 'schon', 'immer', 'wieder', 'sehr', 'hier',
    'da', 'wo', 'was', 'wer', 'welche', 'dieser', 'diese', 'dieses', 'jeder',
  ],
  it: [
    'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'di', 'del', 'della',
    'e', 'è', 'o', 'che', 'in', 'a', 'da', 'per', 'con', 'su', 'tra', 'fra',
    'sono', 'essere', 'avere', 'ha', 'hanno', 'fare', 'fa', 'fanno', 'può', 'possono',
    'io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'mio', 'tuo', 'suo', 'nostro',
    'questo', 'questa', 'quello', 'quella', 'come', 'quando', 'dove', 'perché',
    'ma', 'però', 'anche', 'ancora', 'già', 'sempre', 'mai', 'molto', 'poco',
    'non', 'più', 'meno', 'tutto', 'tutti', 'ogni', 'qualche', 'altro', 'altri',
  ],
  unknown: [],
};

// Mots qui peuvent être similaires entre langues (faux amis ou mots partagés)
// On les ignore dans le comptage
const motsAmbigus = new Set([
  'position', 'situation', 'question', 'solution', 'action', 'nation', 'condition',
  'important', 'possible', 'impossible', 'simple', 'double', 'triple',
  'normal', 'principal', 'original', 'final', 'total', 'central', 'national',
  'information', 'communication', 'organisation', 'administration',
  'president', 'president', 'ministre', 'ministre',
  'europe', 'america', 'france', 'paris', 'berlin', 'madrid', 'roma',
]);

export interface DetectionResult {
  langue: Langue;
  confidence: number;       // 0 à 1
  scores: Record<Langue, number>;
  motsDetectes: Record<Langue, string[]>;
}

export function detecterLangue(texte: string): DetectionResult {
  const mots = texte
    .toLowerCase()
    .replace(/[.,;:!?()[\]{}«»""'']/g, ' ')
    .split(/\s+/)
    .filter(m => m.length >= 2 && !motsAmbigus.has(m));

  const totalMots = mots.length;
  
  if (totalMots < 3) {
    return {
      langue: 'unknown',
      confidence: 0,
      scores: { fr: 0, en: 0, es: 0, de: 0, it: 0, unknown: 0 },
      motsDetectes: { fr: [], en: [], es: [], de: [], it: [], unknown: [] },
    };
  }

  const scores: Record<Langue, number> = { fr: 0, en: 0, es: 0, de: 0, it: 0, unknown: 0 };
  const motsDetectes: Record<Langue, string[]> = { fr: [], en: [], es: [], de: [], it: [], unknown: [] };

  for (const mot of mots) {
    for (const [langue, listeMots] of Object.entries(motsFrequents) as [Langue, string[]][]) {
      if (langue === 'unknown') continue;
      if (listeMots.includes(mot)) {
        scores[langue]++;
        if (motsDetectes[langue].length < 10 && !motsDetectes[langue].includes(mot)) {
          motsDetectes[langue].push(mot);
        }
      }
    }
  }

  // Trouver la langue dominante
  let maxScore = 0;
  let langueDominante: Langue = 'unknown';
  
  for (const [langue, score] of Object.entries(scores) as [Langue, number][]) {
    if (score > maxScore) {
      maxScore = score;
      langueDominante = langue;
    }
  }

  // Calculer la confidence
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  let confidence = 0;
  
  if (totalMatches > 0 && maxScore > 0) {
    // Confidence basée sur la proportion de mots détectés et la dominance
    const proportionMatches = totalMatches / totalMots;
    const dominance = maxScore / totalMatches;
    confidence = Math.min(1, proportionMatches * dominance * 2);
  }

  // Si très peu de matches, confidence faible
  if (maxScore < 3) {
    confidence = Math.min(confidence, 0.3);
  }

  return {
    langue: langueDominante,
    confidence,
    scores,
    motsDetectes,
  };
}

// Vérifier si la langue de la réponse correspond à la langue attendue
export function verifierLangueReponse(
  reponse: string,
  langueAttendue: 'fr' | 'en' | 'es' | 'de' | 'it' | null,
  consignePermettantFrancais: boolean = false
): {
  correct: boolean;
  langueDetectee: Langue;
  confidence: number;
  message: string | null;
  penalite: number; // Pourcentage de pénalité (0-100)
} {
  // Pas de contrainte de langue
  if (langueAttendue === null) {
    return {
      correct: true,
      langueDetectee: 'fr',
      confidence: 1,
      message: null,
      penalite: 0,
    };
  }

  const detection = detecterLangue(reponse);

  // Texte trop court pour détecter
  if (detection.confidence < 0.2) {
    return {
      correct: true, // On ne pénalise pas si on n'est pas sûr
      langueDetectee: detection.langue,
      confidence: detection.confidence,
      message: null,
      penalite: 0,
    };
  }

  // Langue correcte
  if (detection.langue === langueAttendue) {
    return {
      correct: true,
      langueDetectee: detection.langue,
      confidence: detection.confidence,
      message: null,
      penalite: 0,
    };
  }

  // Langue incorrecte mais français autorisé par la consigne
  if (detection.langue === 'fr' && consignePermettantFrancais) {
    return {
      correct: true,
      langueDetectee: detection.langue,
      confidence: detection.confidence,
      message: 'Réponse en français acceptée car la consigne le permet.',
      penalite: 0,
    };
  }

  // Langue incorrecte
  const nomLangueAttendue: Record<string, string> = {
    fr: 'français',
    en: 'anglais',
    es: 'espagnol',
    de: 'allemand',
    it: 'italien',
  };
  
  const nomLangueDetectee: Record<string, string> = {
    fr: 'français',
    en: 'anglais',
    es: 'espagnol',
    de: 'allemand',
    it: 'italien',
    unknown: 'indéterminée',
  };

  // Pénalité proportionnelle à la confidence de la détection
  const penalite = Math.round(detection.confidence * 50); // Jusqu'à -50%

  return {
    correct: false,
    langueDetectee: detection.langue,
    confidence: detection.confidence,
    message: `La réponse semble être rédigée en ${nomLangueDetectee[detection.langue]} alors que la matière « ${nomLangueAttendue[langueAttendue]} » exige une réponse en ${nomLangueAttendue[langueAttendue]}. Sauf indication contraire dans la consigne, toute réponse dans la mauvaise langue est fortement pénalisée.`,
    penalite,
  };
}
