# Henna Day — Invitation Numérique

Carte d'invitation animée pour une **soirée de henné**, entièrement configurable via un seul fichier. Aucune dépendance, aucun build — du HTML/CSS/JS pur, prêt à être hébergé en une minute.

---

## Aperçu

- Enveloppe interactive qui s'ouvre au clic ou au toucher
- Révélation lettre par lettre des prénoms
- Particules dorées en toile de fond (canvas)
- Compte à rebours jusqu'à la soirée
- Carte Google Maps optionnelle
- Export PDF de l'invitation
- 100 % responsive — optimisé mobile

---

## Démarrage rapide

```bash
git clone https://github.com/AhmedBassoul1/Henna-Day.git
cd Henna-Day
# Ouvrir index.html dans un navigateur — aucun serveur requis
```

---

## Personnalisation

Toute la configuration se fait dans **`config.js`** :

```js
const brideName      = "Safae";
const groomName      = "Moulay Ahmed";
const weddingDate    = "2026-10-17T16:00:00"; // pour le compte à rebours
const weddingDateLabel = "17 Octobre 2026";
const weddingLocation  = "Gzenaya, Tanger";

const eventTitle     = "Henna Day";
const eventSubtitle  = "Soirée de Henné";
const eventTimeLabel = "16H00";
const monogram       = "S & A";          // signature pied de page (laisser "" pour initiales auto)
const coupleImage    = "photo/photo-transparent.png";
const invitationNote = "Votre présence illuminera notre soirée…";

const mapUrl = "";  // URL Google Maps embed — laisser "" pour masquer
```

Remplacez `photo/photo-transparent.png` par votre propre photo (fond retiré recommandé).

---

## Structure du projet

```
Henna-Day/
├── index.html          # Page principale
├── style.css           # Thème olive & doré, animations
├── script.js           # Logique : enveloppe, compte à rebours, particules, PDF
├── config.js           # ← seul fichier à modifier
├── photo/
│   ├── photo.png              # Photo originale
│   └── photo-transparent.png  # Photo détourée (fond supprimé)
└── .gitignore          # Exclut les PDF générés
```

---

## Hébergement

Le site est statique — déposez les fichiers sur n'importe quel hébergeur :

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
| Polices | Google Fonts — Cormorant Garamond, Dancing Script, Amiri |
| PDF | Généré côté client via `window.print()` |

---

## Licence

Usage personnel — invitation privée pour Safae & Moulay Ahmed · Octobre 2026.
