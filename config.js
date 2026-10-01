// ============================================
//  CONFIGURATION — Modifiez ces valeurs
// ============================================

// ---- Les mariés ----
const brideName = "Safae";
const groomName = "Moulay Ahmed";

// Monogramme / signature (pied de page + PDF) — indépendant des prénoms affichés
// Laisser "" pour générer automatiquement les initiales.
const monogram = "S & A";

// ---- L'événement ----
const eventTitle = "Henna Day"; // Titre doré de la carte
const eventSubtitle = "Soirée de Henné";

const weddingDate = "2026-10-17T16:00:00"; // Format ISO — sert au compte à rebours
const weddingDateLabel = "17 Octobre 2026"; // Date affichée
const eventTimeLabel = "16H00";
const weddingLocation = "gzenaya, Tanger";

const basmala = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const invitationNote =
  "Votre présence illuminera notre soirée — nous serions honorés de partager ce moment avec vous.";

// ---- Ressources (dossier Data/) ----
const dataFolder = "Data";

// Illustration du couple — photo-transparent.png = photo.png détourée (fond retiré)
const coupleImage = `${dataFolder}/photo-transparent.png`;

// Musique lancée à l'ouverture de l'enveloppe ("" pour désactiver le son)
const musicFile = `${dataFolder}/music.mp3`;
const musicVolume = 0.55; // volume final, de 0 à 1
const musicFadeIn = 2500; // durée du fondu d'entrée, en millisecondes

// ---- Optionnel ----
// Carte Google Maps (laisser "" pour masquer la section)
const mapUrl = "";
