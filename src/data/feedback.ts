// ─── Système de feedback utilisateur ─────────────────────────
// Stockage local des plaintes et ajustement automatique de la notation

export type TypeFeedback = 
  | 'trop_gentil'
  | 'trop_severe' 
  | 'commentaires_vagues'
  | 'note_injuste'
  | 'criteres_inadaptes'
  | 'autre';

export interface Feedback {
  id: string;
  type: TypeFeedback;
  message: string;
  matiere: string;
  niveau: string;
  timestamp: number;
}

export interface FeedbackStats {
  tropGentil: number;
  tropSevere: number;
  commentairesVagues: number;
  noteInjuste: number;
  criteresInadaptes: number;
  autre: number;
  total: number;
}

const STORAGE_KEY = 'homeworkai_feedbacks';
const AJUSTEMENT_KEY = 'homeworkai_ajustement';

// ─── Récupérer tous les feedbacks ────────────────────────────

export function getFeedbacks(): Feedback[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ─── Ajouter un feedback ─────────────────────────────────────

export function ajouterFeedback(
  type: TypeFeedback,
  message: string,
  matiere: string,
  niveau: string
): void {
  const feedbacks = getFeedbacks();
  
  const nouveau: Feedback = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    type,
    message,
    matiere,
    niveau,
    timestamp: Date.now(),
  };
  
  feedbacks.push(nouveau);
  
  // Garder seulement les 100 derniers
  const feedbacksRecents = feedbacks.slice(-100);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacksRecents));
    // Recalculer l'ajustement
    recalculerAjustement();
  } catch {
    // localStorage plein ou indisponible
  }
}

// ─── Calculer les stats des feedbacks ────────────────────────

export function getStatsFeedbacks(): FeedbackStats {
  const feedbacks = getFeedbacks();
  
  // Ne compter que les feedbacks des 7 derniers jours
  const uneSemaine = 7 * 24 * 60 * 60 * 1000;
  const recents = feedbacks.filter(f => Date.now() - f.timestamp < uneSemaine);
  
  return {
    tropGentil: recents.filter(f => f.type === 'trop_gentil').length,
    tropSevere: recents.filter(f => f.type === 'trop_severe').length,
    commentairesVagues: recents.filter(f => f.type === 'commentaires_vagues').length,
    noteInjuste: recents.filter(f => f.type === 'note_injuste').length,
    criteresInadaptes: recents.filter(f => f.type === 'criteres_inadaptes').length,
    autre: recents.filter(f => f.type === 'autre').length,
    total: recents.length,
  };
}

// ─── Recalculer l'ajustement global ──────────────────────────

export interface AjustementNotation {
  coefficientSeverite: number;  // 1.0 = normal, > 1 = plus sévère, < 1 = plus indulgent
  dernierCalcul: number;
  raison: string;
}

function recalculerAjustement(): void {
  const stats = getStatsFeedbacks();
  
  let coefficient = 1.0;
  let raison = 'Notation standard.';
  
  // Si beaucoup de plaintes "trop gentil"
  if (stats.tropGentil >= 3 && stats.tropGentil > stats.tropSevere * 2) {
    coefficient = 1.0 + (stats.tropGentil * 0.03); // +3% par plainte
    coefficient = Math.min(coefficient, 1.25); // Max +25%
    raison = `Notation durcie suite à ${stats.tropGentil} signalement(s) "notation trop généreuse".`;
  }
  // Si beaucoup de plaintes "trop sévère"
  else if (stats.tropSevere >= 3 && stats.tropSevere > stats.tropGentil * 2) {
    coefficient = 1.0 - (stats.tropSevere * 0.02); // -2% par plainte
    coefficient = Math.max(coefficient, 0.85); // Max -15%
    raison = `Notation assouplie suite à ${stats.tropSevere} signalement(s) "notation trop sévère".`;
  }
  // Équilibre
  else if (stats.total >= 5) {
    const diff = stats.tropGentil - stats.tropSevere;
    if (Math.abs(diff) <= 2) {
      raison = 'Notation équilibrée selon les retours.';
    }
  }
  
  const ajustement: AjustementNotation = {
    coefficientSeverite: coefficient,
    dernierCalcul: Date.now(),
    raison,
  };
  
  try {
    localStorage.setItem(AJUSTEMENT_KEY, JSON.stringify(ajustement));
  } catch {
    // Ignore
  }
}

// ─── Récupérer l'ajustement actuel ───────────────────────────

export function getAjustementNotation(): AjustementNotation {
  try {
    const data = localStorage.getItem(AJUSTEMENT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignore
  }
  
  return {
    coefficientSeverite: 1.0,
    dernierCalcul: Date.now(),
    raison: 'Notation standard.',
  };
}

// ─── Appliquer l'ajustement à un score ───────────────────────

export function appliquerAjustementFeedback(score: number): number {
  const ajustement = getAjustementNotation();
  
  // Plus le coefficient est élevé, plus on est sévère (on divise le score)
  const scoreAjuste = score / ajustement.coefficientSeverite;
  
  return Math.max(0, Math.min(100, Math.round(scoreAjuste)));
}

// ─── Reset (pour debug) ──────────────────────────────────────

export function resetFeedbacks(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(AJUSTEMENT_KEY);
}

// ─── Labels pour l'UI ────────────────────────────────────────

export const feedbackLabels: Record<TypeFeedback, { label: string; description: string }> = {
  trop_gentil: {
    label: 'Notation trop généreuse',
    description: 'Les notes sont trop hautes par rapport à la qualité du travail.',
  },
  trop_severe: {
    label: 'Notation trop sévère',
    description: 'Les notes sont trop basses, l\'évaluation est injustement dure.',
  },
  commentaires_vagues: {
    label: 'Commentaires trop vagues',
    description: 'Les commentaires ne sont pas assez précis ou utiles.',
  },
  note_injuste: {
    label: 'Note injuste',
    description: 'La note ne reflète pas la qualité réelle du travail.',
  },
  criteres_inadaptes: {
    label: 'Critères inadaptés',
    description: 'Les critères d\'évaluation ne correspondent pas à la matière/niveau.',
  },
  autre: {
    label: 'Autre problème',
    description: 'Un autre problème non listé ci-dessus.',
  },
};
