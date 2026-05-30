export type Page = 'accueil' | 'correcteur' | 'architecture' | 'prompts' | 'roadmap';

// ─── Évaluation par critère ──────────────────────────────────

export interface EvaluationCritere {
  critereId: string;
  critereNom: string;
  critereDescription: string;
  poids: number;           // % du total (ex: 25)
  score: number;           // 0 à 100 (pourcentage de réussite sur ce critère)
  pointsObtenus: number;   // Points réels
  pointsMax: number;       // Points max pour ce critère
  commentaire: string;     // Feedback spécifique à ce critère
}

// ─── Correction d'une question ───────────────────────────────

export interface CorrectionItem {
  question: string;
  reponseEleve: string;
  status: 'correct' | 'partiel' | 'incorrect';
  pointsObtenus: number;
  pointsMax: number;
  evaluationsCriteres: EvaluationCritere[];  // Détail par critère
  commentaire: string;                        // Commentaire global de la question
  langueProbleme?: string | null;             // Message si problème de langue
}

// ─── Résultat global de la correction ────────────────────────

export interface CorrectionResult {
  note: number;
  noteMax: number;
  matiere: string;
  niveau: string;
  sujet: string;
  grilleUtilisee: string;                    // Nom de la grille (ex: "Bac Français")
  commentaireGeneral: string;
  corrections: CorrectionItem[];
  syntheseCriteres: EvaluationCritere[];     // Synthèse globale par critère
  suggestions: string[];
}

// ─── Exemple de devoir ───────────────────────────────────────

export interface ExempleDevoir {
  matiere: string;
  niveau: string;
  sujet: string;
  questions: { question: string; reponse: string }[];
}
