import { ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface PageAccueilProps {
  onNavigate: (page: Page) => void;
}

export default function PageAccueil({ onNavigate }: PageAccueilProps) {
  return (
    <div className="min-h-screen">
      {/* Hero — simple et direct */}
      <section className="pt-28 pb-16 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-accent font-medium mb-4">
            Projet open-source · Propulsé par Mistral AI
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 leading-snug mb-5">
            Un outil qui corrige les devoirs
            <br className="hidden sm:block" />
            avec l'intelligence artificielle.
          </h1>
          <p className="text-warm-500 text-base leading-relaxed mb-8 max-w-lg">
            HomeworkAI analyse les réponses des élèves, attribue une note
            question par question, et donne des commentaires pour progresser.
            Le tout en quelques secondes.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('correcteur')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-light transition-colors"
            >
              Essayer le correcteur
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('architecture')}
              className="px-5 py-2.5 text-warm-600 text-sm font-medium rounded-lg border border-warm-200 hover:border-warm-300 hover:text-warm-800 transition-colors"
            >
              Comment ça marche
            </button>
          </div>
        </div>
      </section>

      {/* Séparateur léger */}
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="border-t border-warm-200/80" />
      </div>

      {/* Comment ça marche — version naturelle */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-warm-900 mb-8">
            Comment ça fonctionne
          </h2>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-accent-soft text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium text-warm-800 mb-1">Tu remplis le formulaire</h3>
                <p className="text-sm text-warm-500 leading-relaxed">
                  Tu choisis la matière, le niveau scolaire, le sujet du devoir, puis tu
                  renseignes les questions et les réponses de l'élève.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-accent-soft text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium text-warm-800 mb-1">L'IA analyse chaque réponse</h3>
                <p className="text-sm text-warm-500 leading-relaxed">
                  Le devoir est envoyé à une fonction serverless sur Vercel, qui le transmet à
                  l'API Mistral avec un prompt spécialement conçu pour la correction de devoirs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-accent-soft text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium text-warm-800 mb-1">Tu reçois la correction complète</h3>
                <p className="text-sm text-warm-500 leading-relaxed">
                  Chaque question est notée individuellement avec un commentaire. Tu obtiens
                  aussi une note globale et des pistes pour t'améliorer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="border-t border-warm-200/80" />
      </div>

      {/* Ce que ça donne — preview concret */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-warm-900 mb-2">
            Ce que l'IA retourne
          </h2>
          <p className="text-sm text-warm-500 mb-6">
            Voici un aperçu du type de correction que HomeworkAI génère.
          </p>

          <div className="rounded-xl border border-warm-200 bg-white overflow-hidden">
            {/* Note header */}
            <div className="px-5 py-4 border-b border-warm-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-warm-400 mb-0.5">Mathématiques · 3ème</p>
                <p className="font-medium text-warm-800 text-sm">Théorème de Pythagore</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-warm-900">14<span className="text-warm-400 text-base font-normal">/20</span></p>
              </div>
            </div>

            {/* Questions */}
            <div className="divide-y divide-warm-100">
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Correct — 6/7</span>
                </div>
                <p className="text-sm text-warm-700 mb-1">Calculer AB dans un triangle rectangle...</p>
                <p className="text-xs text-warm-400 leading-relaxed">
                  « La réponse est globalement correcte. Le calcul AB² = AC² + BC² = 9 + 16 = 25, donc AB = 5 cm est juste. Point à corriger : il faut citer explicitement le théorème de Pythagore avant de commencer le calcul ("D'après le théorème de Pythagore, dans le triangle ABC rectangle en C..."). Sans cette justification, vous perdez des points de rédaction. »
                </p>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Correct — 7/7</span>
                </div>
                <p className="text-sm text-warm-700 mb-1">Le triangle DEF est-il rectangle ?</p>
                <p className="text-xs text-warm-400 leading-relaxed">
                  « Bonne réponse dans l'ensemble. Vous avez correctement identifié qu'il fallait utiliser la réciproque du théorème de Pythagore, vous avez vérifié que DE² + EF² = DF², et vous avez précisé en quel sommet le triangle est rectangle. La rédaction est claire et structurée. Pour viser la note maximale, ajoutez une phrase d'introduction rappelant la réciproque. »
                </p>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Partiel — 1/6</span>
                </div>
                <p className="text-sm text-warm-700 mb-1">Calculer la diagonale d'un rectangle...</p>
                <p className="text-xs text-warm-400 leading-relaxed">
                  « La réponse est partiellement correcte, mais il y a des points à améliorer. Le résultat numérique (10 cm) est juste, cependant il manque toute la justification. Problèmes identifiés : 1. Il faut expliquer pourquoi le théorème de Pythagore s'applique ici (les angles d'un rectangle sont droits, donc la diagonale forme un triangle rectangle). 2. Les étapes de calcul ne sont pas détaillées. En mathématiques, chaque réponse doit comporter les calculs détaillés et le résultat final. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="border-t border-warm-200/80" />
      </div>

      {/* À propos du projet */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-warm-900 mb-4">
            À propos du projet
          </h2>
          <div className="space-y-3 text-sm text-warm-500 leading-relaxed">
            <p>
              HomeworkAI est un projet personnel développé par un lycéen de 16 ans. L'objectif
              est simple : aider les élèves à comprendre leurs erreurs et les enseignants à
              gagner du temps sur la correction.
            </p>
            <p>
              Le projet utilise l'API Mistral (un modèle de langage français) pour analyser
              les devoirs et générer des corrections structurées. Tout le backend tourne sur
              des fonctions serverless Vercel — pas besoin de gérer un serveur.
            </p>
            <p>
              C'est un projet en cours de développement. La roadmap inclut l'authentification,
              le stockage des corrections, un système premium, et un pipeline de correction
              multi-étapes pour améliorer la précision.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {['Vanilla JS', 'Vercel', 'Serverless', 'Mistral AI', 'GitHub'].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-md bg-warm-100 text-warm-600 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA simple */}
      <section className="pb-20 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-xl bg-accent-soft border border-indigo-100">
            <h3 className="font-semibold text-warm-900 mb-2">
              Envie de tester ?
            </h3>
            <p className="text-sm text-warm-500 mb-5">
              Le correcteur est en mode démo — tu peux charger un exemple et voir à quoi
              ressemble une correction complète.
            </p>
            <button
              onClick={() => onNavigate('correcteur')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-light transition-colors"
            >
              Ouvrir le correcteur
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
