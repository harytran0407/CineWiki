import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdbService';
import { AIService } from '../services/aiService';

// Simple in-memory cache for movie awards (keyed by movieId)
const awardsCache = new Map<number, { name: string; category: string; year: number }[]>();

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

const KNOWN_MOVIE_MAJOR_WON_AWARDS: Record<number, { name: string; category: string; year: number }[]> = {
  27205: [ // Inception (2010) - 4 Oscars & 3 BAFTAs
    { name: 'Oscar (Viện Hàn lâm)', category: 'Quay phim xuất sắc nhất (Best Cinematography)', year: 2011 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Kỹ xảo hình ảnh xuất sắc nhất (Best Visual Effects)', year: 2011 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Biên tập âm thanh xuất sắc nhất (Best Sound Editing)', year: 2011 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Hòa âm xuất sắc nhất (Best Sound Mixing)', year: 2011 },
    { name: 'Giải BAFTA', category: 'Thiết kế sản xuất xuất sắc nhất', year: 2011 },
    { name: 'Giải BAFTA', category: 'Âm thanh xuất sắc nhất', year: 2011 },
    { name: 'Giải BAFTA', category: 'Kỹ xảo hình ảnh xuất sắc nhất', year: 2011 }
  ],
  155: [ // The Dark Knight (2008)
    { name: 'Oscar (Viện Hàn lâm)', category: 'Nam diễn viên phụ xuất sắc nhất (Heath Ledger)', year: 2009 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Biên tập âm thanh xuất sắc nhất', year: 2009 },
    { name: 'Quả Cầu Vàng', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2009 }
  ],
  238: [ // The Godfather (1972)
    { name: 'Oscar (Viện Hàn lâm)', category: 'Phim hay nhất (Best Picture)', year: 1973 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Nam diễn viên chính xuất sắc nhất (Marlon Brando)', year: 1973 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Kịch bản chuyển thể xuất sắc nhất', year: 1973 }
  ],
  240: [ // The Godfather Part II (1974)
    { name: 'Oscar (Viện Hàn lâm)', category: 'Phim hay nhất (Best Picture)', year: 1975 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Đạo diễn xuất sắc nhất (Francis Ford Coppola)', year: 1975 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Nam diễn viên phụ xuất sắc nhất (Robert De Niro)', year: 1975 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Kịch bản chuyển thể xuất sắc nhất', year: 1975 }
  ],
  424: [ // Schindler's List (1993)
    { name: 'Oscar (Viện Hàn lâm)', category: 'Phim hay nhất (Best Picture)', year: 1994 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Đạo diễn xuất sắc nhất (Steven Spielberg)', year: 1994 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Kịch bản chuyển thể xuất sắc nhất', year: 1994 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Quay phim xuất sắc nhất', year: 1994 }
  ],
  872585: [ // Oppenheimer (2023)
    { name: 'Oscar (Viện Hàn lâm)', category: 'Phim hay nhất (Best Picture)', year: 2024 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Đạo diễn xuất sắc nhất (Christopher Nolan)', year: 2024 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Nam diễn viên chính xuất sắc nhất (Cillian Murphy)', year: 2024 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Nam diễn viên phụ xuất sắc nhất (Robert Downey Jr.)', year: 2024 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Quay phim xuất sắc nhất', year: 2024 }
  ],
  496243: [ // Parasite (2019)
    { name: 'Oscar (Viện Hàn lâm)', category: 'Phim hay nhất (Best Picture)', year: 2020 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Đạo diễn xuất sắc nhất (Bong Joon-ho)', year: 2020 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Kịch bản gốc xuất sắc nhất', year: 2020 },
    { name: 'Oscar (Viện Hàn lâm)', category: 'Phim quốc tế xuất sắc nhất', year: 2020 }
  ]
};

export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lang = (req.query.lang as string) || 'vi-VN';

    const movie = await TMDBService.getMovieDetails(id, lang);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    let awards = KNOWN_MOVIE_MAJOR_WON_AWARDS[id] || awardsCache.get(id);
    if (!awards) {
      try {
        const rawAiAwards = await Promise.race([
          AIService.getMovieAwards(movie.title, movie.release_date),
          new Promise<{ name: string; category: string; year: number }[]>((resolve) =>
            setTimeout(() => resolve([]), 8000)
          )
        ]);
        awards = rawAiAwards;
        if (awards.length > 0) {
          awardsCache.set(id, awards);
        }
      } catch {
        awards = [];
      }
    }

    return res.json({ success: true, data: { ...movie, awards: awards || [] } });
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
    const q = (req.query.q as string) || (req.query.query as string) || '';
    const genre = (req.query.genre as string) || 'all';
    const country = (req.query.country as string) || 'all';
    const yearFrom = req.query.yearFrom ? parseInt(req.query.yearFrom as string, 10) : 1950;
    const yearTo = req.query.yearTo ? parseInt(req.query.yearTo as string, 10) : 2026;
    const minRating = parseFloat(req.query.minRating as string) || 0;
    const sort = (req.query.sort as string) || 'popularity';
    const page = parseInt(req.query.page as string, 10) || 1;
    const language = (req.query.lang as string) || 'vi-VN';

    const result = await TMDBService.filterMovies({
      q,
      genre,
      country,
      yearFrom,
      yearTo,
      minRating,
      sort,
      page,
      language
    });
    return res.json({ success: true, ...result });
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
