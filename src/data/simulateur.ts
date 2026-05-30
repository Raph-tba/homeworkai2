import { CorrectionResult, CorrectionItem, EvaluationCritere } from '../types';
import { getGrilleMatiere, Critere } from './criteres';
import { verifierLangueReponse } from './langueDetection';
import { getNiveauConfig, appliquerDifficulte, verifierLongueurPourNiveau, NiveauConfig } from './niveaux';
import { appliquerAjustementFeedback, getAjustementNotation } from './feedback';

// ─── Utilitaires ─────────────────────────────────────────────

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ─── Analyse approfondie du texte ────────────────────────────

interface AnalyseTexte {
  mots: number;
  caracteres: number;
  phrases: number;
  paragraphes: number;
  motsUniques: number;
  aJustification: boolean;
  aConnecteurs: boolean;
  aConnecteursMultiples: boolean;
  aChiffres: boolean;
  aFormules: boolean;
  aCitations: boolean;
  aPonctuation: boolean;
  aConclusion: boolean;
  estIncomplet: boolean;
  complexiteSyntaxique: number;
  richesseVocabulaire: number;
  erreursDetectees: string[];
  pointsForts: string[];
}

function analyserTexte(texte: string, niveau: string): AnalyseTexte {
  const t = texte.trim();
  const mots = t.split(/\s+/).filter(m => m.length > 0);
  const motsLower = mots.map(m => m.toLowerCase().replace(/[.,;:!?]/g, ''));
  const motsUniques = new Set(motsLower).size;
  const phrases = t.split(/[.!?]+/).filter(s => s.trim().length > 3);
  const paragraphes = t.split(/\n\n+/).filter(p => p.trim().length > 0);

  const erreursDetectees: string[] = [];
  const pointsForts: string[] = [];
  const niveauConfig = getNiveauConfig(niveau);

  // Vérifications
  const verifLongueur = verifierLongueurPourNiveau(mots.length, niveau);
  if (!verifLongueur.suffisant) {
    erreursDetectees.push(`LONGUEUR INSUFFISANTE : Vous avez écrit ${mots.length} mots. En ${niveau}, on exige MINIMUM ${niveauConfig.exigenceLongueur} mots. C'est non négociable.`);
  } else if (mots.length >= niveauConfig.exigenceLongueur * 1.5) {
    pointsForts.push('Réponse bien développée en termes de longueur.');
  }

  const aJustification = /(donc|car|parce que|puisque|en effet|ainsi|par conséquent|c'est pourquoi|de ce fait|cela (montre|prouve|démontre)|on en (déduit|conclut)|il en résulte|ce qui (signifie|implique))/i.test(t);
  if (!aJustification && niveauConfig.exigenceJustification) {
    erreursDetectees.push(`ABSENCE DE JUSTIFICATION : Vous affirmez sans expliquer. ARRÊTEZ de donner des réponses sans les justifier. Utilisez : "car", "donc", "parce que", "en effet".`);
  } else if (aJustification) {
    pointsForts.push('Présence de justifications.');
  }

  const connecteursLogiques = t.match(/(d'abord|premièrement|deuxièmement|ensuite|de plus|en outre|par ailleurs|enfin|pour conclure|en conclusion|tout d'abord|cependant|néanmoins|toutefois|en revanche|or|certes|bien que|d'une part|d'autre part)/gi) || [];
  const aConnecteurs = connecteursLogiques.length > 0;
  const aConnecteursMultiples = connecteursLogiques.length >= 3;

  if (!aConnecteurs && niveauConfig.exigenceStructure) {
    erreursDetectees.push(`PAS DE STRUCTURE : Votre réponse est un bloc sans organisation. VOUS DEVEZ structurer avec des connecteurs : "D'abord... Ensuite... Enfin..." ou "D'une part... D'autre part...".`);
  } else if (aConnecteursMultiples) {
    pointsForts.push('Bonne utilisation des connecteurs logiques.');
  }

  const aChiffres = /\d/.test(t);
  const aFormules = /[=²³√×÷≤≥∈∀∃∑∏∫±]/.test(t) || /\^[0-9]|sqrt|log|cos|sin|tan|lim|dx|f\(x\)|f'\(/i.test(t);
  
  if (aFormules) {
    pointsForts.push('Utilisation de formules mathématiques.');
  }

  const aCitations = /[«»"""]/.test(t) || /(comme (le )?(dit|écrit|affirme)|selon|d'après|je cite|l'auteur|dans le texte|ligne \d)/i.test(t);
  if (!aCitations && niveauConfig.exigenceCitations) {
    erreursDetectees.push(`AUCUNE CITATION : En analyse de texte, vous DEVEZ citer le texte. Sans citation entre guillemets « », votre analyse n'a aucune valeur. C'est une erreur GRAVE.`);
  } else if (aCitations) {
    pointsForts.push('Citations du texte présentes.');
  }

  const aPonctuation = /[.!?]$/.test(t);
  const aConclusion = /(en conclusion|pour conclure|ainsi|donc,|on peut donc|finalement|en définitive|au final|en somme)/i.test(t);

  if (!aPonctuation && mots.length > 5) {
    erreursDetectees.push(`PONCTUATION MANQUANTE : Votre réponse ne se termine pas par un point. C'est une faute basique à ne PLUS JAMAIS faire.`);
  }

  const estIncomplet = /\.\.\.$|…$|etc\.?$/i.test(t) || 
    (!(/[.!?]$/.test(t)) && mots.length > 10) ||
    (mots.length > 30 && !aConclusion && phrases.length <= 2);

  if (estIncomplet) {
    erreursDetectees.push(`RÉPONSE INACHEVÉE : Votre réponse n'est pas terminée. Une copie incomplète = points perdus automatiquement. FINISSEZ TOUJOURS votre travail, même si vous manquez de temps.`);
  }

  if (aConclusion) {
    pointsForts.push('Conclusion présente.');
  }

  // Complexité syntaxique
  const longueurMoyennePhrase = phrases.length > 0 ? mots.length / phrases.length : mots.length;
  let complexiteSyntaxique = 50;
  if (longueurMoyennePhrase >= 15 && longueurMoyennePhrase <= 25) {
    complexiteSyntaxique = 80;
    pointsForts.push('Phrases bien construites.');
  } else if (longueurMoyennePhrase >= 10) {
    complexiteSyntaxique = 65;
  } else if (longueurMoyennePhrase < 8 && phrases.length > 1) {
    complexiteSyntaxique = 35;
    erreursDetectees.push(`PHRASES TROP COURTES : Vos phrases sont simplistes. APPRENEZ à construire des phrases complexes avec des subordonnées (qui, que, dont, parce que, bien que...).`);
  }

  // Richesse vocabulaire
  const ratioUnique = mots.length > 0 ? (motsUniques / mots.length) * 100 : 0;
  let richesseVocabulaire = 50;
  if (ratioUnique >= 60) {
    richesseVocabulaire = 85;
    pointsForts.push('Vocabulaire riche et varié.');
  } else if (ratioUnique >= 45) {
    richesseVocabulaire = 65;
  } else if (ratioUnique < 35 && mots.length > 20) {
    richesseVocabulaire = 30;
    erreursDetectees.push(`VOCABULAIRE PAUVRE : Vous répétez les mêmes mots. ENRICHISSEZ votre vocabulaire en utilisant des synonymes. C'est pénalisé dans toutes les matières.`);
  }

  return {
    mots: mots.length,
    caracteres: t.length,
    phrases: phrases.length,
    paragraphes: paragraphes.length,
    motsUniques,
    aJustification,
    aConnecteurs,
    aConnecteursMultiples,
    aChiffres,
    aFormules,
    aCitations,
    aPonctuation,
    aConclusion,
    estIncomplet,
    complexiteSyntaxique,
    richesseVocabulaire,
    erreursDetectees,
    pointsForts,
  };
}

// ─── Évaluation par critère ──────────────────────────────────

interface ContexteEvaluation {
  matiere: string;
  niveau: string;
  question: string;
  reponse: string;
  analyse: AnalyseTexte;
  niveauConfig: NiveauConfig;
  seed: number;
}

interface EvaluationCritereResult {
  score: number;
  commentaire: string;
  aArreter: string[];      // Ce qu'il faut ARRÊTER de faire
  aFaire: string[];        // Ce qu'il faut FAIRE absolument
  conseils: string[];      // Conseils pour s'améliorer
}

function evaluerCritere(critere: Critere, ctx: ContexteEvaluation): EvaluationCritereResult {
  const { analyse, niveauConfig, niveau, reponse, seed } = ctx;
  let scoreBase = 35; // Score de départ BAS
  const aArreter: string[] = [];
  const aFaire: string[] = [];
  const conseils: string[] = [];

  // ─── Pénalités de base ───
  
  const verifLongueur = verifierLongueurPourNiveau(analyse.mots, niveau);
  if (!verifLongueur.suffisant) {
    const penalite = Math.round((1 - verifLongueur.ratio) * 45);
    scoreBase -= penalite;
    aArreter.push('Rendre des réponses trop courtes');
    aFaire.push(`Écrire au minimum ${niveauConfig.exigenceLongueur} mots en ${niveau}`);
  }

  if (analyse.estIncomplet) {
    scoreBase -= 25;
    aArreter.push('Rendre des copies inachevées');
    aFaire.push('Toujours terminer par une conclusion, même courte');
  }

  // ─── Évaluation spécifique ───
  
  switch (critere.id) {
    case 'comprehension':
    case 'contenu':
      if (analyse.mots < 8) {
        scoreBase = 5;
        aFaire.push('Développer votre pensée avec des phrases complètes');
      } else if (analyse.mots < 15) {
        scoreBase = 15;
        aArreter.push('Donner des réponses télégraphiques');
        aFaire.push('Expliquer votre raisonnement en détail');
      } else if (analyse.aJustification && analyse.mots >= niveauConfig.exigenceLongueur) {
        scoreBase = 55 + (seed % 25);
      } else if (analyse.mots >= 20) {
        scoreBase = 40 + (seed % 15);
        if (!analyse.aJustification) {
          aFaire.push('Justifier CHAQUE affirmation avec "car", "en effet", "parce que"');
        }
      }
      break;

    case 'argumentation':
      if (!analyse.aJustification) {
        scoreBase = 10;
        aArreter.push('Affirmer sans justifier');
        aFaire.push('Structure obligatoire : Affirmation + "car/parce que" + Explication');
        conseils.push('Une bonne argumentation = Thèse + Arguments + Exemples');
      } else if (!analyse.aConnecteurs) {
        scoreBase = 30;
        aFaire.push('Utiliser des connecteurs : "D\'abord", "Ensuite", "Enfin", "Cependant"');
      } else if (!analyse.aConnecteursMultiples) {
        scoreBase = 50;
        conseils.push('Variez les connecteurs : ajoutez "Néanmoins", "Par ailleurs", "En outre"');
      } else if (analyse.phrases >= 4) {
        scoreBase = 65 + (seed % 25);
      }
      break;

    case 'references':
      if (!analyse.aCitations) {
        scoreBase = 5;
        aArreter.push('Analyser sans citer le texte');
        aFaire.push('Citer le texte entre guillemets « » pour CHAQUE argument');
        aFaire.push('Méthode : Procédé + Citation + Analyse de l\'effet');
      } else if (analyse.mots < 30) {
        scoreBase = 30;
        aArreter.push('Se contenter de citer sans analyser');
        aFaire.push('Après chaque citation, expliquer le procédé et son effet');
      } else {
        scoreBase = 50 + (seed % 30);
      }
      break;

    case 'expression':
      scoreBase = analyse.complexiteSyntaxique * 0.35 + analyse.richesseVocabulaire * 0.35;
      
      if (!analyse.aPonctuation) {
        scoreBase -= 15;
        aArreter.push('Oublier la ponctuation finale');
      }
      
      if (analyse.richesseVocabulaire < 40) {
        aArreter.push('Répéter les mêmes mots');
        aFaire.push('Utiliser des synonymes et enrichir votre lexique');
      }
      
      if (analyse.complexiteSyntaxique < 40) {
        aArreter.push('Écrire des phrases trop simples');
        aFaire.push('Construire des phrases avec des subordonnées');
      }
      break;

    case 'structure':
      if (analyse.paragraphes < 2 && analyse.mots > 40) {
        scoreBase = 20;
        aArreter.push('Écrire un bloc de texte sans paragraphes');
        aFaire.push('Sauter une ligne entre introduction, développement et conclusion');
      } else if (!analyse.aConnecteurs) {
        scoreBase = 25;
        aFaire.push('Guider le lecteur avec des transitions');
      } else if (!analyse.aConclusion && analyse.mots > 30) {
        scoreBase = 40;
        aFaire.push('Terminer par "En conclusion", "Ainsi", "Donc"');
      } else if (analyse.aConnecteursMultiples && analyse.paragraphes >= 2) {
        scoreBase = 65 + (seed % 25);
      }
      break;

    case 'connaissances':
      const citeTheoreme = /théorème|propriété|définition|formule|loi|principe|on sait que|d'après|selon (le|la)/i.test(reponse);
      
      if (!citeTheoreme && !analyse.aFormules) {
        scoreBase = 10;
        aArreter.push('Calculer sans citer le théorème ou la propriété');
        aFaire.push('TOUJOURS commencer par : "D\'après le théorème de...", "On sait que...", "Selon la propriété..."');
      } else if (!citeTheoreme && analyse.aFormules) {
        scoreBase = 35;
        aFaire.push('Nommer explicitement le théorème AVANT de l\'appliquer');
      } else {
        scoreBase = 55 + (seed % 30);
      }
      break;

    case 'raisonnement':
      if (!analyse.aJustification) {
        scoreBase = 15;
        aArreter.push('Donner le résultat sans montrer les étapes');
        aFaire.push('Détailler : "On a... donc... ce qui donne... par conséquent..."');
      } else if (!analyse.aFormules && niveauConfig.exigenceFormules) {
        scoreBase = 30;
        aFaire.push('Écrire les équations et les calculs intermédiaires');
      } else {
        scoreBase = 50 + (seed % 35);
      }
      break;

    case 'calculs':
      if (!analyse.aChiffres) {
        scoreBase = 5;
        aArreter.push('Rédiger sans faire les calculs');
        aFaire.push('Poser les calculs avec les valeurs numériques');
      } else if (!analyse.aFormules) {
        scoreBase = 35;
        aFaire.push('Poser la formule littérale PUIS remplacer : "A = l × L = 5 × 3 = 15 cm²"');
      } else {
        scoreBase = 55 + (seed % 30);
        if (/=.*=.*=/.test(reponse)) scoreBase += 10;
      }
      break;

    case 'redaction':
      if (!analyse.aPonctuation) {
        scoreBase = 20;
        aFaire.push('Terminer chaque phrase par un point');
      }
      if (!analyse.aConclusion && analyse.mots > 15) {
        scoreBase -= 15;
        aFaire.push('Conclure avec : "On trouve donc...", "Le résultat est..."');
      }
      if (analyse.mots >= 15 && analyse.aPonctuation && analyse.aConclusion) {
        scoreBase = 60 + (seed % 30);
      }
      break;

    case 'problematisation':
      const aProblematique = /\?|problème|question|enjeu|peut-on|faut-il|qu'est-ce|comment expliquer|en quoi|dans quelle mesure/i.test(reponse);
      
      if (!aProblematique) {
        scoreBase = 10;
        aArreter.push('Répondre directement sans problématiser');
        aFaire.push('Reformuler le sujet en question : "Ce sujet nous invite à nous demander si..."');
      } else if (analyse.mots < 40) {
        scoreBase = 30;
        aFaire.push('Développer les enjeux de la problématique');
      } else {
        scoreBase = 50 + (seed % 35);
      }
      break;

    case 'conceptualisation':
      const aDefinition = /concept|notion|définition|au sens de|signifie|désigne|on entend par/i.test(reponse);
      
      if (!aDefinition) {
        scoreBase = 15;
        aArreter.push('Utiliser des termes sans les définir');
        aFaire.push('Définir les concepts clés : "Par X, on entend...", "Le terme Y désigne..."');
      } else {
        scoreBase = 50 + (seed % 35);
      }
      break;

    case 'demarche':
      const aMethode = /hypothèse|expérience|protocole|observation|mesure|résultat|on observe|on mesure|les données/i.test(reponse);
      
      if (!aMethode) {
        scoreBase = 15;
        aFaire.push('Structurer : Hypothèse → Expérience → Résultats → Conclusion');
      } else if (!analyse.aChiffres) {
        scoreBase = 35;
        aFaire.push('Inclure des données chiffrées');
      } else {
        scoreBase = 50 + (seed % 35);
      }
      break;

    case 'communication':
      const aUnites = /(kg|g|mg|m|cm|mm|km|s|min|h|L|mL|mol|°C|K|J|W|N|Pa|Hz|V|A|Ω)/i.test(reponse);
      
      if (analyse.aChiffres && !aUnites) {
        scoreBase = 30;
        aArreter.push('Donner des valeurs sans unités');
        aFaire.push('TOUJOURS écrire l\'unité après chaque valeur (m, kg, s, mol...)');
      } else if (analyse.aChiffres && aUnites && analyse.aPonctuation) {
        scoreBase = 60 + (seed % 30);
      } else {
        scoreBase = 40;
      }
      break;

    case 'langue':
      scoreBase = 70;
      break;

    case 'grammaire':
    case 'vocabulaire':
      scoreBase = (analyse.richesseVocabulaire + analyse.complexiteSyntaxique) / 2;
      if (analyse.mots < 15) {
        scoreBase = Math.min(scoreBase, 35);
      }
      break;

    default:
      if (analyse.aJustification && analyse.mots >= niveauConfig.exigenceLongueur * 0.7) {
        scoreBase = 50 + (seed % 30);
      } else if (analyse.mots >= 15) {
        scoreBase = 35 + (seed % 20);
      } else {
        scoreBase = 20;
      }
  }

  // ─── Appliquer les coefficients ───
  let scoreFinal = appliquerDifficulte(scoreBase, niveau);
  scoreFinal = appliquerAjustementFeedback(scoreFinal);

  // ─── Construire le commentaire ───
  let commentaire = '';
  if (scoreFinal >= 65) {
    commentaire = 'Critère maîtrisé.';
  } else if (scoreFinal >= 45) {
    commentaire = 'Critère partiellement acquis — des efforts sont nécessaires.';
  } else {
    commentaire = 'Critère NON ACQUIS — travail important requis.';
  }

  return {
    score: clamp(scoreFinal, 0, 100),
    commentaire,
    aArreter,
    aFaire,
    conseils,
  };
}

// ─── AUTO-CORRECTION : L'IA se relit et ajuste ───────────────

interface AutoCorrection {
  noteInitiale: number;
  noteFinale: number;
  ajustements: string[];
  aEteAjustee: boolean;
}

function autoCorrigerNote(
  corrections: CorrectionItem[],
  niveau: string,
  analyse: AnalyseTexte,
): AutoCorrection {
  const noteInitiale = corrections.reduce((s, c) => s + c.pointsObtenus, 0);
  let noteFinale = noteInitiale;
  const ajustements: string[] = [];
  const niveauConfig = getNiveauConfig(niveau);

  // ─── VÉRIFICATION 1 : Cohérence globale ───
  const nbCorrect = corrections.filter(c => c.status === 'correct').length;
  const total = corrections.length;
  const pctCorrect = (nbCorrect / total) * 100;

  // Si beaucoup de "correct" mais note basse → peut-être trop sévère sur les points
  if (pctCorrect >= 60 && noteFinale < 10) {
    // Vérifier si c'est justifié
    const tropCourt = corrections.every(c => c.reponseEleve.split(/\s+/).length < niveauConfig.exigenceLongueur * 0.5);
    if (!tropCourt) {
      const bonus = 1;
      noteFinale += bonus;
      ajustements.push(`+${bonus} pt : Relecture — Les réponses sont majoritairement correctes malgré quelques faiblesses formelles.`);
    }
  }

  // ─── VÉRIFICATION 2 : Pénalité pas assez forte pour copie inachevée ───
  const nbInachevees = corrections.filter(c => c.commentaire.includes('INACHEVÉE') || c.commentaire.includes('inachevée')).length;
  if (nbInachevees > 0 && noteFinale > 12) {
    const malus = nbInachevees * 1.5;
    noteFinale -= malus;
    ajustements.push(`-${malus} pt : Relecture — Pénalité renforcée pour ${nbInachevees} réponse(s) inachevée(s). C'est inacceptable en ${niveau}.`);
  }

  // ─── VÉRIFICATION 3 : Note trop haute pour le niveau Terminale/Licence ───
  if ((niveau === 'Terminale' || niveau === 'Licence') && noteFinale >= 16) {
    // Vérifier si vraiment mérité
    const toutesJustifiees = corrections.every(c => {
      const a = analyserTexte(c.reponseEleve, niveau);
      return a.aJustification && a.aConnecteurs && a.mots >= niveauConfig.exigenceLongueur;
    });
    
    if (!toutesJustifiees) {
      const malus = 2;
      noteFinale -= malus;
      ajustements.push(`-${malus} pts : Relecture — En ${niveau}, une note ≥16/20 exige une rigueur absolue sur tous les critères. Ce n'est pas le cas ici.`);
    }
  }

  // ─── VÉRIFICATION 4 : Note trop basse si bonnes choses ───
  if (noteFinale < 6 && analyse.pointsForts.length >= 3) {
    const bonus = 1;
    noteFinale += bonus;
    ajustements.push(`+${bonus} pt : Relecture — Malgré les lacunes, plusieurs points positifs sont identifiés (${analyse.pointsForts.slice(0, 2).join(', ')}). Encouragement.`);
  }

  // ─── VÉRIFICATION 5 : Pas de justification = note max 12 ───
  const aucuneJustification = corrections.every(c => !/(car|donc|parce que|en effet)/i.test(c.reponseEleve));
  if (aucuneJustification && noteFinale > 12) {
    const malus = noteFinale - 12;
    noteFinale = 12;
    ajustements.push(`-${malus} pts : Relecture — Aucune réponse ne contient de justification explicite. Note plafonnée à 12/20 maximum.`);
  }

  // ─── VÉRIFICATION 6 : Toutes les réponses < 15 mots ───
  const toutesTropCourtes = corrections.every(c => c.reponseEleve.split(/\s+/).length < 15);
  if (toutesTropCourtes && noteFinale > 8) {
    const malus = noteFinale - 8;
    noteFinale = 8;
    ajustements.push(`-${malus} pts : Relecture — Toutes les réponses sont extrêmement courtes (<15 mots). Note plafonnée à 8/20.`);
  }

  // Arrondir
  noteFinale = Math.round(noteFinale * 2) / 2;
  noteFinale = clamp(noteFinale, 0, 20);

  return {
    noteInitiale: Math.round(noteInitiale * 2) / 2,
    noteFinale,
    ajustements,
    aEteAjustee: ajustements.length > 0,
  };
}

// ─── Génération du commentaire DÉTAILLÉ ──────────────────────

function genererCommentaireQuestion(
  evaluations: EvaluationCritereResult[],
  analyse: AnalyseTexte,
  niveau: string,
  status: 'correct' | 'partiel' | 'incorrect',
  langueProbleme: string | null,
): string {
  const parties: string[] = [];
  const niveauConfig = getNiveauConfig(niveau);

  // ─── 1. Verdict ───
  if (status === 'correct') {
    parties.push('✅ RÉPONSE SATISFAISANTE');
    parties.push(`Cette réponse atteint le niveau attendu en ${niveau}.`);
  } else if (status === 'partiel') {
    parties.push('⚠️ RÉPONSE PARTIELLEMENT CORRECTE');
    parties.push('Des éléments sont justes mais des lacunes importantes persistent.');
  } else {
    parties.push('❌ RÉPONSE INSUFFISANTE');
    parties.push('Cette réponse ne répond pas aux exigences minimales.');
  }

  // ─── 2. Erreurs détectées (DIRECT) ───
  if (analyse.erreursDetectees.length > 0) {
    parties.push('\n\n🚫 CE QUI NE VA PAS :');
    analyse.erreursDetectees.forEach((err, i) => {
      parties.push(`${i + 1}. ${err}`);
    });
  }

  // ─── 3. Ce qu'il faut ARRÊTER de faire ───
  const toutArreter = [...new Set(evaluations.flatMap(e => e.aArreter))];
  if (toutArreter.length > 0) {
    parties.push('\n\n🛑 ARRÊTEZ DE :');
    toutArreter.slice(0, 4).forEach(item => {
      parties.push(`• ${item}`);
    });
  }

  // ─── 4. Ce qu'il faut FAIRE ───
  const toutFaire = [...new Set(evaluations.flatMap(e => e.aFaire))];
  if (toutFaire.length > 0) {
    parties.push('\n\n✅ VOUS DEVEZ ABSOLUMENT :');
    toutFaire.slice(0, 5).forEach(item => {
      parties.push(`• ${item}`);
    });
  }

  // ─── 5. Langue ───
  if (langueProbleme) {
    parties.push('\n\n🌍 ERREUR DE LANGUE :');
    parties.push(langueProbleme);
    parties.push('→ Cette erreur est TRÈS pénalisante. Relisez toujours la consigne.');
  }

  // ─── 6. Points positifs ───
  if (analyse.pointsForts.length > 0 && status !== 'correct') {
    parties.push('\n\n👍 CE QUI EST BIEN (continuez) :');
    parties.push('• ' + analyse.pointsForts.join('\n• '));
  }

  // ─── 7. Conseils concrets ───
  const tousConseils = [...new Set(evaluations.flatMap(e => e.conseils))];
  if (tousConseils.length > 0) {
    parties.push('\n\n💡 CONSEILS POUR PROGRESSER :');
    tousConseils.slice(0, 3).forEach((c, i) => {
      parties.push(`${i + 1}. ${c}`);
    });
  }

  // ─── 8. Statistiques ───
  parties.push(`\n\n📊 STATISTIQUES : ${analyse.mots} mots | ${analyse.phrases} phrases | Attendu minimum : ${niveauConfig.exigenceLongueur} mots en ${niveau}`);

  return parties.join('\n');
}

// ─── Correction d'une question ───────────────────────────────

function corrigerQuestion(
  question: string,
  reponse: string,
  criteres: Critere[],
  langueAttendue: 'fr' | 'en' | 'es' | 'de' | 'it' | null,
  pointsMax: number,
  niveau: string,
  matiere: string,
  seed: number
): CorrectionItem {
  const niveauConfig = getNiveauConfig(niveau);
  const analyse = analyserTexte(reponse, niveau);
  
  const ctx: ContexteEvaluation = {
    matiere,
    niveau,
    question,
    reponse,
    analyse,
    niveauConfig,
    seed,
  };

  // Langue
  const consignePermettantFrancais = /(traduire|traduisez|en français|translate.*french)/i.test(question);
  const verifLangue = verifierLangueReponse(reponse, langueAttendue, consignePermettantFrancais);

  // Évaluer chaque critère
  const evaluationsResults: EvaluationCritereResult[] = [];
  const evaluations: EvaluationCritere[] = criteres.map((critere) => {
    const result = evaluerCritere(critere, { ...ctx, seed: seed + critere.id.length });
    evaluationsResults.push(result);

    let scoreFinal = result.score;
    let commentaireFinal = result.commentaire;
    
    if (critere.id === 'langue' && !verifLangue.correct) {
      scoreFinal = Math.max(0, scoreFinal - verifLangue.penalite);
      commentaireFinal = verifLangue.message || commentaireFinal;
    }

    const pointsCritere = (critere.poids / 100) * pointsMax;
    const pointsObtenus = Math.round((scoreFinal / 100) * pointsCritere * 2) / 2;

    return {
      critereId: critere.id,
      critereNom: critere.nom,
      critereDescription: critere.description,
      poids: critere.poids,
      score: scoreFinal,
      pointsObtenus,
      pointsMax: Math.round(pointsCritere * 2) / 2,
      commentaire: commentaireFinal,
    };
  });

  // Pénalités
  const aCritereLangue = criteres.some(c => c.id === 'langue');
  let penaliteLangue = 0;
  if (!aCritereLangue && !verifLangue.correct) {
    penaliteLangue = verifLangue.penalite / 100;
  }

  let pointsObtenus = evaluations.reduce((sum, e) => sum + e.pointsObtenus, 0);
  
  if (penaliteLangue > 0) {
    pointsObtenus = Math.round(pointsObtenus * (1 - penaliteLangue) * 2) / 2;
  }
  if (analyse.estIncomplet) {
    pointsObtenus = Math.max(0, Math.round((pointsObtenus - pointsMax * 0.20) * 2) / 2);
  }

  pointsObtenus = Math.max(0, Math.min(pointsMax, pointsObtenus));

  const ratio = pointsObtenus / pointsMax;
  let status: 'correct' | 'partiel' | 'incorrect';
  if (ratio >= 0.60) status = 'correct';
  else if (ratio >= 0.35) status = 'partiel';
  else status = 'incorrect';

  const commentaire = genererCommentaireQuestion(
    evaluationsResults,
    analyse,
    niveau,
    status,
    !verifLangue.correct ? verifLangue.message : null,
  );

  return {
    question,
    reponseEleve: reponse,
    status,
    pointsObtenus,
    pointsMax,
    evaluationsCriteres: evaluations,
    commentaire,
    langueProbleme: !verifLangue.correct ? verifLangue.message : null,
  };
}

// ─── Synthèse ────────────────────────────────────────────────

function synthetiserCriteres(corrections: CorrectionItem[]): EvaluationCritere[] {
  if (corrections.length === 0) return [];

  const parCritere: Record<string, EvaluationCritere[]> = {};
  
  for (const correction of corrections) {
    for (const ev of correction.evaluationsCriteres) {
      if (!parCritere[ev.critereId]) parCritere[ev.critereId] = [];
      parCritere[ev.critereId].push(ev);
    }
  }

  return Object.entries(parCritere).map(([critereId, evaluations]) => {
    const premier = evaluations[0];
    const scoreMoyen = Math.round(evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length);
    const pointsObtenus = evaluations.reduce((s, e) => s + e.pointsObtenus, 0);
    const pointsMax = evaluations.reduce((s, e) => s + e.pointsMax, 0);

    let commentaire: string;
    if (scoreMoyen >= 60) {
      commentaire = `Acquis (${scoreMoyen}%).`;
    } else if (scoreMoyen >= 40) {
      commentaire = `En cours d'acquisition (${scoreMoyen}%). Efforts requis.`;
    } else {
      commentaire = `NON ACQUIS (${scoreMoyen}%). Travail urgent nécessaire.`;
    }

    return {
      critereId,
      critereNom: premier.critereNom,
      critereDescription: premier.critereDescription,
      poids: premier.poids,
      score: scoreMoyen,
      pointsObtenus: Math.round(pointsObtenus * 2) / 2,
      pointsMax: Math.round(pointsMax * 2) / 2,
      commentaire,
    };
  });
}

// ─── Commentaire général avec auto-correction ────────────────

function genererCommentaireGeneral(
  noteFinale: number,
  noteMax: number,
  sujet: string,
  niveau: string,
  _corrections: CorrectionItem[],
  syntheseCriteres: EvaluationCritere[],
  autoCorrection: AutoCorrection,
): string {
  const pct = noteMax > 0 ? (noteFinale / noteMax) * 100 : 0;
  const niveauConfig = getNiveauConfig(niveau);
  const ajustement = getAjustementNotation();

  const parties: string[] = [];

  // Appréciation
  if (pct >= 70) {
    parties.push(`📗 **BON DEVOIR** sur « ${sujet} »`);
  } else if (pct >= 50) {
    parties.push(`📙 **DEVOIR MOYEN** sur « ${sujet} »`);
  } else if (pct >= 35) {
    parties.push(`📕 **DEVOIR INSUFFISANT** sur « ${sujet} »`);
  } else {
    parties.push(`📕 **DEVOIR TRÈS INSUFFISANT** sur « ${sujet} »`);
  }

  // Auto-correction
  if (autoCorrection.aEteAjustee) {
    parties.push('\n\n🔄 **VÉRIFICATION DE L\'IA :**');
    parties.push(`Note initiale : ${autoCorrection.noteInitiale}/20 → Note après relecture : ${autoCorrection.noteFinale}/20`);
    autoCorrection.ajustements.forEach(a => {
      parties.push(`• ${a}`);
    });
  }

  // Critères faibles
  const criteresFaibles = syntheseCriteres.filter(c => c.score < 45).sort((a, b) => a.score - b.score);
  if (criteresFaibles.length > 0) {
    parties.push('\n\n🎯 **PRIORITÉS D\'AMÉLIORATION :**');
    criteresFaibles.slice(0, 3).forEach((c, i) => {
      parties.push(`${i + 1}. **${c.critereNom}** (${c.score}%) : ${c.critereDescription}`);
    });
  }

  // Rappel niveau
  parties.push(`\n\n📚 **RAPPEL ${niveau.toUpperCase()} :** ${niveauConfig.description}`);

  // Ajustement communautaire
  if (ajustement.coefficientSeverite !== 1.0) {
    parties.push(`\n\n📊 *${ajustement.raison}*`);
  }

  return parties.join('\n');
}

// ─── Suggestions ─────────────────────────────────────────────

function genererSuggestions(
  corrections: CorrectionItem[],
  syntheseCriteres: EvaluationCritere[],
  niveau: string,
): string[] {
  const suggestions: string[] = [];
  const niveauConfig = getNiveauConfig(niveau);

  // Critères faibles
  const criteresFaibles = syntheseCriteres.filter(c => c.score < 45).sort((a, b) => a.score - b.score);
  
  for (const critere of criteresFaibles.slice(0, 2)) {
    suggestions.push(
      `🎯 PRIORITÉ : Travaillez le critère « ${critere.critereNom} » (${critere.score}%). ${critere.critereDescription}`
    );
  }

  // Erreurs récurrentes
  const toutesErreurs: string[] = [];
  corrections.forEach(c => {
    const analyse = analyserTexte(c.reponseEleve, niveau);
    toutesErreurs.push(...analyse.erreursDetectees);
  });

  // Compter les erreurs les plus fréquentes
  const erreursCount: Record<string, number> = {};
  toutesErreurs.forEach(e => {
    const key = e.split(':')[0];
    erreursCount[key] = (erreursCount[key] || 0) + 1;
  });

  const erreursFrequentes = Object.entries(erreursCount)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (erreursFrequentes.length > 0) {
    suggestions.push(`⚠️ ERREUR RÉCURRENTE : "${erreursFrequentes[0][0]}" détectée ${erreursFrequentes[0][1]} fois. C'est votre problème principal à corriger.`);
  }

  // Conseils niveau
  if (niveauConfig.exigenceJustification) {
    const sansJustification = corrections.filter(c => !/(car|donc|parce que|en effet)/i.test(c.reponseEleve)).length;
    if (sansJustification > 0) {
      suggestions.push(`📝 ${sansJustification}/${corrections.length} réponse(s) sans justification. En ${niveau}, c'est OBLIGATOIRE.`);
    }
  }

  // Longueur
  const courtes = corrections.filter(c => c.reponseEleve.split(/\s+/).length < niveauConfig.exigenceLongueur * 0.5).length;
  if (courtes > 0) {
    suggestions.push(`📏 ${courtes} réponse(s) trop courte(s). Minimum ${niveauConfig.exigenceLongueur} mots par réponse en ${niveau}.`);
  }

  return suggestions.slice(0, 6);
}

// ─── Fonction principale ─────────────────────────────────────

export function simulerCorrectionIA(
  matiere: string,
  niveau: string,
  sujet: string,
  questions: { question: string; reponse: string }[]
): CorrectionResult {
  const grille = getGrilleMatiere(matiere);
  const globalSeed = hashString(matiere + niveau + sujet + questions.map(q => q.question + q.reponse).join(''));

  const questionsValides = questions.filter(q => q.question.trim() && q.reponse.trim());

  if (questionsValides.length === 0) {
    return {
      note: 0,
      noteMax: 20,
      matiere,
      niveau,
      sujet,
      grilleUtilisee: grille.matiere,
      commentaireGeneral: 'Aucune question avec une réponse n\'a été détectée.',
      corrections: [],
      syntheseCriteres: [],
      suggestions: ['Remplissez au moins une question et une réponse.'],
    };
  }

  // Répartir les 20 points
  const totalPoints = 20;
  const pointsParQuestion = Math.floor((totalPoints / questionsValides.length) * 2) / 2;
  const reste = totalPoints - pointsParQuestion * questionsValides.length;

  // Corriger chaque question
  const corrections: CorrectionItem[] = questionsValides.map((q, i) => {
    const seed = globalSeed + hashString(q.question + i.toString());
    const points = i === 0 ? pointsParQuestion + reste : pointsParQuestion;
    
    return corrigerQuestion(
      q.question,
      q.reponse,
      grille.criteres,
      grille.langueAttendue || null,
      points,
      niveau,
      matiere,
      seed
    );
  });

  // Synthèse
  const syntheseCriteres = synthetiserCriteres(corrections);

  // Auto-correction
  const analyseGlobale = analyserTexte(
    corrections.map(c => c.reponseEleve).join(' '),
    niveau
  );
  const autoCorrection = autoCorrigerNote(corrections, niveau, analyseGlobale);

  // Note finale
  const noteMax = corrections.reduce((s, c) => s + c.pointsMax, 0);
  const note = autoCorrection.noteFinale;

  // Commentaire général
  const commentaireGeneral = genererCommentaireGeneral(
    note,
    noteMax,
    sujet,
    niveau,
    corrections,
    syntheseCriteres,
    autoCorrection,
  );

  const suggestions = genererSuggestions(corrections, syntheseCriteres, niveau);

  return {
    note,
    noteMax,
    matiere,
    niveau,
    sujet,
    grilleUtilisee: grille.matiere,
    commentaireGeneral,
    corrections,
    syntheseCriteres,
    suggestions,
  };
}
