# CineWiki — Next-Gen Movie & Actor Knowledge Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20TypeScript-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TMDB API](https://img.shields.io/badge/Data%20Source-TMDB%20REST%20API%20v3-01B4E4?logo=themoviedb&logoColor=white)](https://www.themoviedb.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Assistant-Google%20Gemini%203.6%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Serverless%20%26%20Crons-000000?logo=vercel&logoColor=white)](https://vercel.com/)

CineWiki is a full-stack cinema encyclopedia and actor discovery monorepo application. Built for speed, visual excellence, and zero-friction user experience, CineWiki features live TMDB API data synchronization, real-time actor co-star network graphs, Bayesian rating algorithms, a RAG-enhanced AI chatbot powered by Google Gemini 3.6 Flash, Vercel Serverless Functions & Crons, and complete bilingual support.

---

## Key Features

### 1. Celebs & Dynamic Person Discovery
- **Celebs Navigation & Role Dropdown:** Navigation tab named "Celebs" across English and Vietnamese interfaces with a role dropdown menu supporting *All Roles*, *Actors*, *Directors*, and *Writers*.
- **Country-Aware Dynamic Discovery:** Deep dynamic TMDB discovery for Vietnam (`VN`), South Korea (`KR`), Japan (`JP`), China (`CN`), United States (`US`), United Kingdom (`GB`), France (`FR`), and Thailand (`TH`). Automatically queries country-specific filmography to discover regional directors, writers, and performers.
- **Accurate Nationality Inference:** Advanced place-of-birth matching covering all 63 Vietnamese provinces, South Korean cities, and international territories. Prevents co-production credits from incorrectly assigning foreign nationalities to actors.
- **Non-Performance "Self" Credit Filtering:** Automatically filters out documentary, talk-show, and archival appearances (*Self*, *Himself*, *Herself*, *Guest*, *Interviewee*, *Archive Footage*) from actor role classifications and career filmographies.
- **Popularity-Based Sorting:** Enforces real-time descending TMDB popularity score sorting (`b.popularity - a.popularity`) across all filter combinations.

### 2. Bayesian IMDb Rating Algorithm for Movies
- **IMDb Top 250 Bayesian Estimate Formula:** Implements the official weighted rating formula:
  `WR = (v / (v + m)) * R + (m / (v + m)) * C`
  where `v` is vote count, `m` is minimum vote threshold (2,500 for global, 250 for regional), `R` is average rating, and `C = 6.9` is the dataset mean.
- **True Quality Ranking:** Directly ranks movies by Weighted Rating (`WR`), ensuring legendary cinema classics (*The Shawshank Redemption*, *The Godfather*, *The Dark Knight*) occupy top rankings while filtering out unreleased or low-vote niche titles.

### 3. Advanced Multi-Filter & Search
- **Multi-Parameter Filtering:** Filter movies by keyword, genre, origin country, release year, minimum rating, and sorting criteria.
- **Compact Search Bar:** Streamlined search bar with an amber icon button and responsive live search suggestions.
- **Smart Ellipsis Pagination:** Compact pagination bar (`1 2 3 ... 50`) rendering 20 items per page with real-time item count metrics.

### 4. Interactive Actor & Movie Detail Pages
- **Role-Tailored Biographies:** Custom biography generation for Directors, Writers, and Actors highlighting career milestones, box office totals, and landmark works.
- **Clean Character Names:** Displays character names directly in filmographies without redundant role labels.
- **Co-Star Force-Directed Graph:** Interactive co-star network graph built on Canvas with dynamic radius calculation, node scaling, and orientation resize handlers.

### 5. CineBot AI Assistant (Google Gemini 3.6 Flash)
- **RAG Context Integration:** Retrieval-Augmented Generation feeds live TMDB overview, cast, release dates, and ratings into Gemini's system prompt to eliminate AI hallucinations.
- **SSE Streaming & Responsive UI:** Streamed response generation via Server-Sent Events (`/api/ai/chat/stream`) with viewport auto-scaling for mobile devices.

### 6. Multi-Dimensional Comparison & Monorepo Architecture
- **Movie & Actor Pickers:** Side-by-side comparison tables covering ratings, box office, budget, release date, runtime, director, studio, acting style, and landmark films.
- **Vercel Serverless Functions & Crons:** Monorepo serverless entry point (`api/index.ts`) with scheduled notifications powered by Vercel Cron Jobs (`GET /api/cron/notifications`).
- **Complete Bilingual Support:** Instant language toggle for English (`EN`) and Vietnamese (`VI`).

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
- **API Integration:** TMDB REST API v3 & Google Gemini REST API (`v1beta`)
- **Serverless Architecture:** Vercel Functions (`api/index.ts`) & Vercel Cron Jobs (`vercel.json`)
- **HTTP Client:** Axios

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **TMDB API Key**: Free API key from [The Movie Database](https://www.themoviedb.org/settings/api)
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Setup
Create `.env` and `server/.env` files using the template below:
```env
PORT=5000
TMDB_API_KEY=your_tmdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Locally

#### Install Dependencies & Start Dev Servers Concurrently
```bash
# Root directory
npm install
npm run dev
```

#### Build Production Bundle
```bash
# Build Client
cd client && npm run build

# Build Server
cd server && npm run build
```

---

## License & Acknowledgments

- Built for film lovers and cinephiles worldwide.
- Movie and actor data provided by [TMDB](https://www.themoviedb.org/).
- AI capabilities powered by [Google Gemini](https://ai.google.dev/).
