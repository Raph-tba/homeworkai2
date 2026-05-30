import { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { exemplePromptV1, exemplePromptV2, exemplePromptV3 } from '../data/exemples';

export default function PagePrompts() {
  const [activeVersion, setActiveVersion] = useState(2);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const versions = [
    {
      title: 'V1 — Le prompt basique',
      desc: 'Ce qu\'on écrit quand on débute. Ça marche... parfois.',
      prompt: exemplePromptV1,
      good: ['Simple à écrire', 'Facile à lire'],
      bad: [
        'Aucun format de sortie → réponse imprévisible',
        'Pas de barème → notation au feeling',
        'Aucune consigne anti-hallucination',
        'Rôle trop vague ("correcteur de devoirs")',
      ],
    },
    {
      title: 'V2 — Le prompt structuré',
      desc: 'On ajoute du contexte, un rôle précis, et on demande du JSON.',
      prompt: exemplePromptV2,
      good: [
        'Rôle précis : "professeur de {matière} au niveau {niveau}"',
        'Contexte complet : matière, niveau, sujet, barème',
        'Instructions étape par étape',
        'Format JSON imposé dans le prompt',
        'Notation par question séparément',
      ],
      bad: [
        'Pas de grille de notation objective (correct/partiel/incorrect)',
        'Pas de balises pour séparer les sections',
        'Manque des règles anti-hallucination fortes',
      ],
    },
    {
      title: 'V3 — Le prompt de production',
      desc: 'Balises XML, rubrique de notation, garde-fous. Le plus fiable.',
      prompt: exemplePromptV3,
      good: [
        'Balises XML (<system>, <rubric>, etc.) pour structurer',
        'Règles strictes : "Ne JAMAIS inventer d\'informations"',
        'Rubrique de notation claire (100%, 25-75%, 0%)',
        'Référence au programme officiel',
        'Ton défini : "bienveillant mais rigoureux"',
        'Instruction "UNIQUEMENT en JSON valide"',
      ],
      bad: [
        'Plus long = plus de tokens = légèrement plus cher',
        'Plus complexe à maintenir et modifier',
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold text-warm-900 mb-2">Prompt Engineering</h1>
          <p className="text-sm text-warm-500 leading-relaxed">
            Le prompt c'est le texte qu'on envoie à l'IA pour lui dire quoi faire.
            Un bon prompt = des corrections fiables. Voici comment le nôtre a évolué.
          </p>
        </div>

        {/* Principes essentiels */}
        <div className="rounded-xl border border-warm-200 bg-white p-5 sm:p-6 mb-8">
          <h2 className="text-sm font-semibold text-warm-800 mb-4">
            Les 6 règles d'un bon prompt de correction
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              { rule: 'Donner un rôle précis', ex: '"Tu es un prof de maths en 3ème"' },
              { rule: 'Fournir tout le contexte', ex: 'Matière, niveau, barème, sujet' },
              { rule: 'Imposer un format de sortie', ex: 'JSON avec structure définie' },
              { rule: 'Ajouter des garde-fous', ex: '"Ne jamais inventer d\'infos"' },
              { rule: 'Définir une rubrique', ex: 'Correct = 100%, Partiel = 50%...' },
              { rule: 'Baisser la température', ex: 'temperature: 0.1 → plus stable' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 py-2">
                <span className="text-xs font-bold text-accent bg-accent-soft w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-warm-700">{item.rule}</p>
                  <p className="text-xs text-warm-400">{item.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sélecteur de version */}
        <div className="flex gap-2 mb-6 border-b border-warm-200 pb-px">
          {versions.map((_v, i) => (
            <button
              key={i}
              onClick={() => setActiveVersion(i)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeVersion === i
                  ? 'border-accent text-accent'
                  : 'border-transparent text-warm-400 hover:text-warm-600'
              }`}
            >
              V{i + 1}
            </button>
          ))}
        </div>

        {/* Version active */}
        {versions.map((v, i) =>
          activeVersion === i ? (
            <div key={i} className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-warm-900 mb-1">{v.title}</h3>
                <p className="text-sm text-warm-500">{v.desc}</p>
              </div>

              {/* Code */}
              <div className="rounded-xl border border-warm-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-warm-50 border-b border-warm-200">
                  <span className="text-xs text-warm-400 font-mono">prompt-v{i + 1}.txt</span>
                  <button
                    onClick={() => copyToClipboard(v.prompt, i)}
                    className="flex items-center gap-1 text-xs text-warm-400 hover:text-accent transition-colors"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check size={12} /> Copié
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copier
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-white text-xs overflow-x-auto max-h-80 overflow-y-auto font-mono leading-relaxed">
                  <code className="text-warm-600">{v.prompt}</code>
                </pre>
              </div>

              {/* Analyse */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <h4 className="text-xs font-semibold text-emerald-700 mb-2.5">✓ Points forts</h4>
                  <ul className="space-y-1.5">
                    {v.good.map((g, j) => (
                      <li key={j} className="text-xs text-warm-600 leading-relaxed">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/30 p-4">
                  <h4 className="text-xs font-semibold text-red-700 mb-2.5">✗ Points faibles</h4>
                  <ul className="space-y-1.5">
                    {v.bad.map((b, j) => (
                      <li key={j} className="text-xs text-warm-600 leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Navigation entre versions */}
              {i < versions.length - 1 && (
                <button
                  onClick={() => setActiveVersion(i + 1)}
                  className="text-xs text-accent hover:underline"
                >
                  Voir la version suivante →
                </button>
              )}
            </div>
          ) : null
        )}

        {/* Techniques avancées */}
        <div className="mt-12">
          <h2 className="text-base font-semibold text-warm-900 mb-2">Pour aller plus loin</h2>
          <p className="text-sm text-warm-500 mb-5">
            Des techniques que tu peux ajouter pour améliorer encore la qualité.
          </p>

          <div className="space-y-3">
            <AdvancedTip
              title="Few-shot learning — donner des exemples"
              desc="Tu ajoutes 2-3 exemples de corrections dans ton prompt pour montrer exactement ce que tu attends. L'IA comprend beaucoup mieux quand elle a des exemples concrets."
              code={`"Voici un exemple de correction :\nQuestion: 2+2=?\nRéponse: 5\n→ incorrect, 0/2 pts\n→ La réponse correcte est 4."`}
            />
            <AdvancedTip
              title="Chain of Thought — forcer le raisonnement"
              desc={"Tu demandes à l'IA de réfléchir étape par étape avant de donner une note. Ça réduit les erreurs de jugement."}
              code={`"Avant de noter, raisonne en 3 étapes :\n1. Quels concepts sont attendus ?\n2. La réponse contient-elle ces concepts ?\n3. La rédaction est-elle correcte ?"`}
            />
            <AdvancedTip
              title="Multi-step pipeline — plusieurs appels"
              desc="Au lieu d'un seul appel à l'IA, on fait plusieurs appels spécialisés. Plus lent mais beaucoup plus fiable."
              code={`Appel 1 → Extraire les réponses clés\nAppel 2 → Vérifier chaque réponse\nAppel 3 → Attribuer les notes\nAppel 4 → Rédiger les commentaires`}
            />
            <AdvancedTip
              title="Validation avec Zod — vérifier la sortie"
              desc="Même avec response_format: json_object, il faut vérifier que le JSON a la bonne structure. Zod fait ça automatiquement."
              code={`import { z } from "zod";\n\nconst schema = z.object({\n  note: z.number().min(0),\n  corrections: z.array(z.object({\n    status: z.enum(["correct", "partiel", "incorrect"])\n  }))\n});\n\nconst result = schema.parse(aiResponse);`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvancedTip({ title, desc, code }: { title: string; desc: string; code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-warm-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-warm-50/50 transition-colors"
      >
        <span className="font-medium text-warm-800 text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-warm-400 transition-transform duration-200 shrink-0 ml-4 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-warm-100 pt-4">
          <p className="text-sm text-warm-500 leading-relaxed mb-3">{desc}</p>
          <pre className="p-3 rounded-lg bg-warm-50 border border-warm-100 text-xs overflow-x-auto font-mono leading-relaxed">
            <code className="text-warm-600">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
