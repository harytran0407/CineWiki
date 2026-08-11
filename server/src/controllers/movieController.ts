import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdbService';

export const getTrendingMovies = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'vi-VN';
    const page = parseInt(req.query.page as string, 10) || 1;
    const result = await TMDBService.getTrendingMovies(lang, page);
    return res.json({ success: true, data: result.movies, page: result.page, total_pages: result.total_pages });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getUpcomingMovies = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'vi-VN';
    const page = parseInt(req.query.page as string, 10) || 1;
    const result = await TMDBService.getUpcomingMovies(lang, page);
    return res.json({ success: true, data: result.movies, page: result.page, total_pages: result.total_pages });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lang = (req.query.lang as string) || 'vi-VN';
    const movie = await TMDBService.getMovieDetails(id, lang);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    return res.json({ success: true, data: movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const searchAll = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const lang = (req.query.lang as string) || 'vi-VN';
    if (!query) {
      return res.json({ success: true, data: { movies: [], actors: [] } });
    }

    const results = await TMDBService.searchAll(query, lang);
    return res.json({ success: true, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const filterMovies = async (req: Request, res: Response) => {
  try {
    const genre = (req.query.genre as string) || 'all';
    const yearFrom = parseInt(req.query.yearFrom as string, 10) || 1980;
    const yearTo = parseInt(req.query.yearTo as string, 10) || 2026;
    const minRating = parseFloat(req.query.minRating as string) || 0;
    const sort = (req.query.sort as string) || 'rating';

    const movies = await TMDBService.filterMovies(genre, yearFrom, yearTo, minRating, sort);
    return res.json({ success: true, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const compareMovies = async (req: Request, res: Response) => {
  try {
    const movieAId = parseInt(req.query.a as string, 10) || 872585;
    const movieBId = parseInt(req.query.b as string, 10) || 157336;
    const lang = (req.query.lang as string) || 'vi-VN';

    const comparison = await TMDBService.compareMovies(movieAId, movieBId, lang);
    if (!comparison) {
      return res.status(404).json({ success: false, message: 'Movie comparison data unavailable' });
    }

    return res.json({ success: true, data: comparison });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};
