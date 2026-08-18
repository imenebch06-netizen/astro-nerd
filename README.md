
# 🌌 AstroSphere — Cosmic Observatory & Astrophysics

> **AstroSphere** est une plateforme web moderne dédiée à la vulgarisation scientifique, à l'astrophysique et à l'exploration cosmologique. Développée par **Imene BOUCHAREB**, l'application combine de la télémétrie scientifique, un assistant virtuel intelligent et une interface utilisateur réactive.

---

## 📑 Sommaire
- [À propos & Objectifs](#-à-propos--objectifs-du-projet)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Stack Technique](#-stack-technique)
- [Guide d'Utilisation](#-guide-dutilisation-des-modules-avancés)
- [Installation et Configuration Locale](#-installation-et-configuration-locale)
- [Déploiement](#-déploiement)
- [Auteure](#-auteure)

---

## 🎯 À propos & Objectifs du Projet

AstroSphere vise à centraliser des concepts d'astrophysique et des outils d'exploration dans un laboratoire interactif pour passionnés d'astronomie.

* **Maîtrise d'Angular Moderne** : Conception d'une application performante exploitant l'architecture basée sur les **Signals** et la nouvelle syntaxe de contrôle de flux (`@if`, `@for`).
* **Intégration Serverless & API** : Mise en place de fonctionnalités interactives avancées (Intelligence Artificielle, système de messagerie) sans infrastructure backend dédiée.
* **Vulgarisation Scientifique** : Espace éducatif centralisant la théorie, des outils de télémétrie et un laboratoire interactif.
* **Ergonomie et Accessibilité** : Expérience utilisateur personnalisée avec gestion dynamique du multilinguisme (Français/Anglais) et basculement fluide entre modes sombre et clair.

---

## ✨ Fonctionnalités Principales

* 🤖 **Astro AI Chatbot** : Assistant virtuel bilingue capable d'analyser le contexte et de répondre aux questions sur le cosmos, la physique quantique et l'astronomie.
* 📨 **Contact Station** : Formulaire de contact direct fonctionnant avec EmailJS pour la réception de messages sans serveur backend.
* 🌐 **Internationalisation (i18n)** : Changement de langue dynamique (Français / Anglais) appliqué à l'ensemble de l'interface.
* 🌓 **Gestionnaire de Thèmes** : Mode clair et mode sombre adaptés aux visuels du projet.
* 🪐 **Modules d'Exploration** : Sections *"Explore"* et *"Stargazer Lab"* pour la consultation de données cosmologiques.

---

## 🛠 Stack Technique

| Catégorie | Technologies / Frameworks |
| :--- | :--- |
| **Framework Frontend** | Angular (Signals, Standalone Components, Router) |
| **Styles & UI** | Tailwind CSS, Angular Material, Variables CSS |
| **Assistant IA** | API Groq / Gemini (Modèles LLM) |
| **Envoi d'Emails** | EmailJS SDK (Architecture Serverless) |
| **Services & Logique** | `DynamicTranslateService` (i18n), `ThemeService` |

---

## 📖 Guide d'Utilisation des Modules Avancés

### 1. Assistant Virtuel (Astro AI Chatbot)
1. Accédez à la section du chatbot via le menu principal.
2. Saisissez une question d'ordre scientifique (ex: *"Comment se forme un trou noir ?"*).
3. L'assistant analyse le prompt, maintient l'historique de la conversation et génère une réponse structurée dans la langue sélectionnée sur le site.

### 2. Station de Contact Serverless (EmailJS)
1. Ouvrez la modal **Contact Station** depuis l'en-tête ou le menu latéral.
2. Renseignez votre nom, votre adresse email et votre message.
3. Lors de la validation, le SDK EmailJS traite la requête directement depuis le navigateur, envoie les données au service EmailJS qui transfère le message à la boîte de réception de l'administrateur, puis affiche une confirmation d'envoi.

---

## 🚀 Installation et Configuration Locale

### Prérequis
* **Node.js** (version 18 ou supérieure)
* **Angular CLI** (`npm install -g @angular/cli`)

### Procédure d'installation

1. **Cloner le dépôt Git :**
   ```bash
   git clone [https://github.com/imenebch06-netizen/astro-nerd.git](https://github.com/imenebch06-netizen/astro-nerd.git)

```

2. **Accéder au dossier de l'application Angular :**
```bash
cd astro-nerd/astro-angular

```


3. **Installer les dépendances du projet :**
```bash
npm install

```


4. **Configurer les variables d'environnement locales :**
Créez le fichier `src/environments/environment.ts` et ajoutez-y vos clés d'API :
```typescript
export const environment = {
  production: false,
  groqApiKey: 'VOTRE_CLE_API_GROQ_ICI'
};

```


5. **Lancer l'application en mode développement :**
```bash
ng serve

```


Rendez-vous sur `http://localhost:4200/` dans votre navigateur.

---

## 🌐 Déploiement

Le projet est configuré pour être déployé sur des plateformes d'hébergement statique comme **Vercel** ou **Netlify**.

* **Root Directory** : Définir le sous-dossier racine sur `astro-angular`.
* **Variables d'environnement** : Ajouter la variable `GROQ_API_KEY` dans les paramètres du projet sur votre plateforme d'hébergement.

---

## 👩‍💻 Auteure

**Imene BOUCHAREB** — *Creator & Lead Developer*

```
