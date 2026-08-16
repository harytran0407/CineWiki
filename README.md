# 🎬 CineWiki — Next-Gen Movie & Actor Knowledge Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20TailwindCSS-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20TypeScript-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TMDB API](https://img.shields.io/badge/Data%20Source-TMDB%20REST%20API%20v3-01B4E4?logo=themoviedb&logoColor=white)](https://www.themoviedb.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Assistant-Google%20Gemini%20RAG-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Serverless%20%26%20Crons-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**CineWiki** is a modern, full-stack movie and actor encyclopedia web application built for speed and visual elegance. Features live TMDB synchronization, real-time actor co-star network graphs, an interactive RAG-enhanced AI chatbot powered by Google Gemini, Vercel Serverless Functions, and an instant anonymous demo-user experience (no login required).

---

## Key Features

### 1. Advanced Multi-Filter & Live Search
- **Multi-Param Filtering:** Search by keyword, genre, country of origin (`VN`, `US`, `KR`, `JP`, `CN`, `GB`, `FR`, `TH`), release year, minimum rating, and sorting criteria.
- **Smart Ellipsis Pagination:** Responsive, compact pagination bar (`1 2 3 ... 50`) rendering 20 items per page with real-time item counts.
- **Instant Search Suggestions:** Real-time dropdown overlay in navigation and search pages showing instant TMDB title matches as you type.

### 2. Authentic TMDB Ratings & Verified Data
- **TMDB Data Accuracy:** Direct integration with TMDB REST API v3 for ratings, vote counts, production companies, budget, revenue, trailer videos, and cast lists.
- **No Fabricated Fallbacks:** Missing fields display clean `"Chưa có dữ liệu"` labels rather than invented score multipliers or placeholder strings.

### 3. CineBot RAG AI Assistant (Google Gemini)
- RAG (Retrieval-Augmented Generation) context injection automatically feeds real TMDB overview, cast, release dates, and ratings into the system prompt when chatting about specific movies or actors, eliminating AI hallucinations.
- Real-time response streaming and follow-up question suggestions.
- Clear error handling when AI providers are unavailable.

### 4. Co-Star Network Graph
- Dynamically fetches co-star relationships from TMDB credit APIs (`/person/{id}/movie_credits` and `/movie/{id}/credits`) to map genuine co-starring networks for any actor.

### 5. Serverless & Anonymous Demo-User Flow
- Zero authentication barrier: users interact instantly with follow and notification features backed by an anonymous client ID (`"demo-user"`).
- Background notifications powered by Vercel Cron Jobs (`vercel.json` `crons` triggering `/api/cron/notifications`).

### 6. Internationalization (English & Vietnamese)
- Single-click language toggle across the entire application with dynamic title resolution (official English vs. Vietnamese titles).

---

## Technology Stack

### Frontend
- **Framework:** React 18 with Vite & TypeScript (`client/src/vite-env.d.ts`)
- **Styling:** Vanilla CSS & TailwindCSS (Dark Mode Glassmorphism Theme)
- **Icons:** Lucide React
- **Internationalization:** i18next & react-i18next
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js with Express & TypeScript
- **API Integration:** TMDB REST API v3 & Google Gemini API
- **Serverless Architecture:** Vercel Functions (`api/index.ts`) & Vercel Cron Jobs
- **HTTP Client:** Axios

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **TMDB API Key**: Free API key from [The Movie Database](https://www.themoviedb.org/settings/api)
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/) (starts with `AIzaSy...`)

### 2. Environment Setup
Create `.env` files in root and `server/` using the template below:
```env
PORT=5000
TMDB_API_KEY=your_tmdb_api_key_here
GEMINI_API_KEY=AIzaSy_your_gemini_api_key_here
```

### 3. Run Locally

#### Install Dependencies & Start Client & Server concurrently
```bash
# Root directory
npm install
npm run dev
```

Or build client for production:
```bash
cd client
npm run build
```

---

## License & Acknowledgments

- Built for film lovers and cinephiles worldwide.
- Movie and actor data provided by [TMDB](https://www.themoviedb.org/).
- AI capabilities powered by [Google Gemini](https://ai.google.dev/).
