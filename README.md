# 🎬 CineWiki — Next-Gen Movie & Actor Knowledge Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20TypeScript-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TMDB API](https://img.shields.io/badge/Data%20Source-TMDB%20REST%20API%20v3-01B4E4?logo=themoviedb&logoColor=white)](https://www.themoviedb.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Assistant-Google%20Gemini%203.6%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Serverless%20%26%20Crons-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**CineWiki** is a modern, full-stack movie and actor encyclopedia monorepo application. Built for speed, visual excellence, and zero-friction user experience, CineWiki features live TMDB data synchronization, real-time actor co-star network graphs, a RAG-enhanced AI chatbot powered by Google Gemini 3.6 Flash, Vercel Serverless Functions & Vercel Crons, and an instant anonymous demo-user experience (no login required).

---

## 🌟 Key Features

### 1. 🔍 Advanced Multi-Filter & Live Search
- **Multi-Parameter Filtering:** Search by keyword, genre, origin country (`VN`, `US`, `KR`, `JP`, `CN`, `GB`, `FR`, `TH`), release year, minimum rating, and sorting criteria.
- **Smart Ellipsis Pagination:** Responsive, compact pagination bar (`1 2 3 ... 50`) rendering 20 items per page with real-time item count metrics.
- **Instant Search Suggestions:** Real-time dropdown overlay in navigation and search pages showing instant TMDB title matches as you type.

### 2. 🍿 Detailed Movie & Actor Pages
- **Distinct Metadata Cards:** Independent, clearly styled cards for Release Date (`Thời điểm phát hành` / `Release Date`) with calendar icons and Runtime (`Thời lượng phim` / `Runtime`) with clock icons.
- **Authentic TMDB Ratings & Financials:** Direct integration with TMDB REST API v3 for ratings, vote counts, budget, revenue, trailer videos, and cast lists. Missing fields display clean `"Chưa có dữ liệu"` / `"N/A"` labels without fabricated data.
- **Co-Star Network Graph:** Dynamically fetches co-star relationships from TMDB credit APIs (`/person/{id}/movie_credits` and `/movie/{id}/credits`) to map interactive force-directed co-star networks for any actor.

### 3. 🤖 CineBot AI Assistant (Google Gemini 3.6 Flash)
- **RAG Context Integration:** Retrieval-Augmented Generation automatically feeds live TMDB overview, cast, release dates, and ratings into Gemini's system prompt when chatting about specific movies or actors, eliminating AI hallucinations.
- **Powered by Gemini 3.6 Flash:** Uses Google's latest active Gemini models (`gemini-3.6-flash`, `gemini-3.1-flash-lite`) with SSE streaming support (`/api/ai/chat/stream`) and automatic follow-up question suggestions.
- **Interactive Awards Discovery:** High-visibility CineBot AI CTA banners guide users to ask CineBot for in-depth film and actor award histories.

### 4. ⚔️ Multi-Dimensional Movie & Actor Comparison
- **Movie & Actor Pickers:** Side-by-side comparison with instant live search and quick suggestion cards.
- **Bilingual Comparison Tables:** Comprehensive criteria breakdown including IMDb ratings, total box office, production budget, release date, runtime, director, studio, acting style, and landmark works.

### 5. ⚡ Serverless Monorepo Architecture & Vercel Crons
- **Zero Authentication Barrier:** Instant anonymous demo-user flow (`"demo-user"` ID) for follow and notification features.
- **Vercel Functions & Crons:** Monorepo serverless entry point (`api/index.ts`) with scheduled notifications powered by Vercel Cron Jobs (`GET /api/cron/notifications`).
- **Clean TypeScript Build:** Includes `client/src/vite-env.d.ts` for clean zero-error production builds (`tsc && vite build`).

### 6. 🌐 Complete Bilingual Support (English & Vietnamese)
- Single-click language toggle across all pages, navigation header, compare pickers, tables, and AI chatbot interface.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite & TypeScript (`client/src/vite-env.d.ts`)
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

## 🚀 Getting Started

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

## 📄 License & Acknowledgments

- Built for film lovers and cinephiles worldwide.
- Movie and actor data provided by [TMDB](https://www.themoviedb.org/).
- AI capabilities powered by [Google Gemini](https://ai.google.dev/).
