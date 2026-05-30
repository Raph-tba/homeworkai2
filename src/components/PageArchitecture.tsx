import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-warm-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-warm-50/50 transition-colors"
      >
        <span className="font-medium text-warm-800 text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-warm-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-warm-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PageArchitecture() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold text-warm-900 mb-2">Architecture</h1>
          <p className="text-sm text-warm-500">
            Comment HomeworkAI est construit, du clic de l'utilisateur jusqu'à la réponse de l'IA.
          </p>
        </div>

        {/* Pipeline simple */}
        <div className="rounded-xl border border-warm-200 bg-white p-5 sm:p-6 mb-8">
          <h2 className="text-sm font-semibold text-warm-800 mb-5">Le parcours d'une correction</h2>

          <div className="space-y-0">
            {[
              {
                label: 'Navigateur',
                detail: 'L\'utilisateur remplit le formulaire et clique sur "Corriger"',
                tech: 'HTML / CSS / JavaScript',
              },
              {
                label: 'Requête HTTP',
                detail: 'Le formulaire envoie un POST vers /api/check-homework',
                tech: 'fetch() → POST avec JSON',
              },
              {
                label: 'Fonction serverless',
                detail: 'Vercel reçoit la requête, construit le prompt, et appelle Mistral',
                tech: 'Vercel Serverless Function (Node.js)',
              },
              {
                label: 'API Mistral',
                detail: 'Le modèle analyse le devoir et génère une correction structurée en JSON',
                tech: 'mistral-large-latest · temperature: 0.1',
              },
              {
                label: 'Réponse',
                detail: 'Le JSON est renvoyé au navigateur qui affiche la correction',
                tech: 'JSON → rendu dans le HTML',
              },
            ].map((step, i, arr) => (
              <div key={i} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-warm-200 my-1" />}
                </div>
                <div className="pb-6 last:pb-0">
                  <p className="text-sm font-medium text-warm-800">{step.label}</p>
                  <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">{step.detail}</p>
                  <p className="text-[11px] text-warm-400 mt-1 font-mono">{step.tech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exemples de code */}
        <h2 className="text-sm font-semibold text-warm-800 mb-4">Détails techniques</h2>

        <div className="space-y-3 mb-8">
          <Accordion title="Ce que le client envoie (requête)" defaultOpen>
            <pre className="p-4 rounded-lg bg-warm-50 border border-warm-100 text-xs overflow-x-auto font-mono leading-relaxed">
              <code className="text-warm-700">
{`POST /api/check-homework
Content-Type: application/json

{
  "matiere": "Mathématiques",
  "niveau": "3ème",
  "sujet": "Théorème de Pythagore",
  "questions": [
    {
      "question": "Calculer AB dans un triangle...",
      "reponse": "AB² = AC² + BC² = 25, AB = 5"
    }
  ]
}`}
              </code>
            </pre>
          </Accordion>

          <Accordion title="Ce que la serverless function fait">
            <div className="text-sm text-warm-500 leading-relaxed space-y-3">
              <p>La fonction reçoit la requête et fait 3 choses :</p>
              <ol className="list-decimal list-inside space-y-2 text-warm-600">
                <li>Elle <strong>valide</strong> les données (matière non vide, questions présentes...)</li>
                <li>Elle <strong>construit le prompt</strong> en injectant les données dans un template</li>
                <li>Elle <strong>appelle l'API Mistral</strong> et retourne la réponse au client</li>
              </ol>
              <pre className="p-4 rounded-lg bg-warm-50 border border-warm-100 text-xs overflow-x-auto font-mono leading-relaxed mt-3">
                <code className="text-warm-700">
{`// api/check-homework.js (simplifié)
const response = await fetch(
  "https://api.mistral.ai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.MISTRAL_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  }
);`}
                </code>
              </pre>
            </div>
          </Accordion>

          <Accordion title="Ce que l'IA retourne (réponse)">
            <pre className="p-4 rounded-lg bg-warm-50 border border-warm-100 text-xs overflow-x-auto font-mono leading-relaxed">
              <code className="text-warm-700">
{`{
  "note": 8.5,
  "noteMax": 10,
  "commentaireGeneral": "Très bon travail...",
  "corrections": [
    {
      "question": "Calculer AB...",
      "reponseEleve": "AB² = AC² + BC²...",
      "status": "correct",
      "pointsObtenus": 3,
      "pointsMax": 3,
      "commentaire": "Parfait !"
    }
  ],
  "suggestions": [
    "Toujours citer le théorème utilisé"
  ]
}`}
              </code>
            </pre>
          </Accordion>
        </div>

        {/* Problèmes & solutions */}
        <h2 className="text-sm font-semibold text-warm-800 mb-4">Problèmes rencontrés</h2>

        <div className="space-y-3">
          <Accordion title="L'IA invente des choses (hallucinations)">
            <div className="text-sm text-warm-500 leading-relaxed space-y-2">
              <p>
                Parfois Mistral invente des règles de maths ou des dates historiques. 
                C'est le problème le plus courant avec les LLMs.
              </p>
              <p className="font-medium text-warm-700">Ce qu'on fait pour limiter ça :</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Temperature à 0.1 — réponses plus prévisibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Instruction explicite : « Si tu n'es pas sûr, dis-le »</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Rubrique de notation pour cadrer les réponses</span>
                </li>
              </ul>
            </div>
          </Accordion>

          <Accordion title="Les notes changent d'un appel à l'autre">
            <div className="text-sm text-warm-500 leading-relaxed space-y-2">
              <p>
                Le même devoir peut recevoir 7/10 puis 8/10 quelques secondes après.
                Les LLMs ne sont pas déterministes.
              </p>
              <p className="font-medium text-warm-700">Solutions :</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Critères de notation très précis dans le prompt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Format JSON imposé pour éviter l'ambiguïté</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warm-400 mt-0.5">○</span>
                  <span>À venir : pipeline multi-étapes (analyser, puis noter, puis commenter)</span>
                </li>
              </ul>
            </div>
          </Accordion>

          <Accordion title="Sécurité de la clé API">
            <div className="text-sm text-warm-500 leading-relaxed space-y-2">
              <p>
                La clé API Mistral doit rester secrète. Si quelqu'un la récupère, il peut
                faire des appels à notre place (et on paye).
              </p>
              <p className="font-medium text-warm-700">Comment c'est géré :</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Clé stockée dans les variables d'environnement Vercel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Jamais dans le code côté client — uniquement dans la serverless function</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warm-400 mt-0.5">○</span>
                  <span>À venir : rate limiting pour limiter les abus</span>
                </li>
              </ul>
            </div>
          </Accordion>

          <Accordion title="L'IA ne retourne pas du JSON valide">
            <div className="text-sm text-warm-500 leading-relaxed space-y-2">
              <p>
                Parfois Mistral ajoute du texte avant ou après le JSON, ce qui casse le parsing.
              </p>
              <p className="font-medium text-warm-700">Solutions :</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Paramètre <code className="px-1 py-0.5 bg-warm-100 rounded text-xs">response_format: {"{ type: 'json_object' }"}</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>try/catch autour du JSON.parse()</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warm-400 mt-0.5">○</span>
                  <span>À venir : validation avec Zod (librairie de schéma)</span>
                </li>
              </ul>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
