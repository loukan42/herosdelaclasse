# Heros de la classe

Application web enfant sous forme de “livre dont tu es le héros”

1) Contexte et objectif

L’objectif est de créer une application web destinée aux enfants, qui propose des histoires interactives. L’enfant choisit une histoire dans un tableau de bord, renseigne son prénom et éventuellement son genre, puis lit une histoire découpée en pages. À chaque page, il choisit une option qui l’emmène vers une page suivante, jusqu’à une fin.

Objectifs clés

Expérience ludique, simple, adaptée aux enfants.

Présentation visuelle “comme un vrai livre” : illustration, texte, choix clairs.

Personnalisation légère : prénom + adaptation du texte au masculin ou au féminin si l’enfant le souhaite.

2) Périmètre

Inclus

Tableau de bord des histoires avec cartes (nom, image, âge recommandé).

Écran de démarrage d’une histoire : saisie du prénom et choix du genre optionnel.

Lecture de l’histoire page par page avec navigation par choix.

Design “livre” : mise en page, illustration, texte, boutons de choix.

Gestion des redirections entre pages selon les choix.

Exclus à ce stade

Création d’histoires par l’utilisateur.

Paiement, abonnement, publicité.

Comptes utilisateurs obligatoires.

Mode hors ligne.

Génération automatique de contenu par IA.

3) Utilisateurs cibles

Enfants (lecteurs) : utilisation autonome, interface très simple.

Parents (accompagnants) : sélection d’histoires adaptées à l’âge, rassurance.

4) Parcours utilisateur
4.1 Accueil / Tableau de bord des histoires

L’utilisateur arrive sur une page listant plusieurs histoires.

Chaque histoire est présentée sous forme de carte avec :

Titre de l’histoire

Image de couverture

Âge recommandé (ex : 4-6 ans, 7-9 ans)

Bouton “Lire” ou clic sur la carte

Possibilité de filtrer ou trier (optionnel V1) :

Filtre par âge

Recherche par titre

4.2 Démarrage d’une histoire

Après avoir cliqué sur une histoire :

Page d’introduction avec :

Couverture et pitch court

Champ “Ton prénom”

Choix “Souhaites-tu que l’histoire s’adapte au féminin ou au masculin ?”

Options : Masculin, Féminin, Je ne souhaite pas le préciser

Bouton “Commencer l’histoire”

Règles de personnalisation :

Le prénom est injecté dans les textes.

Le genre, s’il est renseigné, adapte certains mots/accords dans les textes.

Si “je ne souhaite pas le préciser”, l’histoire reste neutre ou sans accords genrés.

4.3 Lecture page par page

Une page d’histoire contient :

Illustration (image)

Titre (optionnel)

Texte narratif

Liste de choix (2 à 4 boutons maximum) menant chacun vers une page suivante

Au clic sur un choix :

L’enfant est redirigé vers la page ciblée

La progression est conservée (au minimum pendant la session)

4.4 Fin d’histoire

Certaines pages sont des fins :

Fin heureuse

Fin alternative

Sur une fin :

Bouton “Recommencer cette histoire”

Bouton “Retour aux histoires”

Optionnel : “Revenir au choix précédent” si la navigation arrière est autorisée

5) Fonctionnalités détaillées
5.1 Gestion des histoires

Chaque histoire doit disposer de métadonnées :

id

titre

image de couverture

âge recommandé (minimum + maximum ou tranche)

description courte

page de départ (id de la première page)

5.2 Gestion des pages d’une histoire

Chaque page doit contenir :

id

id histoire

illustration (image)

texte (avec variables)

liste de choix :

libellé du choix

id de la page cible

type de page :

normale

fin (avec type de fin optionnel)

5.3 Personnalisation du texte

Variables

{prenom} remplace le prénom saisi

Adaptation au genre

Si genre masculin : formes masculines

Si genre féminin : formes féminines

Si non précisé : forme neutre si possible ou formulation non genrée

Exemples d’approche attendue

Éviter les formulations complexes, privilégier des phrases qui fonctionnent en neutre.

Si nécessaire, gérer des variantes de texte par genre.

5.4 Navigation et état

Au minimum, garder en mémoire :

histoire sélectionnée

prénom

genre choisi ou non

page courante

Optionnel :

historique des pages pour revenir en arrière

reprise de lecture si l’enfant ferme puis revient plus tard (localStorage)

6) Contraintes UX/UI
6.1 Direction artistique

Univers “livre illustré”

Typographie lisible, grande taille, adaptée enfant

Boutons de choix larges, contrastés, faciles à cliquer

Animations légères (optionnel) : page qui se tourne, apparition douce du texte

6.2 Mise en page type “livre”

Conteneur central comme une double-page ou page unique

Fond papier, ombre portée, bords arrondis

Illustration dominante (en haut ou à gauche)

Texte en bloc court, bien espacé

Choix en bas de page, sous forme de boutons ou étiquettes

6.3 Accessibilité

Contraste suffisant

Navigation clavier (minimum)

Compatible mobile et tablette

Lecture facile : phrases courtes, pas de surcharge d’éléments

7) Règles de contenu

Ton positif, vocabulaire simple

Pas de contenu violent, anxiogène ou inadapté

Cohérence des choix : 2 à 4 options max

Durée d’une histoire cible : 5 à 10 minutes (variable selon âge)

8) Spécifications techniques attendues
8.1 Application web

Frontend web responsive (mobile, tablette, desktop)

Routing :

/stories (dashboard)

/stories/:storyId/start (prénom + genre)

/stories/:storyId/page/:pageId (lecture)

Données :

V1 : données en JSON (fichier ou endpoint)

V2 : base de données + backoffice d’édition (hors périmètre)

8.2 Gestion des assets

Images optimisées (format web, poids réduit)

Préchargement léger pour éviter les chargements longs

8.3 Suivi qualité

Tests minimum :

navigation entre pages

injection du prénom

adaptation de texte selon genre

affichage responsive

9) Données et format de stockage (proposition)

Structure logique

Stories

storyId

title

coverImage

ageMin, ageMax

description

startPageId

Pages

pageId

storyId

image

text

choices[] : { label, targetPageId }

isEnding, endingType

Gestion des variantes de texte (si besoin)

textNeutral

textMasculine

textFeminine
Ou bien un système de tokens dans text.
11) Critères d’acceptation

Depuis le dashboard, je peux voir une liste d’histoires avec titre, image, âge

En cliquant sur une histoire, j’arrive sur un écran de démarrage

Je peux saisir un prénom et choisir masculin, féminin ou ne pas préciser

En lançant l’histoire, je vois une page avec une illustration, du texte, et des choix

Chaque choix me redirige vers la bonne page

Le prénom apparaît correctement dans les textes

Si masculin ou féminin est choisi, les textes affichés respectent le genre

L’interface est lisible et agréable sur mobile et tablette

Une page de fin propose de recommencer ou revenir au dashboard


Dans le prochain prompt je vais te fournir l'histoire avec les textes, les images et les liaisons à faire

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kidsgamebook.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f570372f-5490-4dc0-815c-f5b5f43d82d6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
