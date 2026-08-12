# 🎬 CineWiki — Next-Gen Movie & Actor Knowledge Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20TailwindCSS-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20TypeScript-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TMDB API](https://img.shields.io/badge/Data%20Source-TMDB%20%26%20OMDb%20API-01B4E4?logo=themoviedb&logoColor=white)](https://www.themoviedb.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Assistant-Google%20Gemini%202.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CineWiki** is a state-of-the-art, full-stack movie and actor encyclopedia web application. Built with a modern responsive UI, live TMDB/OMDb data synchronization, an intelligent multi-filter search engine, real-time IMDb rating integration, and an interactive AI chatbot powered by Google Gemini.

---

## Live Demo & Preview

> **Live Demo Link:** `https://cine-wiki-v1.vercel.app/`


## Key Features

### 1. Advanced Multi-Filter & Unified Search Engine
- **Combined Filter Querying:** Search by keyword (`q`), genre, country of origin (`VN`, `US`, `KR`, `JP`, `CN`, `GB`, `FR`, `TH`), release year range, minimum rating, and sorting options simultaneously.
- **Smart Ellipsis Pagination:** Responsive, compact pagination bar (`1 2 3 ... 50`) rendering 20 items per page with real-time item counters.
- **Instant Live Search Suggestions:** Real-time overlay dropdown in both the navigation bar and the main search page showing instant movie matches as you type.

###  2. Synchronized Real IMDb Ratings & Quality Control (QC)
- **OMDb Gateway Integration:** Fetches verified, accurate IMDb scores and vote counts directly from IMDb's public API gateway.
- **Bayesian Weighted Rating ($WR$):** Implements the Bayesian formula to prevent single-vote spam ratings from inflating overall rankings:
  $$WR = \frac{v}{v + m} R + \frac{m}{v + m} C$$
- **Spam & Future Content Moderation:** Filters out adult content, missing metadata, low-vote documentaries, and unreleased future titles from all-time top rating rankings.

###  3. CineBot AI Assistant (Google Gemini 2.5)
- Interactive, floating AI chatbot providing personalized movie recommendations, plot summaries, trivia, and comparative insights in natural language.
- Multi-turn conversation capability with context-aware responses tailored to CineWiki's database.

###  4. Bilingual Support (English & Vietnamese)
- Full internationalization (`i18n`) support with single-click language toggle across the entire application.
- Dynamic movie title resolution: displays official English titles (*Dune: Part Two*, *Oppenheimer*) in English mode and Vietnamese titles (*Hành Tinh Cát: Phần Hai*, *Oppenheimer*) in Vietnamese mode.

###  5. Detailed Movie & Actor Pages
- **Movie Details:** Complete metadata including official box office revenue, production budgets, directors, writers, full cast list, high-definition trailer video embeds, and verified **Won Awards** filters (excluding unawarded nominations).
- **Actor Profiles:** Full filmography timelines, career milestones, total estimated box office revenue, biography, and award achievements.
- **Comparison Engine:** Side-by-side movie comparison (box office, budget, ratings, runtime) and actor comparison tools with radar statistics.
- **Actor Network Graph:** Visual network graph mapping actor co-starring relationships across blockbuster films.

---

## Technology Stack

### Frontend
- **Framework:** React 18 with Vite & TypeScript
- **Styling:** Vanilla CSS & TailwindCSS (Dark Mode Glassmorphism Theme)
- **Icons:** Lucide React
- **Internationalization:** i18next & react-i18next
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js with Express & TypeScript
- **API Integrations:** 
  - The Movie Database (TMDB) REST API v3
  - OMDb API Gateway (Real IMDb Ratings)
  - Google Gemini 2.5 API (`@google/genai`)
- **Background Jobs:** Node-Cron (automated periodic idol updates)
- **HTTP Client:** Axios with custom retry & fallback handlers

---


## Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **TMDB API Key**: Free API key from [The Movie Database](https://www.themoviedb.org/settings/api)
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CineWiki.git
cd CineWiki
```

### 2. Environment Setup
Create a `.env` file in the root directory (or inside `server/`):
```env
PORT=5000
TMDB_API_KEY=your_tmdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 4. Run Development Servers

#### Start Backend Server
```bash
cd server
npm run dev
```
*(Server will start on `http://localhost:5000`)*

#### Start Frontend Client
```bash
cd client
npm run dev
```
*(Client application will be accessible at `http://localhost:5173`)*

---

## Author & Acknowledgments

- Built with love for movie enthusiasts & cinephiles.
- Data provided by [TMDB](https://www.themoviedb.org/) & [OMDb API](https://www.omdbapi.com/).
- AI capabilities powered by [Google Gemini](https://ai.google.dev/).
