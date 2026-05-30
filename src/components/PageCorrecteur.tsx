import { useState } from 'react';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
  RotateCcw,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { CorrectionResult } from '../types';
import { exemplesDevoirs } from '../data/exemples';
import { simulerCorrectionIA } from '../data/simulateur';
import FeedbackBox from './FeedbackBox';

const MATIERES = [
  'Mathématiques',
  'Français',
  'Histoire-Géographie',
  'Physique-Chimie',
  'SVT',
  'Philosophie',
  'Anglais',
  'Espagnol',
  'Allemand',
  'SES',
  'NSI',
  'Autre',
];

const NIVEAUX = [
  '6ème',
  '5ème',
  '4ème',
  '3ème',
  '2nde',
  '1ère',
  'Terminale',
  'BTS',
  'Licence',
  'Autre',
];

export default function PageCorrecteur() {
  const [matiere, setMatiere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [sujet, setSujet] = useState('');
  const [questions, setQuestions] = useState([{ question: '', reponse: '' }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [questionOuverte, setQuestionOuverte] = useState<number | null>(0);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', reponse: '' }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: 'question' | 'reponse', value: string) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const loadExemple = (index: number) => {
    const ex = exemplesDevoirs[index];
    setMatiere(ex.matiere);
    setNiveau(ex.niveau);
    setSujet(ex.sujet);
    setQuestions(ex.questions);
    setResult(null);
  };

  const simulerCorrection = async () => {
    setLoading(true);
    setResult(null);
    setQuestionOuverte(0);

    const delai = 1500 + Math.random() * 1500;
    await new Promise((resolve) => setTimeout(resolve, delai));

    const correction = simulerCorrectionIA(matiere, niveau, sujet, questions);
    setResult(correction);
    setLoading(false);
  };

  const reset = () => {
    setMatiere('');
    setNiveau('');
    setSujet('');
    setQuestions([{ question: '', reponse: '' }]);
    setResult(null);
    setQuestionOuverte(null);
  };

  const canSubmit = matiere && niveau && sujet && questions[0].question && questions[0].reponse;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'partiel':
        return <AlertCircle size={16} className="text-amber-600" />;
      case 'incorrect':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'partiel':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'incorrect':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-warm-100 text-warm-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const notePercentage = result ? (result.note / result.noteMax) * 100 : 0;

  return (
    <div className="min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold text-warm-900 mb-2">Correcteur</h1>
          <p className="text-sm text-warm-500">
            Remplis le formulaire et reçois une correction détaillée basée sur les critères officiels.
            <span className="text-accent ml-1">Mode démo — les résultats sont simulés.</span>
          </p>
        </div>

        {/* Exemples */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-warm-400">Exemples :</span>
          {exemplesDevoirs.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExemple(i)}
              className="text-xs px-2.5 py-1 rounded-md border border-warm-200 text-warm-600 hover:text-accent hover:border-indigo-200 hover:bg-accent-soft transition-colors"
            >
              {ex.matiere} · {ex.niveau}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <div className="rounded-xl border border-warm-200 bg-white overflow-hidden mb-8">
          <div className="p-5 sm:p-6 border-b border-warm-100">
            <h2 className="text-sm font-semibold text-warm-800 mb-4">Informations du devoir</h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-warm-500 mb-1.5">Matière</label>
                <select
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-warm-200 bg-white text-sm text-warm-800 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors pr-8"
                >
                  <option value="">Choisir...</option>
                  {MATIERES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-500 mb-1.5">Niveau</label>
                <select
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-warm-200 bg-white text-sm text-warm-800 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors pr-8"
                >
                  <option value="">Choisir...</option>
                  {NIVEAUX.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-warm-500 mb-1.5">Sujet du devoir</label>
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                placeholder="Ex : Le théorème de Pythagore, La Révolution française..."
                className="w-full px-3 py-2 rounded-lg border border-warm-200 text-sm text-warm-800 placeholder-warm-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-warm-800 mb-4">Questions & réponses</h2>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="p-4 rounded-lg border border-warm-100 bg-warm-50/50 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-warm-400">Question {i + 1}</span>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(i)}
                        className="p-1 rounded text-warm-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                    placeholder="Énoncé de la question..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-md border border-warm-200 bg-white text-sm text-warm-800 placeholder-warm-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors resize-none mb-2"
                  />
                  <textarea
                    value={q.reponse}
                    onChange={(e) => updateQuestion(i, 'reponse', e.target.value)}
                    placeholder="Réponse de l'élève (plus c'est développé, meilleure sera l'évaluation)..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-warm-200 bg-white text-sm text-warm-800 placeholder-warm-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
                  />
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full py-2.5 rounded-lg border border-dashed border-warm-200 text-warm-400 hover:text-accent hover:border-indigo-200 flex items-center justify-center gap-1.5 transition-colors text-xs font-medium"
              >
                <Plus size={14} />
                Ajouter une question
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex gap-2">
            <button
              onClick={simulerCorrection}
              disabled={loading || !canSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-light disabled:bg-warm-200 disabled:text-warm-400 transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Corriger le devoir
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="px-3 py-2.5 rounded-lg border border-warm-200 text-warm-400 hover:text-warm-600 hover:border-warm-300 transition-colors"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Résultats */}
        {loading && (
          <div className="py-16 text-center">
            <Loader2 size={24} className="animate-spin text-accent mx-auto mb-3" />
            <p className="text-sm text-warm-500">Analyse des critères en cours...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Note globale */}
            <div className="rounded-xl border border-warm-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-warm-400 mb-1">Note globale</p>
                  <p className="text-4xl font-bold text-warm-900">
                    {result.note}
                    <span className="text-xl font-normal text-warm-400">/{result.noteMax}</span>
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-warm-400 mb-1">Grille utilisée</p>
                  <p className="text-sm font-medium text-accent">{result.grilleUtilisee}</p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full h-2 rounded-full bg-warm-100 overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    notePercentage >= 70 ? 'bg-emerald-500' : notePercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${notePercentage}%` }}
                />
              </div>

              <p className="text-sm text-warm-600 leading-relaxed">{result.commentaireGeneral}</p>
            </div>

            {/* Synthèse par critère — TABLEAU */}
            {result.syntheseCriteres.length > 0 && (
              <div className="rounded-xl border border-warm-200 bg-white overflow-hidden">
                <div className="px-5 py-4 border-b border-warm-100">
                  <h3 className="text-sm font-semibold text-warm-800">Évaluation par critère</h3>
                  <p className="text-xs text-warm-400 mt-0.5">Synthèse basée sur les critères officiels de la matière</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-warm-50 text-warm-500 text-xs uppercase tracking-wider">
                        <th className="px-5 py-3 text-left font-medium">Critère</th>
                        <th className="px-5 py-3 text-center font-medium w-24">Score</th>
                        <th className="px-5 py-3 text-center font-medium w-20">Points</th>
                        <th className="px-5 py-3 text-left font-medium hidden sm:table-cell">Appréciation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-100">
                      {result.syntheseCriteres.map((critere) => (
                        <tr key={critere.critereId} className="hover:bg-warm-50/50">
                          <td className="px-5 py-3">
                            <p className="font-medium text-warm-800">{critere.critereNom}</p>
                            <p className="text-xs text-warm-400 mt-0.5">{critere.critereDescription}</p>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-sm font-bold ${getScoreColor(critere.score)}`}>
                                {critere.score}%
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-warm-100 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getScoreBg(critere.score)}`}
                                  style={{ width: `${critere.score}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="font-medium text-warm-700">
                              {critere.pointsObtenus}/{critere.pointsMax}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-warm-500 text-xs hidden sm:table-cell">
                            {critere.commentaire}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Détail par question — ACCORDÉON */}
            <div className="rounded-xl border border-warm-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-warm-100">
                <h3 className="text-sm font-semibold text-warm-800">Correction détaillée</h3>
              </div>

              <div className="divide-y divide-warm-100">
                {result.corrections.map((correction, i) => (
                  <div key={i}>
                    {/* Header question */}
                    <button
                      onClick={() => setQuestionOuverte(questionOuverte === i ? null : i)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-warm-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(correction.status)}
                        <div>
                          <span className="text-sm font-medium text-warm-800">Question {i + 1}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${getStatusBadge(correction.status)}`}>
                            {correction.pointsObtenus}/{correction.pointsMax} pts
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-warm-400 transition-transform ${questionOuverte === i ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Contenu question */}
                    {questionOuverte === i && (
                      <div className="px-5 pb-5 space-y-4">
                        {/* Alerte langue */}
                        {correction.langueProbleme && (
                          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                            <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-800">{correction.langueProbleme}</p>
                          </div>
                        )}

                        {/* Question et réponse */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-warm-50 border border-warm-100">
                            <p className="text-xs text-warm-400 mb-1">Question posée</p>
                            <p className="text-sm text-warm-700">{correction.question}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-warm-50 border border-warm-100">
                            <p className="text-xs text-warm-400 mb-1">Réponse de l'élève</p>
                            <p className="text-sm text-warm-600 italic">« {correction.reponseEleve} »</p>
                          </div>
                        </div>

                        {/* Commentaire global */}
                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                          <p className="text-xs text-accent mb-1">Commentaire</p>
                          <p className="text-sm text-warm-700 leading-relaxed">{correction.commentaire}</p>
                        </div>

                        {/* Mini tableau critères */}
                        <div>
                          <p className="text-xs text-warm-400 mb-2">Détail par critère</p>
                          <div className="rounded-lg border border-warm-100 overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-warm-50 text-warm-500">
                                  <th className="px-3 py-2 text-left font-medium">Critère</th>
                                  <th className="px-3 py-2 text-center font-medium w-16">Score</th>
                                  <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">Commentaire</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-warm-50">
                                {correction.evaluationsCriteres.map((ev) => (
                                  <tr key={ev.critereId}>
                                    <td className="px-3 py-2 text-warm-700">{ev.critereNom}</td>
                                    <td className="px-3 py-2 text-center">
                                      <span className={`font-medium ${getScoreColor(ev.score)}`}>{ev.score}%</span>
                                    </td>
                                    <td className="px-3 py-2 text-warm-500 hidden sm:table-cell">{ev.commentaire}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="rounded-xl border border-indigo-100 bg-accent-soft p-5">
                <h3 className="text-xs font-semibold text-accent mb-3">Conseils pour progresser</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-warm-600">
                      <span className="text-accent shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feedback utilisateur */}
            <FeedbackBox matiere={matiere} niveau={niveau} />
          </div>
        )}
      </div>
    </div>
  );
}
