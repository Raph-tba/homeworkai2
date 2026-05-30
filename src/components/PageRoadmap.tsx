export default function PageRoadmap() {
  const phases = [
    {
      num: 1,
      title: 'MVP — Prototype fonctionnel',
      status: 'done' as const,
      desc: 'Avoir un truc qui marche : un formulaire, une IA qui corrige, une réponse affichée.',
      tasks: [
        { label: 'Setup du projet (HTML/CSS/JS)', done: true },
        { label: 'Formulaire de soumission', done: true },
        { label: 'Serverless function sur Vercel', done: true },
        { label: 'Intégration API Mistral', done: true },
        { label: 'Affichage de la correction', done: true },
        { label: 'Déploiement + repo GitHub', done: true },
      ],
    },
    {
      num: 2,
      title: 'Qualité des corrections',
      status: 'wip' as const,
      desc: "Rendre l'IA plus fiable : meilleur prompt, notation cohérente, moins d'hallucinations.",
      tasks: [
        { label: 'Prompt V2 structuré (rôle + contexte)', done: true },
        { label: 'Format JSON strict', done: true },
        { label: 'Prompt V3 avec balises XML + rubrique', done: true },
        { label: 'Temperature basse (0.1)', done: true },
        { label: 'Validation JSON avec Zod', done: false },
        { label: 'Few-shot examples dans le prompt', done: false },
        { label: 'Tests de reproductibilité', done: false },
      ],
    },
    {
      num: 3,
      title: 'Sécurité & limites',
      status: 'planned' as const,
      desc: 'Protéger le projet contre les abus avant de le rendre public.',
      tasks: [
        { label: 'Rate limiting (max X corrections/heure)', done: false },
        { label: 'Validation des entrées côté serveur', done: false },
        { label: 'Protection CORS', done: false },
        { label: 'Logs des requêtes pour debug', done: false },
        { label: 'Messages d\'erreur clairs', done: false },
      ],
    },
    {
      num: 4,
      title: 'Comptes utilisateurs & historique',
      status: 'planned' as const,
      desc: 'Les utilisateurs peuvent créer un compte et retrouver leurs anciennes corrections.',
      tasks: [
        { label: 'Authentification (Supabase Auth ou NextAuth)', done: false },
        { label: 'Base de données (Supabase PostgreSQL)', done: false },
        { label: 'Sauvegarde des corrections', done: false },
        { label: 'Page "Mes corrections"', done: false },
        { label: 'Profil utilisateur + stats', done: false },
      ],
    },
    {
      num: 5,
      title: 'Plan premium',
      status: 'future' as const,
      desc: 'Rendre le projet viable avec un plan gratuit limité et un plan payant.',
      tasks: [
        { label: 'Plan gratuit : 5 corrections/jour', done: false },
        { label: 'Plan premium : illimité (Stripe)', done: false },
        { label: 'Dashboard de gestion d\'abonnement', done: false },
        { label: 'Export PDF des corrections', done: false },
      ],
    },
    {
      num: 6,
      title: 'Fonctionnalités avancées',
      status: 'future' as const,
      desc: 'Les trucs cool pour plus tard.',
      tasks: [
        { label: 'Pipeline multi-étapes (analyse → note → commentaire)', done: false },
        { label: 'Rubrique de notation personnalisable', done: false },
        { label: 'OCR : scanner un devoir manuscrit', done: false },
        { label: 'Mode enseignant (corriger une classe)', done: false },
        { label: 'Application mobile (PWA)', done: false },
        { label: 'API publique pour les écoles', done: false },
      ],
    },
  ];

  const getStatusBadge = (status: 'done' | 'wip' | 'planned' | 'future') => {
    switch (status) {
      case 'done':
        return { text: 'Terminé', cls: 'bg-emerald-50 text-emerald-700' };
      case 'wip':
        return { text: 'En cours', cls: 'bg-indigo-50 text-accent' };
      case 'planned':
        return { text: 'Planifié', cls: 'bg-amber-50 text-amber-700' };
      case 'future':
        return { text: 'Futur', cls: 'bg-warm-100 text-warm-500' };
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold text-warm-900 mb-2">Roadmap</h1>
          <p className="text-sm text-warm-500 leading-relaxed">
            Ce que j'ai déjà fait, ce sur quoi je travaille, et ce que je prévois.
            Chaque phase est pensée pour être réalisable en solo, pas à pas.
          </p>
        </div>

        {/* Résumé rapide */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Terminé', count: 1, color: 'text-emerald-600' },
            { label: 'En cours', count: 1, color: 'text-accent' },
            { label: 'Planifié', count: 2, color: 'text-amber-600' },
            { label: 'Futur', count: 2, color: 'text-warm-400' },
          ].map((s, i) => (
            <div key={i} className="text-center py-3 rounded-lg border border-warm-200 bg-white">
              <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[11px] text-warm-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Phases */}
        <div className="space-y-6">
          {phases.map((phase) => {
            const badge = getStatusBadge(phase.status);
            const doneCount = phase.tasks.filter((t) => t.done).length;
            const totalCount = phase.tasks.length;
            const progress = (doneCount / totalCount) * 100;

            return (
              <div
                key={phase.num}
                className="rounded-xl border border-warm-200 bg-white overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-warm-300">
                        {String(phase.num).padStart(2, '0')}
                      </span>
                      <h3 className="font-semibold text-warm-800 text-sm sm:text-base">
                        {phase.title}
                      </h3>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </div>

                  <p className="text-xs text-warm-400 mb-4 ml-8">{phase.desc}</p>

                  {/* Barre de progression */}
                  <div className="flex items-center gap-3 mb-4 ml-8">
                    <div className="flex-1 h-1 rounded-full bg-warm-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress === 100 ? 'bg-emerald-500' : progress > 0 ? 'bg-accent' : 'bg-warm-200'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-warm-400 font-medium whitespace-nowrap">
                      {doneCount}/{totalCount}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-1 ml-8">
                    {phase.tasks.map((task, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2.5 py-1.5"
                      >
                        {task.done ? (
                          <span className="w-3.5 h-3.5 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center shrink-0">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded border border-warm-300 bg-white shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            task.done ? 'text-warm-500 line-through decoration-warm-300' : 'text-warm-600'
                          }`}
                        >
                          {task.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note perso */}
        <div className="mt-10 p-5 rounded-xl border border-warm-200 bg-white">
          <p className="text-sm text-warm-600 leading-relaxed">
            <span className="font-medium text-warm-800">Note :</span> Ce projet évolue
            au fur et à mesure que j'apprends. J'ai 16 ans, je suis encore au lycée, et je
            code pendant mon temps libre. Si une fonctionnalité prend du temps, c'est normal —
            l'important c'est d'avancer. 🙂
          </p>
        </div>
      </div>
    </div>
  );
}
