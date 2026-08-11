import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import { getTrendingMovies, getUpcomingMovies, getMovieDetails, searchAll, filterMovies, compareMovies } from './controllers/movieController';
import { getPopularActors, getActorDetails, compareActors, getActorNetworkGraph, translateText, enrichActorInsight, chatWithAIController } from './controllers/actorController';
import { getFollows, toggleFollowActor, getNotifications, markNotificationRead, loginOrRegister } from './controllers/userController';
import { CronService } from './services/cronService';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// API Routes
// Movies
app.get('/api/movies/trending', getTrendingMovies);
app.get('/api/movies/upcoming', getUpcomingMovies);
app.get('/api/movies/search', searchAll);
app.get('/api/movies/filter', filterMovies);
app.get('/api/movies/compare', compareMovies);
app.get('/api/movies/:id', getMovieDetails);

// Actors & Analysis
app.get('/api/actors/popular', getPopularActors);
app.get('/api/actors/compare', compareActors);
app.get('/api/actors/network', getActorNetworkGraph);
app.get('/api/actors/:id', getActorDetails);
app.post('/api/ai/translate', translateText);
app.post('/api/ai/enrich-actor', enrichActorInsight);
app.post('/api/ai/chat', chatWithAIController);

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CineWiki Express Proxy Server listening on http://0.0.0.0:${PORT}`);
});
