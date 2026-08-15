import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import { getTrendingMovies, getUpcomingMovies, getMovieDetails, searchAll, filterMovies, compareMovies, getUniverseContent } from './controllers/movieController';
import { getPopularActors, getActorDetails, compareActors, getActorNetworkGraph, translateText, enrichActorInsight, chatWithAIController } from './controllers/actorController';
import { getFollows, toggleFollowActor, getNotifications, markNotificationRead, loginOrRegister } from './controllers/userController';
import { CronService } from './services/cronService';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// Simple in-memory rate limiter for AI routes (max 30 requests per minute per IP)
const aiRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const aiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const limit = aiRateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    aiRateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return next();
  }

  if (limit.count >= 30) {
    return res.status(429).json({ success: false, message: 'Quá nhiều yêu cầu AI, vui lòng thử lại sau ít phút.' });
  }

  limit.count++;
  next();
};

// API Routes
// Movies
app.get('/api/movies/trending', getTrendingMovies);
app.get('/api/movies/upcoming', getUpcomingMovies);
app.get('/api/movies/search', searchAll);
app.get('/api/movies/filter', filterMovies);
app.get('/api/movies/compare', compareMovies);
app.get('/api/universes/:universeId', getUniverseContent);
app.get('/api/movies/:id', getMovieDetails);

// Actors & Analysis
app.get('/api/actors/popular', getPopularActors);
app.get('/api/actors/compare', compareActors);
app.get('/api/actors/network', getActorNetworkGraph);
app.get('/api/actors/:id', getActorDetails);
app.post('/api/ai/translate', aiRateLimiter, translateText);
app.post('/api/ai/enrich-actor', aiRateLimiter, enrichActorInsight);
app.post('/api/ai/chat', aiRateLimiter, chatWithAIController);

// User, Follows & Notifications
app.get('/api/user/follows', getFollows);
app.post('/api/user/follow', toggleFollowActor);
app.get('/api/user/notifications', getNotifications);
app.get('/api/notifications', getNotifications); // Route alias
app.post('/api/user/notifications/read', markNotificationRead);
app.post('/api/notifications/read', markNotificationRead); // Route alias
app.post('/api/auth/login', loginOrRegister);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CineWiki Proxy Backend', time: new Date().toISOString() });
});

// Initialize Background Cron Engine
CronService.initBackgroundJobs();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CineWiki Express Proxy Server listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;
