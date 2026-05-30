import { ExempleDevoir } from '../types';

export const exemplesDevoirs: ExempleDevoir[] = [
  {
    matiere: 'Mathématiques',
    niveau: '3ème',
    sujet: 'Théorème de Pythagore',
    questions: [
      {
        question: 'Dans un triangle rectangle ABC, rectangle en C, avec AC = 3 cm et BC = 4 cm. Calculer AB.',
        reponse: 'AB² = AC² + BC² = 9 + 16 = 25, donc AB = 5 cm',
      },
      {
        question: 'Le triangle DEF avec DE = 5, EF = 12 et DF = 13 est-il rectangle ? Justifier.',
        reponse: 'DE² + EF² = 25 + 144 = 169 = 13² = DF² donc oui le triangle est rectangle en E par la réciproque du théorème de Pythagore.',
      },
      {
        question: 'Calculer la diagonale d\'un rectangle de longueur 8 cm et de largeur 6 cm.',
        reponse: 'd = racine de (8² + 6²) = racine de 100 = 10 cm',
      },
    ],
  },
  {
    matiere: 'Français',
    niveau: '2nde',
    sujet: 'Analyse de texte - Les Misérables',
    questions: [
      {
        question: 'Identifiez la figure de style dans : "C\'était un homme de cinquante ans environ, qui avait l\'air préoccupé et qui était bon."',
        reponse: 'C\'est un portrait, une description du personnage. Il y a aussi une antithèse entre "préoccupé" et "bon".',
      },
      {
        question: 'Quel est le registre dominant dans l\'extrait étudié ?',
        reponse: 'Le registre est pathétique car Hugo veut nous faire ressentir de la pitié pour Jean Valjean.',
      },
    ],
  },
  {
    matiere: 'Histoire',
    niveau: '1ère',
    sujet: 'La Révolution française',
    questions: [
      {
        question: 'Quelles sont les causes principales de la Révolution française ?',
        reponse: 'Les causes sont : la crise financière du royaume, les inégalités entre les trois ordres (clergé, noblesse, tiers-état), les idées des Lumières et la famine de 1788.',
      },
      {
        question: 'Expliquez l\'importance de la prise de la Bastille (14 juillet 1789).',
        reponse: 'La prise de la Bastille est importante car c\'est le symbole de la chute de l\'absolutisme royal. Le peuple de Paris prend cette prison-forteresse qui représentait le pouvoir arbitraire du roi.',
      },
    ],
  },
];

export const exemplePromptV1 = `Tu es un correcteur de devoirs. Corrige ce devoir.

Matière: {matiere}
Devoir: {devoir}

Donne une note et des commentaires.`;

export const exemplePromptV2 = `# Rôle
Tu es un professeur expérimenté de {matiere} au niveau {niveau} dans le système éducatif français.

# Objectif
Corriger le devoir de l'élève de manière constructive et pédagogique.

# Contexte
- Matière : {matiere}
- Niveau : {niveau}
- Sujet : {sujet}
- Barème total : 20 points

# Devoir de l'élève
{devoir}

# Instructions de correction
1. Évalue CHAQUE question séparément
2. Pour chaque question, indique :
   - Si la réponse est correcte, partiellement correcte ou incorrecte
   - Les points attribués sur le barème de la question
   - Un commentaire pédagogique constructif
3. NE PAS inventer de connaissances - si tu n'es pas sûr, dis-le
4. Sois encourageant tout en restant précis sur les erreurs
5. Propose des pistes d'amélioration concrètes

# Format de sortie (JSON strict)
{
  "note": <number>,
  "noteMax": <number>,
  "commentaireGeneral": "<string>",
  "corrections": [
    {
      "question": "<string>",
      "reponseEleve": "<string>",
      "status": "correct" | "partiel" | "incorrect",
      "commentaire": "<string>",
      "pointsObtenus": <number>,
      "pointsMax": <number>
    }
  ],
  "suggestions": ["<string>"]
}`;

export const exemplePromptV3 = `<system>
Tu es un correcteur de devoirs IA spécialisé pour le système éducatif français.
Tu dois être OBJECTIF, PRÉCIS et PÉDAGOGIQUE.

RÈGLES STRICTES :
- Ne JAMAIS inventer d'informations
- Ne JAMAIS donner plus de points que le barème maximum
- TOUJOURS justifier tes corrections avec des références au programme
- Si une réponse est ambiguë, accorde le bénéfice du doute à l'élève
- Utilise un ton bienveillant mais rigoureux
</system>

<context>
Matière : {matiere}
Niveau : {niveau}  
Sujet : {sujet}
Barème : 20 points
Référentiel : Programme officiel de l'Éducation nationale française
</context>

<rubric>
Pour chaque question, applique cette grille :
- CORRECT (100% des points) : Réponse exacte, bien justifiée, rédaction soignée
- PARTIEL (25-75% des points) : Réponse incomplète, erreur mineure, ou manque de justification
- INCORRECT (0% des points) : Réponse fausse, hors-sujet, ou absence de réponse
</rubric>

<student_work>
{devoir}
</student_work>

<output_format>
Réponds UNIQUEMENT en JSON valide, sans texte avant ni après.
Structure attendue :
{
  "note": number,
  "noteMax": number,
  "commentaireGeneral": string,
  "corrections": [
    {
      "question": string,
      "reponseEleve": string,
      "status": "correct" | "partiel" | "incorrect",
      "commentaire": string,
      "pointsObtenus": number,
      "pointsMax": number
    }
  ],
  "suggestions": string[]
}
</output_format>`;
