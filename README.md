# 🎲Dungeon crawler card & dice game
A single player rogue like inspired by DnD 5th edition. It uses an API to fetch game data and is built using TypeScript, SCSS and Vite.

## Features
### ✅Completed

* Character creation
    * Race
    * Class
    * Ability score
    * Starting equipment

### 🤸In progress

* Monster cards
* Equipment cards

### 🗓️Planned

* Dice rolls
* Spells
* Magic item cards
* Room cards
  * Encounters
    * Monsters
    * NPC's
  * Events
  * Looting opportunities 
* Condition markers

## 💿Installation
### 1. Clone the repository
```sh
git clone repo clone harrychichon/Oops-All-Dragons
cd Oops-All-Dragons
```
### 2. Install dependencies
```sh
npm install
```
### 3. Run developer server
```sh
npm run dev
```
### 4. Build
```sh
npm run build
```
### 5. Run locally
```sh
npm run preview
```
## ⛩️Project architecture
```
📦 Oops-All-Dragons
 ┣ 📂 src
 ┃ ┣ 📂 core          # Core of the app
 ┃ ┃ ┣ 📂 api         # API related features
 ┃ ┃ ┣ 📂 utils       # All utilities
 ┃ ┣ 📂 feature       # Feature-baserad struktur
 ┃ ┃ ┣ 📂 cards       # TS and SCSS related to cards
 ┃ ┃ ┣ 📂 character   # TS and SCSS related to the character
 ┃ ┃ ┣ 📂 combat      # TS and SCSS related to combat
 ┃ ┣ 📂 state         # TS related to state
 ┃ ┣ 📂 styles        # Variables and mixins
 ┃ ┣ 📜 main.ts       # Main app TS
 ┃ ┗ 📜 style.scss    # Main app SCSS
 ┣ 📜 package.json    # Dependencies and scripts
 ┣ 📜 index.html      # Base HTML
 ┗ 📜 README.md       # Documentation
```
## 🕸️API and URL's
The project uses the DnD 5th Edition api (https://www.dnd5eapi.co/) and fetches from these URL's:
**Races:** https://www.dnd5eapi.co/api/races
**Classes:** https://www.dnd5eapi.co/api/classes
**Equipment:** https://www.dnd5eapi.co/api/equipment
**Monsters:** https://www.dnd5eapi.co/api/monsters

## 🕸️Techstack and concepts
- **TypeScript**
- **SCSS**
- **Vite**
- **Fetch API**
- **Feature first architecture**

## 🔗Contact
[LinkedIn](https://www.linkedin.com/in/harry-chichon/)

