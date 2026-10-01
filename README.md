# Henna Day , Invitation Numérique

Carte d'invitation animée pour une **soirée de henné**, entièrement configurable via un seul fichier. Aucune dépendance, aucun build , du HTML/CSS/JS pur, prêt à être hébergé en une minute.

---

## Aperçu

- Enveloppe interactive qui s'ouvre au clic ou au toucher : sceau qui s'envole, rabat 3D, étincelles dorées
- **Musique d'ambiance** lancée à l'ouverture, avec fondu d'entrée et bouton de coupure
- Révélation lettre par lettre des prénoms
- Particules dorées en toile de fond (canvas)
- Compte à rebours jusqu'à la soirée
- Carte Google Maps optionnelle
- Version PDF A5 prête à imprimer
- 100 % responsive , optimisé mobile
- Respecte `prefers-reduced-motion`

---

## Démarrage rapide

```bash
git clone https://github.com/AhmedBassoul1/Henna-Day.git
cd Henna-Day
# Ouvrir index.html dans un navigateur , aucun serveur requis
```

---

## Personnalisation

Toute la configuration se fait dans **`config.js`** :

```js
// Les mariés
const brideName = "Safae";
const groomName = "Moulay Ahmed";
const monogram  = "S & A";            // signature du pied de page ("" → initiales auto)

// L'événement
const eventTitle     = "Henna Day";
const eventSubtitle  = "Soirée de Henné";
const weddingDate    = "2026-10-17T16:00:00";  // ISO , alimente le compte à rebours
const weddingDateLabel = "17 Octobre 2026";
const eventTimeLabel = "16H00";
const weddingLocation = "gzenaya, Tanger";
const invitationNote = "Votre présence illuminera notre soirée…";

// Ressources (dossier Data/)
const dataFolder  = "Data";
const coupleImage = `${dataFolder}/photo-transparent.png`;
const musicFile   = `${dataFolder}/music.mp3`;   // "" pour désactiver le son
const musicVolume = 0.55;                        // volume final, 0 → 1
const musicFadeIn = 2500;                        // fondu d'entrée, en ms

// Optionnel
const mapUrl = "";  // URL Google Maps embed , "" pour masquer la section
```

Déposez vos propres fichiers dans `Data/` et ajustez les chemins ci-dessus. Pour la photo, un PNG détouré (fond transparent) donne le meilleur rendu dans le médaillon.

### Musique

Le navigateur n'autorise la lecture audio qu'après une interaction : la musique démarre donc **au clic sur l'enveloppe**, jamais avant. Un bouton en haut à droite permet de la couper à tout moment, et la lecture se met en pause si l'onglet passe en arrière-plan.

---

## Structure du projet

```
Henna-Day/
├── index.html          # Page principale
├── style.css           # Thème olive & doré, animations
├── script.js           # Logique : enveloppe, compte à rebours, particules, PDF
├── config.js           # ← seul fichier à modifier
├── Data/
│   ├── photo.png              # Photo originale
│   ├── photo-transparent.png  # Photo détourée (fond supprimé)
│   └── music.mp3              # Musique d'ambiance
├── Invitation-Henna-Day.pdf   # Carte A5 prête à imprimer
└── .gitignore          # Exclut les PDF générés
```

---

## Hébergement

Le site est statique , déposez les fichiers sur n'importe quel hébergeur :

- **GitHub Pages** : activez Pages sur la branche `main`
- **Vercel / Netlify** : importez le dépôt, aucune commande de build
- **Partage local** : `python3 -m http.server 8080`

---

## Technologies

| Rôle | Détail |
|---|---|
| Structure | HTML5 sémantique |
| Style | CSS3 custom properties, animations, `clamp()` |
| Logique | Vanilla JS (ES2020), pas de framework |
| Audio | `<audio>` natif, fondu d'entrée piloté en rAF |
| Polices | Google Fonts , Cormorant Garamond, Dancing Script, Great Vibes, Amiri |
| PDF | `Invitation-Henna-Day.pdf` , A5 vectoriel, polices embarquées |

---

## Licence

Usage personnel , invitation privée pour Safae & Moulay Ahmed · Octobre 2026.
