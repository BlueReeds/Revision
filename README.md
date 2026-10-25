# Ride & Révise

Appli de révision à thème VTT : quiz HTML rangés par matière et par leçon, plusieurs versions par leçon, cartes mentales, espace parents et tableau de bord des notes.

- **Le site** (les fichiers de ce dossier) est hébergé gratuitement sur **GitHub Pages**.
- **Les données** (quiz, cartes, notes, réglages) sont dans une base **Firebase Realtime Database**, gratuite elle aussi.

Les parents ajoutent les quiz **depuis l'appli** (onglet Parents). Pas besoin de retoucher GitHub après la mise en ligne.

---

## Étape 1 : créer la base Firebase (5 minutes)

1. Va sur **console.firebase.google.com** et connecte-toi avec un compte Google.
2. Clique sur **Créer un projet** et nomme-le, par exemple `ride-revise`. Google Analytics n'est pas nécessaire, tu peux le désactiver.
3. Dans le menu de gauche : **Créer** → **Realtime Database** → **Créer une base de données**.
4. Choisis l'emplacement **Belgique (europe-west1)**, puis **Démarrer en mode test**.
5. Ouvre l'onglet **Règles**, remplace tout le contenu par ce texte, puis clique sur **Publier** :

```json
{
  "rules": {
    "rr": {
      ".read": true,
      ".write": true
    }
  }
}
```

Firebase affichera un avertissement sur les « règles publiques ». C'est normal : toute personne qui connaît l'adresse de la base peut lire et écrire dedans. Garde le lien du site en famille.

6. Copie l'adresse affichée en haut de l'onglet **Données**. Elle ressemble à :
   `https://ride-revise-default-rtdb.europe-west1.firebasedatabase.app`

## Étape 2 : régler `config.js`

Ouvre `config.js` et colle l'adresse Firebase entre les guillemets de `firebaseUrl`. Profites-en pour changer `codeParents`, le code qui protège l'espace parents.

```js
window.RR_CONFIG = {
  firebaseUrl: "https://ride-revise-default-rtdb.europe-west1.firebasedatabase.app",
  codeParents: "4821"
};
```

Ce code empêche seulement l'élève d'ouvrir l'espace parents par erreur. Ce n'est pas une vraie sécurité.

## Étape 3 : mettre le site en ligne avec GitHub Pages

1. Sur **github.com**, clique sur **+** → **New repository**. Nomme-le `ride-et-revise`, laisse-le en **Public**, puis **Create repository**.
2. Clique sur **uploading an existing file**. Dézippe le dossier sur ton ordinateur, puis glisse **tout son contenu** dans la page : `index.html`, `app.js`, `config.js`, `README.md` et les dossiers `contenu` et `images`. `index.html` doit être à la racine, pas dans un sous-dossier.
3. Clique sur **Commit changes**.
4. Va dans **Settings** → **Pages**. Sous « Build and deployment », choisis **Deploy from a branch**, puis la branche **main** et le dossier **/ (root)**, et clique sur **Save**.
5. Attends une à deux minutes. Ton site est en ligne à l'adresse `https://ton-pseudo.github.io/ride-et-revise/`.

Pour modifier `config.js` plus tard : ouvre le fichier sur GitHub, clique sur l'icône crayon, fais ta modification, puis **Commit changes**. Le site se met à jour en une minute environ.

> Si GitHub Pages pose problème, le même dossier fonctionne tel quel sur **Cloudflare Pages** : Workers & Pages → Create → Pages → Upload assets, puis glisse le dossier.

## Étape 4 : premier lancement

1. Ouvre le site, va dans l'onglet **Parents** et tape le code.
2. Dans **Leçons prêtes à importer**, clique sur **Importer** pour chaque leçon : les fractions (Maths) et le présent de l'indicatif (Français).
3. Mets le prénom de l'élève et, si tu veux, une photo de son VTT pour l'accueil.
4. Envoie le lien à ton fils. Sur son téléphone, il peut l'ajouter à l'écran d'accueil (Partager → « Sur l'écran d'accueil »).

---

## Ajouter des quiz

Onglet **Parents** → **Ajouter un quiz** : choisis la matière et la leçon (ou crée-les sur place), puis un ou plusieurs fichiers `.html`. Chaque fichier devient une version : Version 1, Version 2…

Les cartes mentales peuvent être des pages `.html`, des images (`.png`, `.jpg`) ou des PDF de 5 Mo maximum.

### Notes automatiques

Pour que la note s'enregistre toute seule, le quiz doit envoyer ce message quand l'élève termine :

```js
parent.postMessage({ type: "quiz-score", score: 9, total: 12 }, "*");
```

Les quiz du dossier `contenu/` le font déjà. Pour les autres quiz, l'élève tape sa note en bas de l'écran.

## Ajouter une leçon prête à importer

Quand Claude te prépare une nouvelle leçon pour Ride & Révise, il te donne les fichiers à déposer dans `contenu/` et la ligne à ajouter dans `contenu/packs.json`. Le bouton **Importer** apparaît alors dans l'espace parents.

Tu peux aussi simplement ajouter les fichiers .html depuis l'appli, avec le formulaire **Ajouter un quiz**.

## Planning de révision

L'onglet **Planning** montre la semaine en créneaux d'une heure, de 8 h à 22 h.

- **Ajouter une révision** : touche un créneau libre, puis choisis la matière, et si tu veux la leçon, le quiz à faire et une consigne.
- **Suivi automatique** : un créneau passe à « fait » (✓) dès qu'un quiz de cette leçon est terminé ce jour-là. On peut aussi cocher « Révision faite » à la main. Un créneau passé et pas fait est marqué d'un point rouge.
- **Copier la semaine précédente** : reprend tous les créneaux de la semaine d'avant, pratique pour un emploi du temps qui se répète.
- **Accueil** : la carte « Au programme aujourd'hui » liste les révisions du jour, avec un bouton pour lancer directement le quiz.

Sur téléphone, le planning s'affiche jour par jour. Sur ordinateur, toute la semaine est visible d'un coup.

## Les photos

Les fonds viennent du dossier `images/` :

| Fichier | Où il apparaît |
|---|---|
| `accueil.jpg` | Grand bandeau de l'accueil |
| `sommet.jpg` | Page Matières, et 1ʳᵉ matière |
| `rider.jpg` | Tableau de bord, et 5ᵉ matière |
| `falaise.jpg` | Espace parents, et 3ᵉ matière |
| `glacier.jpg`, `pierrier.jpg` | 2ᵉ et 4ᵉ matières |

Pour changer une photo, envoie sur GitHub une nouvelle image **portant exactement le même nom**, dans `images/`. Elle remplace l'ancienne. Choisis des photos en paysage d'au moins 1600 pixels de large.

Tu peux aussi changer les photos depuis l'appli, sans GitHub :
- **Accueil** : Parents → Réglages → Photo de VTT.
- **Chaque matière** : Parents → Contenu du parcours → bouton **Photo** à côté de la matière. La photo s'affiche sur la carte de la matière et en haut de ses leçons.

Le dépôt GitHub est public, donc tout le monde peut voir les images qu'il contient. Utilise tes propres photos ou des photos libres de droits (par exemple sur unsplash.com ou pexels.com, recherche « mountain bike »).

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | La page et sa mise en forme |
| `app.js` | Le fonctionnement de l'appli |
| `config.js` | Adresse Firebase et code parents |
| `contenu/` | Leçons prêtes à importer (quiz et cartes mentales) et leur liste `packs.json` |
| `images/` | Photos de fond |

## Limites de l'offre gratuite de Firebase

1 Go de stockage et 10 Go téléchargés par mois. Un quiz pèse environ 12 Ko : on peut en stocker des milliers.
