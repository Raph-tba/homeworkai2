import { useState } from 'react';
import { MessageSquare, Send, CheckCircle, ChevronDown, BarChart2 } from 'lucide-react';
import { 
  TypeFeedback, 
  feedbackLabels, 
  ajouterFeedback, 
  getStatsFeedbacks,
  getAjustementNotation 
} from '../data/feedback';

interface FeedbackBoxProps {
  matiere: string;
  niveau: string;
}

export default function FeedbackBox({ matiere, niveau }: FeedbackBoxProps) {
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<TypeFeedback | ''>('');
  const [message, setMessage] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [voirStats, setVoirStats] = useState(false);

  const stats = getStatsFeedbacks();
  const ajustement = getAjustementNotation();

  const handleSubmit = () => {
    if (!type) return;
    
    ajouterFeedback(type, message, matiere, niveau);
    setEnvoye(true);
    
    setTimeout(() => {
      setEnvoye(false);
      setType('');
      setMessage('');
      setOuvert(false);
    }, 2500);
  };

  return (
    <div className="rounded-xl border border-warm-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-warm-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-warm-400" />
          <div>
            <span className="text-sm font-medium text-warm-800">Un problème avec cette correction ?</span>
            <p className="text-xs text-warm-400 mt-0.5">Signalez-le pour améliorer l'IA</p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-warm-400 transition-transform ${ouvert ? 'rotate-180' : ''}`}
        />
      </button>

      {ouvert && (
        <div className="px-5 pb-5 border-t border-warm-100 pt-4">
          {envoye ? (
            <div className="text-center py-6">
              <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-warm-800">Merci pour votre retour !</p>
              <p className="text-xs text-warm-500 mt-1">
                Votre signalement sera pris en compte si d'autres utilisateurs font le même constat.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-warm-500 mb-2">
                  Quel est le problème ?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(feedbackLabels) as [TypeFeedback, { label: string; description: string }][]).map(
                    ([key, { label }]) => (
                      <button
                        key={key}
                        onClick={() => setType(key)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-colors text-left ${
                          type === key
                            ? 'bg-accent text-white border-accent'
                            : 'border-warm-200 text-warm-600 hover:border-accent hover:text-accent'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {type && (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-warm-500 mb-1.5">
                      Précisions (optionnel)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Expliquez ce qui ne va pas selon vous..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-warm-200 text-sm text-warm-800 placeholder-warm-300 focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-light transition-colors"
                  >
                    <Send size={14} />
                    Envoyer le signalement
                  </button>
                </>
              )}

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-warm-100">
                <button
                  onClick={() => setVoirStats(!voirStats)}
                  className="flex items-center gap-2 text-xs text-warm-400 hover:text-accent"
                >
                  <BarChart2 size={14} />
                  {voirStats ? 'Masquer les statistiques' : 'Voir les statistiques de feedback'}
                </button>

                {voirStats && (
                  <div className="mt-3 p-3 rounded-lg bg-warm-50 border border-warm-100">
                    <p className="text-xs font-medium text-warm-600 mb-2">
                      Signalements des 7 derniers jours :
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-warm-500">Trop gentil :</span>
                        <span className="font-medium text-warm-700">{stats.tropGentil}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-warm-500">Trop sévère :</span>
                        <span className="font-medium text-warm-700">{stats.tropSevere}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-warm-500">Commentaires vagues :</span>
                        <span className="font-medium text-warm-700">{stats.commentairesVagues}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-warm-500">Autres :</span>
                        <span className="font-medium text-warm-700">{stats.autre + stats.noteInjuste + stats.criteresInadaptes}</span>
                      </div>
                    </div>

                    {ajustement.coefficientSeverite !== 1.0 && (
                      <div className="mt-3 pt-2 border-t border-warm-200">
                        <p className="text-xs text-accent font-medium">
                          📊 Ajustement actif :
                        </p>
                        <p className="text-xs text-warm-500 mt-0.5">
                          {ajustement.raison}
                        </p>
                        <p className="text-xs text-warm-400 mt-0.5">
                          Coefficient : {ajustement.coefficientSeverite.toFixed(2)}x
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
