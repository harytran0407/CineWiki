import axios from 'axios';
import { Movie, Actor, ActorComparison } from '../types';
import { KNOWN_ACTORS_MAP, VIETNAMESE_ACTORS } from '../actorKnowledge';

const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Hành động',
  12: 'Phiêu lưu',
  16: 'Hoạt hình',
  35: 'Hài hước',
  80: 'Tội phạm',
  99: 'Tài liệu',
  18: 'Chính kịch',
  10751: 'Gia đình',
  14: 'Kỳ ảo',
  36: 'Lịch sử',
  27: 'Kinh dị',
  10402: 'Âm nhạc',
  9648: 'Bí ẩn',
  10749: 'Lãng mạn',
  878: 'Viễn tưởng',
  53: 'Giật gân',
  10752: 'Chiến tranh',
  37: 'Viễn tây'
};

const GENRE_NAME_TO_ID: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  sciencefiction: 878,
  thriller: 53,
  war: 10752,
  western: 37
};

const SEARCH_ALIASES: Record<string, string[]> = {
  'batman': ['Batman', 'The Dark Knight', 'Dark Knight', 'Kị Sĩ Bóng Đêm', 'Kỵ Sĩ Bóng Đêm', 'Batman Begins'],
  'dark knight': ['The Dark Knight', 'Dark Knight', 'Batman', 'Kị Sĩ Bóng Đêm', 'Kỵ Sĩ Bóng Đêm'],
  'the dark knight': ['The Dark Knight', 'Dark Knight', 'Batman', 'Kị Sĩ Bóng Đêm', 'Kỵ Sĩ Bóng Đêm'],
  'kị sĩ bóng đêm': ['The Dark Knight', 'Dark Knight', 'Batman'],
  'kỵ sĩ bóng đêm': ['The Dark Knight', 'Dark Knight', 'Batman'],
  'ky si bong dem': ['The Dark Knight', 'Dark Knight', 'Batman'],
  'ki si bong dem': ['The Dark Knight', 'Dark Knight', 'Batman'],
  'avenger': ['Avengers', 'The Avengers', 'Biệt Đội Siêu Anh Hùng'],
  'avengers': ['Avengers', 'The Avengers', 'Biệt Đội Siêu Anh Hùng'],
  'biệt đội siêu anh hùng': ['Avengers', 'The Avengers'],
  'biet doi sieu anh hung': ['Avengers', 'The Avengers'],
  'spider-man': ['Spider-Man', 'Spiderman', 'Người Nhện'],
  'spiderman': ['Spider-Man', 'Spiderman', 'Người Nhện'],
  'spider man': ['Spider-Man', 'Spiderman', 'Người Nhện'],
  'nguoi nhen': ['Spider-Man', 'Spiderman'],
  'người nhện': ['Spider-Man', 'Spiderman'],
  'iron man': ['Iron Man', 'Ironman', 'Người Sắt'],
  'ironman': ['Iron Man', 'Ironman', 'Người Sắt'],
  'nguoi sat': ['Iron Man', 'Ironman'],
  'người sắt': ['Iron Man', 'Ironman'],
  'star war': ['Star Wars', 'Chiến Tranh Giữa Các Vì Sao'],
  'star wars': ['Star Wars', 'Chiến Tranh Giữa Các Vì Sao'],
  'harry potter': ['Harry Potter'],
  'fast and furious': ['Fast & Furious', 'Fast and Furious', 'Quá Nhanh Quá Nguy Hiểm'],
  'fast & furious': ['Fast & Furious', 'Fast and Furious', 'Quá Nhanh Quá Nguy Hiểm'],
  'qua nhanh qua nguy hiem': ['Fast & Furious', 'Fast and Furious'],
  'quá nhanh quá nguy hiểm': ['Fast & Furious', 'Fast and Furious'],
  'mission impossible': ['Mission: Impossible', 'Nhiệm Vụ Bất Khả Thi'],
  'nhiem vu bat kha thi': ['Mission: Impossible'],
  'nhiệm vụ bất khả thi': ['Mission: Impossible'],
  'lord of the rings': ['The Lord of the Rings', 'Chúa Tể Những Chiếc Nhẫn'],
  'chua te nhung chiec nhan': ['The Lord of the Rings'],
  'chúa tể những chiếc nhẫn': ['The Lord of the Rings'],
  'transformers': ['Transformers', 'Robot Biến Hình'],
  'transformer': ['Transformers', 'Robot Biến Hình'],
  'x-men': ['X-Men', 'Xmen', 'Dị Nhân'],
  'xmen': ['X-Men', 'Xmen', 'Dị Nhân'],
  'jurassic': ['Jurassic World', 'Jurassic Park', 'Thế Giới Khủng Long'],
  'matrix': ['The Matrix', 'Matrix', 'Ma Trận'],
  'ma trận': ['The Matrix', 'Matrix', 'Ma Trận'],
  'ma tran': ['The Matrix', 'Matrix', 'Ma Trận']
};

function getSmartSearchQueries(rawQuery: string): string[] {
  const clean = rawQuery.trim();
  if (!clean) return [];

  const lower = clean.toLowerCase();
  const queriesSet = new Set<string>();
  queriesSet.add(clean);

  // Check direct alias map
  if (SEARCH_ALIASES[lower]) {
    SEARCH_ALIASES[lower].forEach((alias) => queriesSet.add(alias));
  }

  // Check partial keyword alias matches
  Object.keys(SEARCH_ALIASES).forEach((key) => {
    if (lower.includes(key) || key.includes(lower)) {
      SEARCH_ALIASES[key].forEach((alias) => queriesSet.add(alias));
    }
  });

  // Singular/Plural stemming expansion
  if (lower.endsWith('s') && lower.length > 3) {
    queriesSet.add(clean.slice(0, -1));
  } else if (!lower.endsWith('s') && lower.length > 2) {
    queriesSet.add(`${clean}s`);
  }

  return Array.from(queriesSet);
}

const COUNTRY_TO_LANG_MAP: Record<string, { country?: string; lang?: string }> = {
  US: { country: 'US', lang: 'en' },
  KR: { country: 'KR', lang: 'ko' },
  JP: { country: 'JP', lang: 'ja' },
  CN: { country: 'CN', lang: 'zh' },
  VN: { country: 'VN', lang: 'vi' },
  GB: { country: 'GB', lang: 'en' },
  FR: { country: 'FR', lang: 'fr' },
  TH: { country: 'TH', lang: 'th' }
};

/**
 * Unified IMDb-style score.
 *
 * minVoteCount / minVoteCountRecent are configurable because vote volume on TMDB
 * varies enormously by market: a global/US title with 300+ votes is common, but
 * a Vietnamese (or other regional) title with even 20-50 votes can already be a
 * well-known, well-reviewed release. Callers filtering by country should pass in
 * lower thresholds for non-global markets so valid regional movies aren't zeroed out.
 */
export function getUnifiedImdbScore(
  movieId: number,
  tmdbVoteAvg?: number,
  voteCount?: number,
  releaseDate?: string,
  title?: string,
  minVoteCount: number = 0,
  minVoteCountRecent: number = 0
): number {
  const todayStr = new Date().toISOString().split('T')[0];
  if (releaseDate && releaseDate > todayStr) return 0;
  if (!tmdbVoteAvg || tmdbVoteAvg <= 0) return 0;
  return Math.round(tmdbVoteAvg * 10) / 10;
}

/**
 * IMDb Top 250 Bayesian Estimate Formula for Weighted Rating (WR):
 * WR = (v / (v + m)) * R + (m / (v + m)) * C
 *
 * Where:
 *  v = number of votes for the movie (vote_count)
 *  m = minimum votes required (default m = 2500 for global top list, 250 for regional list)
 *  R = average rating for the movie (imdb_score || vote_average)
 *  C = mean vote across dataset (C = 6.9)
 */
export function calculateWeightedRating(
  voteAverage: number,
  voteCount: number,
  m: number = 2500,
  C: number = 6.9
): number {
  if (!voteAverage || voteAverage <= 0) return 0;
  if (!voteCount || voteCount <= 0) return 0;
  const wr = (voteCount / (voteCount + m)) * voteAverage + (m / (voteCount + m)) * C;
  return Math.round(wr * 100) / 100;
}

/**
 * Determines whether a movie belongs to the "global" market (English-language,
 * US-origin titles that typically accumulate large vote counts on TMDB) versus a
 * regional market (e.g. Vietnamese, Korean, Thai titles that rarely reach hundreds
 * of votes even when well-known and well-reviewed). Used to pick sensible
 * vote-count thresholds for getUnifiedImdbScore on a per-movie basis, so a movie's
 * own rating doesn't disappear just because no explicit country filter was passed
 * in (e.g. viewing a Vietnamese movie's detail page directly).
 */
function resolveVoteThresholds(m: any): { minVoteCount: number; minVoteCountRecent: number } {
  const lang = (m.original_language || 'en').toLowerCase();
  const originCountries: string[] = m.origin_country || m.production_countries?.map((c: any) => c.iso_3166_1) || [];
  const isGlobal = lang === 'en' || (Array.isArray(originCountries) && originCountries.includes('US'));
  return isGlobal
    ? { minVoteCount: 300, minVoteCountRecent: 1000 }
    : { minVoteCount: 5, minVoteCountRecent: 20 };
}

export function isValidMovie(m: any): boolean {
  if (!m) return false;
  if (!m.title && !m.original_title) return false;
  if (!m.poster_path) return false;
  if (m.adult === true) return false;
  if ((!m.vote_count || m.vote_count === 0) && (m.popularity == null || m.popularity < 0.5)) return false;
  return true;
}

function resolveGenre(genreIds?: number[]): string {
  if (genreIds && genreIds.length > 0) {
    for (const gid of genreIds) {
      if (TMDB_GENRE_MAP[gid]) return TMDB_GENRE_MAP[gid];
    }
  }
  return 'Chính kịch';
}

export function isSelfRole(character?: string): boolean {
  if (!character) return false;
  const c = character.trim().toLowerCase();
  if (c === 'self' || c === 'himself' || c === 'herself' || c === 'themselves' || c === 'bản thân') return true;
  if (c.startsWith('self ') || c.startsWith('self -') || c.startsWith('self(') || c.startsWith('self (')) return true;
  if (c.includes('himself') || c.includes('herself') || c.includes('archive footage') || c.includes('archival footage')) return true;
  if (c === 'guest' || c === 'interviewee') return true;
  return false;
}

function inferNationality(placeOfBirth?: string, defaultNat?: string, knownForMovies?: any[]): string | undefined {
  if (defaultNat) {
    const clean = defaultNat.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    if (clean && clean !== 'Quốc tế') return clean;
  }

  if (placeOfBirth && placeOfBirth !== 'International') {
    const p = placeOfBirth.toLowerCase().trim();
    const parts = placeOfBirth.split(',').map((pt) => pt.trim().toLowerCase());
    const lastPart = parts[parts.length - 1];

    // Priority 1: Check country in the LAST part of place_of_birth first!
    if (lastPart.includes('canada')) return 'Canada';
    if (lastPart.includes('vietnam') || lastPart.includes('việt nam')) return 'Việt Nam';
    if (lastPart.includes('uk') || lastPart.includes('united kingdom') || lastPart.includes('england') || lastPart.includes('scotland') || lastPart.includes('wales') || lastPart.includes('britain')) return 'Anh';
    if (lastPart.includes('korea') || lastPart.includes('rok') || lastPart.includes('south korea') || lastPart.includes('hàn quốc')) return 'Hàn Quốc';
    if (lastPart.includes('japan')) return 'Nhật Bản';
    if (lastPart.includes('china') || lastPart.includes('hong kong') || lastPart.includes('taiwan')) return 'Trung Quốc';
    if (lastPart.includes('france')) return 'Pháp';
    if (lastPart.includes('germany')) return 'Đức';
    if (lastPart.includes('italy')) return 'Ý';
    if (lastPart.includes('spain')) return 'Tây Ban Nha';
    if (lastPart.includes('australia')) return 'Úc';
    if (lastPart.includes('india')) return 'Ấn Độ';
    if (lastPart.includes('guatemala')) return 'Guatemala';
    if (lastPart.includes('ireland')) return 'Ireland';
    if (lastPart.includes('russia') || lastPart.includes('ussr')) return 'Nga';
    if (lastPart.includes('thailand')) return 'Thái Lan';
    if (lastPart.includes('usa') || lastPart.includes('united states')) return 'Mỹ';

    // Priority 2: Check full place string for specific city names
    if (p.includes('vietnam') || p.includes('việt nam') || p.includes('ho chi minh') || p.includes('hanoi') || p.includes('ha noi') || p.includes('da nang') || p.includes('saigon') || p.includes('sài gòn') || p.includes('can tho') || p.includes('nha trang') || p.includes('hai phong') || p.includes('vung tau') || p.includes('ben tre') || p.includes('tra vinh') || p.includes('hue') || p.includes('quang nam') || p.includes('binh duong') || p.includes('dong nai') || p.includes('nghe an') || p.includes('thanh hoa') || p.includes('nam dinh') || p.includes('thai binh')) return 'Việt Nam';
    if (p.includes('canada') || p.includes('toronto') || p.includes('vancouver') || p.includes('montreal') || p.includes('ontario')) return 'Canada';
    if (p.includes('uk') || p.includes('united kingdom') || p.includes('england') || p.includes('scotland') || p.includes('wales') || p.includes('britain') || p.includes('london') || p.includes('manchester') || p.includes('birmingham') || p.includes('liverpool')) return 'Anh';
    if (p.includes('korea') || p.includes('seoul') || p.includes('busan') || p.includes('daegu') || p.includes('incheon') || p.includes('gwangju') || p.includes('daejeon') || p.includes('ulsan') || p.includes('gyeonggi') || p.includes('jeju') || p.includes('gangwon') || p.includes('chungcheong') || p.includes('gyeongsang') || p.includes('jeolla') || p.includes('suwon') || p.includes('seongnam') || p.includes('goyang') || p.includes('yongin') || p.includes('changwon')) return 'Hàn Quốc';
    if (p.includes('japan') || p.includes('tokyo') || p.includes('osaka') || p.includes('kyoto') || p.includes('yokohama') || p.includes('nagoya') || p.includes('fukuoka')) return 'Nhật Bản';
    if (p.includes('china') || p.includes('hong kong') || p.includes('beijing') || p.includes('shanghai') || p.includes('taiwan') || p.includes('guangzhou')) return 'Trung Quốc';
    if (p.includes('france') || p.includes('paris') || p.includes('marseille') || p.includes('lyon')) return 'Pháp';
    if (p.includes('germany') || p.includes('berlin') || p.includes('munich') || p.includes('hamburg') || p.includes('frankfurt')) return 'Đức';
    if (p.includes('italy') || p.includes('rome') || p.includes('milan')) return 'Ý';
    if (p.includes('spain') || p.includes('madrid') || p.includes('barcelona')) return 'Tây Ban Nha';
    if (p.includes('australia') || p.includes('sydney') || p.includes('melbourne') || p.includes('perth')) return 'Úc';
    if (p.includes('india') || p.includes('mumbai') || p.includes('delhi')) return 'Ấn Độ';
    if (p.includes('ireland') || p.includes('dublin')) return 'Ireland';
    if (p.includes('russia') || p.includes('moscow') || p.includes('ussr')) return 'Nga';
    if (p.includes('usa') || p.includes('united states') || p.includes('california') || p.includes('new york') || p.includes('los angeles') || p.includes('chicago') || p.includes('texas') || p.includes('massachusetts') || p.includes('florida') || p.includes('georgia') || p.includes('illinois') || p.includes('pennsylvania') || p.includes('ohio') || p.includes('new jersey')) return 'Mỹ';

    const rawCountry = parts[parts.length - 1];
    if (rawCountry && rawCountry !== 'international' && rawCountry.length > 2) return rawCountry.charAt(0).toUpperCase() + rawCountry.slice(1);
  }

  if (knownForMovies && knownForMovies.length > 0) {
    const koCount = knownForMovies.filter((m: any) => (m.original_language || '').toLowerCase() === 'ko').length;
    const viCount = knownForMovies.filter((m: any) => (m.original_language || '').toLowerCase() === 'vi').length;
    const jaCount = knownForMovies.filter((m: any) => (m.original_language || '').toLowerCase() === 'ja').length;
    const zhCount = knownForMovies.filter((m: any) => (m.original_language || '').toLowerCase() === 'zh').length;

    if (koCount >= 2 || (koCount === 1 && knownForMovies.length === 1)) return 'Hàn Quốc';
    if (viCount >= 1) return 'Việt Nam';
    if (jaCount >= 2 || (jaCount === 1 && knownForMovies.length === 1)) return 'Nhật Bản';
    if (zhCount >= 2 || (zhCount === 1 && knownForMovies.length === 1)) return 'Trung Quốc';
  }
  return undefined;
}

export class TMDBService {
  private static getAxiosClient() {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      console.warn('[TMDB API Warning] TMDB_API_KEY environment variable is missing.');
    }
    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

    return axios.create({
      baseURL: baseUrl,
      params: { api_key: apiKey || '' },
      timeout: 10000
    });
  }

  static async getTrendingMovies(language: string = 'vi-VN', page: number = 1): Promise<{ movies: Movie[]; page: number; total_pages: number }> {
    try {
      const response = await this.getAxiosClient().get('/trending/movie/week', {
        params: { language, page }
      });
      if (response.data && response.data.results) {
        const todayStr = new Date().toISOString().split('T')[0];
        const releasedMovies = response.data.results.filter(
          (m: any) => isValidMovie(m) && (!m.release_date || m.release_date <= todayStr)
        );
        return {
          movies: releasedMovies.map((m: any) => this.mapTMDBMovie(m)),
          page: response.data.page || page,
          total_pages: Math.min(response.data.total_pages || 10, 500)
        };
      }
    } catch (err) {
      console.warn(`[TMDB API Error] /trending/movie/week failed: ${(err as Error).message}`);
    }
    return { movies: [], page: 1, total_pages: 1 };
  }

  static async getUpcomingMovies(language: string = 'vi-VN', page: number = 1): Promise<{ movies: Movie[]; page: number; total_pages: number }> {
    const PER_PAGE = 15;
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const tmdbPage1 = Math.max(1, (page - 1) * 2 + 1);
      const tmdbPage2 = tmdbPage1 + 1;

      const [res1, res2] = await Promise.all([
        this.getAxiosClient().get('/discover/movie', {
          params: {
            language,
            page: tmdbPage1,
            'primary_release_date.gte': todayStr,
            sort_by: 'popularity.desc'
          }
        }).catch(() => null),
        this.getAxiosClient().get('/discover/movie', {
          params: {
            language,
            page: tmdbPage2,
            'primary_release_date.gte': todayStr,
            sort_by: 'popularity.desc'
          }
        }).catch(() => null)
      ]);

      const raw1 = res1?.data?.results || [];
      const raw2 = res2?.data?.results || [];
      const combined = [...raw1, ...raw2];

      const seen = new Set<number>();
      const deduped = combined.filter((m: any) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });

      const qualified = deduped
        .filter((m: any) => m.release_date && m.release_date >= todayStr && m.poster_path)
        .sort((a: any, b: any) => (a.release_date || '').localeCompare(b.release_date || ''));

      const movies = qualified.slice(0, PER_PAGE).map((m: any) => this.mapTMDBMovie(m));
      const total_pages_raw = res1?.data?.total_pages || 10;
      const total_pages = Math.min(Math.ceil(total_pages_raw / 2), 100);

      return { movies, page, total_pages };
    } catch (err) {
      console.warn(`[TMDB API Error] getUpcomingMovies failed: ${(err as Error).message}`);
    }
    return { movies: [], page: 1, total_pages: 1 };
  }

  static async getMovieDetails(movieId: number, language: string = 'vi-VN'): Promise<Movie | null> {
    try {
      const response = await this.getAxiosClient().get(`/movie/${movieId}`, {
        params: {
          language,
          append_to_response: 'credits,videos,keywords,release_dates,external_ids',
          include_video_language: 'en,vi,null'
        }
      });
      if (response.data) {
        if (!response.data.videos?.results?.length) {
          try {
            const vidRes = await this.getAxiosClient().get(`/movie/${movieId}/videos`, {
              params: { language: 'en-US' }
            });
            if (vidRes.data?.results?.length) {
              response.data.videos = vidRes.data;
            }
          } catch { }
        }
        return this.mapTMDBMovieDetail(response.data);
      }
    } catch (err) {
      console.warn(`[TMDB API Error] /movie/${movieId} with lang ${language} failed: ${(err as Error).message}. Retrying with en-US...`);
      try {
        const retryResponse = await this.getAxiosClient().get(`/movie/${movieId}`, {
          params: { language: 'en-US', append_to_response: 'credits,videos,keywords,release_dates,external_ids' }
        });
        if (retryResponse.data) {
          return this.mapTMDBMovieDetail(retryResponse.data);
        }
      } catch (retryErr) {
        console.warn(`[TMDB API Error] /movie/${movieId} retry failed: ${(retryErr as Error).message}`);
      }
    }
    return null;
  }

  private static personDetailCache = new Map<number, any>();

  private static async hydrateActorDetails(personList: any[], language: string = 'vi-VN'): Promise<Actor[]> {
    const detailedPersons = await Promise.all(
      personList.map(async (p: any) => {
        if (this.personDetailCache.has(p.id)) {
          const cached = this.personDetailCache.get(p.id);
          return { ...p, ...cached };
        }
        try {
          const res = await this.getAxiosClient().get(`/person/${p.id}`, {
            params: { language }
          });
          if (res.data) {
            this.personDetailCache.set(p.id, res.data);
            return { ...p, ...res.data };
          }
        } catch (e) {
          // fallback to p
        }
        return p;
      })
    );
    return detailedPersons.map((p: any) => this.mapTMDBActor(p));
  }

  static async getPopularActors(
    language: string = 'vi-VN',
    page: number = 1,
    options: {
      countryFilter?: string;
      genderFilter?: string;
      departmentFilter?: string;
    } = {}
  ): Promise<{ actors: Actor[]; total_pages: number }> {
    try {
      const { countryFilter, genderFilter, departmentFilter } = options;
      const targetGender = genderFilter && genderFilter !== 'all' ? parseInt(genderFilter, 10) : null;
      const targetDept = departmentFilter && departmentFilter !== 'all' ? departmentFilter.toLowerCase().trim() : null;
      const targetCountry = countryFilter && countryFilter !== 'all' ? countryFilter.toLowerCase().trim() : null;

      const hasFilters = targetCountry !== null || targetGender !== null || targetDept !== null;

      // Case 1: NO Filters active -> Direct TMDB 1-to-1 page mapping (20 per page)
      if (!hasFilters) {
        const response = await this.getAxiosClient().get('/person/popular', {
          params: { language, page }
        });

        if (response.data && response.data.results) {
          const rawList = response.data.results.filter((p: any) => p.profile_path && p.profile_path.trim() !== '');
          const hydrated = await this.hydrateActorDetails(rawList, language);
          hydrated.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          return {
            actors: hydrated.slice(0, 20),
            total_pages: Math.min(500, response.data.total_pages || 20)
          };
        }
        return { actors: [], total_pages: 1 };
      }

      // Case 2: Filters active (Country, Gender, and/or Department specified)
      const pool: Actor[] = [];
      const seenIds = new Set<number>();

      // Special discovery for directors when filtering by Directing (100% Dynamic from TMDB API)
      // Special discovery for directors when filtering by Directing (100% Dynamic from TMDB API)
      if (targetDept === 'directing') {
        try {
          let discParams1: any = { language, sort_by: 'popularity.desc', page: 1 };
          let discParams2: any = { language, sort_by: 'revenue.desc', page: 1 };
          let discParams3: any = { language, sort_by: 'vote_count.desc', page: 1 };

          if (targetCountry === 'việt nam' || targetCountry === 'vn' || targetCountry === 'vietnam') {
            discParams1 = { language, with_origin_country: 'VN', sort_by: 'revenue.desc', page: 1 };
            discParams2 = { language, with_original_language: 'vi', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'VN', sort_by: 'popularity.desc', page: 1 };
          } else if (targetCountry === 'hàn quốc' || targetCountry === 'kr' || targetCountry === 'south korea' || targetCountry === 'korea') {
            discParams1 = { language, with_origin_country: 'KR', sort_by: 'revenue.desc', page: 1 };
            discParams2 = { language, with_original_language: 'ko', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'KR', sort_by: 'popularity.desc', page: 1 };
          } else if (targetCountry === 'nhật bản' || targetCountry === 'jp' || targetCountry === 'japan') {
            discParams1 = { language, with_origin_country: 'JP', sort_by: 'revenue.desc', page: 1 };
            discParams2 = { language, with_original_language: 'ja', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'JP', sort_by: 'popularity.desc', page: 1 };
          } else if (targetCountry === 'trung quốc' || targetCountry === 'cn' || targetCountry === 'china') {
            discParams1 = { language, with_origin_country: 'CN', sort_by: 'revenue.desc', page: 1 };
            discParams2 = { language, with_original_language: 'zh', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'HK', sort_by: 'popularity.desc', page: 1 };
          } else if (targetCountry === 'mỹ' || targetCountry === 'us' || targetCountry === 'usa') {
            discParams1 = { language, with_origin_country: 'US', sort_by: 'popularity.desc', page: 1 };
            discParams2 = { language, with_origin_country: 'US', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'US', sort_by: 'vote_count.desc', page: 1 };
          }

          const [popMoviesRes, revMoviesRes, voteMoviesRes] = await Promise.all([
            this.getAxiosClient().get('/discover/movie', { params: discParams1 }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: discParams2 }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: discParams3 }).catch(() => null)
          ]);

          const discoveredMovies: any[] = [];
          const movieIdsSeen = new Set<number>();

          [popMoviesRes, revMoviesRes, voteMoviesRes].forEach((r) => {
            if (r && r.data && r.data.results) {
              r.data.results.forEach((m: any) => {
                if (!movieIdsSeen.has(m.id)) {
                  movieIdsSeen.add(m.id);
                  discoveredMovies.push(m);
                }
              });
            }
          });

          if (discoveredMovies.length > 0) {
            const topMovies = discoveredMovies.slice(0, 80);
            const creditsList = await Promise.all(
              topMovies.map((m: any) =>
                this.getAxiosClient().get(`/movie/${m.id}`, { params: { language, append_to_response: 'credits' } }).catch(() => null)
              )
            );

            const dynamicDirectorRaw: any[] = [];
            for (const mRes of creditsList) {
              if (!mRes || !mRes.data || !mRes.data.credits || !mRes.data.credits.crew) continue;
              const directors = mRes.data.credits.crew.filter(
                (c: any) => (c.job || '').toLowerCase() === 'director' || (c.department || '').toLowerCase() === 'directing'
              );
              for (const dir of directors) {
                if (!dir.profile_path || dir.profile_path.trim() === '') continue;
                if (seenIds.has(dir.id)) continue;
                if (targetGender !== null && dir.gender !== targetGender) continue;
                dynamicDirectorRaw.push(dir);
              }
            }

            const hydratedDirectors = await this.hydrateActorDetails(dynamicDirectorRaw, language);
            for (const actor of hydratedDirectors) {
              if (!actor.profile_path || actor.profile_path.trim() === '') continue;
              if (seenIds.has(actor.id)) continue;
              if (targetGender !== null && actor.gender !== undefined && actor.gender !== targetGender) continue;
              if (targetCountry !== null) {
                const nat = (actor.nationality || '').toLowerCase();
                const pob = (actor.place_of_birth || '').toLowerCase();
                let isMatch = false;
                if (targetCountry === 'việt nam' || targetCountry === 'vn' || targetCountry === 'vietnam') {
                  isMatch = nat.includes('việt') || nat.includes('vietnam') || pob.includes('vietnam') || pob.includes('việt nam');
                } else if (targetCountry === 'hàn quốc' || targetCountry === 'kr' || targetCountry === 'south korea' || targetCountry === 'korea') {
                  isMatch = nat.includes('hàn quốc') || nat.includes('korea') || pob.includes('korea') || pob.includes('seoul') || pob.includes('busan');
                } else {
                  isMatch = nat.includes(targetCountry) || pob.includes(targetCountry);
                }
                if (!isMatch) continue;
              }
              seenIds.add(actor.id);
              pool.push(actor);
            }
          }
        } catch {
          // ignore
        }
      }

      // Special discovery for writers when filtering by Writing (100% Dynamic from TMDB API)
      if (targetDept === 'writing') {
        try {
          let discParams1: any = { language, sort_by: 'popularity.desc', page: 1 };
          let discParams2: any = { language, sort_by: 'revenue.desc', page: 1 };
          let discParams3: any = { language, sort_by: 'vote_count.desc', page: 1 };

          if (targetCountry === 'việt nam' || targetCountry === 'vn' || targetCountry === 'vietnam') {
            discParams1 = { language, with_origin_country: 'VN', sort_by: 'revenue.desc', page: 1 };
            discParams2 = { language, with_original_language: 'vi', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'VN', sort_by: 'popularity.desc', page: 1 };
          } else if (targetCountry === 'hàn quốc' || targetCountry === 'kr' || targetCountry === 'south korea' || targetCountry === 'korea') {
            discParams1 = { language, with_origin_country: 'KR', sort_by: 'revenue.desc', page: 1 };
            discParams2 = { language, with_original_language: 'ko', sort_by: 'revenue.desc', page: 1 };
            discParams3 = { language, with_origin_country: 'KR', sort_by: 'popularity.desc', page: 1 };
          }

          const [popMoviesRes, revMoviesRes, voteMoviesRes] = await Promise.all([
            this.getAxiosClient().get('/discover/movie', { params: discParams1 }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: discParams2 }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: discParams3 }).catch(() => null)
          ]);

          const discoveredMovies: any[] = [];
          const movieIdsSeen = new Set<number>();

          [popMoviesRes, revMoviesRes, voteMoviesRes].forEach((r) => {
            if (r && r.data && r.data.results) {
              r.data.results.forEach((m: any) => {
                if (!movieIdsSeen.has(m.id)) {
                  movieIdsSeen.add(m.id);
                  discoveredMovies.push(m);
                }
              });
            }
          });

          if (discoveredMovies.length > 0) {
            const topMovies = discoveredMovies.slice(0, 80);
            const creditsList = await Promise.all(
              topMovies.map((m: any) =>
                this.getAxiosClient().get(`/movie/${m.id}`, { params: { language, append_to_response: 'credits' } }).catch(() => null)
              )
            );

            const dynamicWriterRaw: any[] = [];
            for (const mRes of creditsList) {
              if (!mRes || !mRes.data || !mRes.data.credits || !mRes.data.credits.crew) continue;
              const writers = mRes.data.credits.crew.filter(
                (c: any) =>
                  (c.department || '').toLowerCase() === 'writing' ||
                  (c.job || '').toLowerCase().includes('screenplay') ||
                  (c.job || '').toLowerCase().includes('writer')
              );
              for (const wr of writers) {
                if (!wr.profile_path || wr.profile_path.trim() === '') continue;
                if (seenIds.has(wr.id)) continue;
                if (targetGender !== null && wr.gender !== targetGender) continue;
                dynamicWriterRaw.push(wr);
              }
            }

            const hydratedWriters = await this.hydrateActorDetails(dynamicWriterRaw, language);
            for (const actor of hydratedWriters) {
              if (!actor.profile_path || actor.profile_path.trim() === '') continue;
              if (seenIds.has(actor.id)) continue;
              if (targetGender !== null && actor.gender !== undefined && actor.gender !== targetGender) continue;
              if (targetCountry !== null) {
                const nat = (actor.nationality || '').toLowerCase();
                const pob = (actor.place_of_birth || '').toLowerCase();
                let isMatch = false;
                if (targetCountry === 'việt nam' || targetCountry === 'vn' || targetCountry === 'vietnam') {
                  isMatch = nat.includes('việt') || nat.includes('vietnam') || pob.includes('vietnam') || pob.includes('việt nam');
                } else if (targetCountry === 'hàn quốc' || targetCountry === 'kr' || targetCountry === 'south korea' || targetCountry === 'korea') {
                  isMatch = nat.includes('hàn quốc') || nat.includes('korea') || pob.includes('korea') || pob.includes('seoul') || pob.includes('busan');
                } else {
                  isMatch = nat.includes(targetCountry) || pob.includes(targetCountry);
                }
                if (!isMatch) continue;
              }
              seenIds.add(actor.id);
              pool.push(actor);
            }
          }
        } catch {
          // ignore
        }
      }

      // Special discovery for regional countries (Việt Nam, Hàn Quốc)
      if (targetCountry === 'hàn quốc' || targetCountry === 'kr' || targetCountry === 'south korea' || targetCountry === 'korea') {
        try {
          const discRes = await Promise.all([
            this.getAxiosClient().get('/discover/movie', { params: { language, with_origin_country: 'KR', sort_by: 'revenue.desc', page: 1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { language, with_original_language: 'ko', sort_by: 'revenue.desc', page: 1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { language, with_origin_country: 'KR', sort_by: 'popularity.desc', page: 1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { language, with_original_language: 'ko', sort_by: 'popularity.desc', page: 2 } }).catch(() => null)
          ]);

          const discoveredMovies: any[] = [];
          const movieIdsSeen = new Set<number>();
          discRes.forEach((r) => {
            if (r && r.data && r.data.results) {
              r.data.results.forEach((m: any) => {
                if (!movieIdsSeen.has(m.id)) {
                  movieIdsSeen.add(m.id);
                  discoveredMovies.push(m);
                }
              });
            }
          });

          if (discoveredMovies.length > 0) {
            const topMovies = discoveredMovies.slice(0, 60);
            const creditsList = await Promise.all(
              topMovies.map((m: any) =>
                this.getAxiosClient().get(`/movie/${m.id}`, { params: { language, append_to_response: 'credits' } }).catch(() => null)
              )
            );

            const dynamicCastRaw: any[] = [];
            for (const mRes of creditsList) {
              if (!mRes || !mRes.data || !mRes.data.credits || !mRes.data.credits.cast) continue;
              for (const member of mRes.data.credits.cast) {
                if (!member.profile_path || member.profile_path.trim() === '') continue;
                if (seenIds.has(member.id)) continue;
                if (targetGender !== null && member.gender !== targetGender) continue;
                if (isSelfRole(member.character)) continue;
                dynamicCastRaw.push(member);
              }
            }

            const hydratedDiscovered = await this.hydrateActorDetails(dynamicCastRaw, language);
            for (const actor of hydratedDiscovered) {
              if (!actor.profile_path || actor.profile_path.trim() === '') continue;
              if (seenIds.has(actor.id)) continue;
              if (targetGender !== null && actor.gender !== undefined && actor.gender !== targetGender) continue;
              if (targetDept !== null) {
                const dept = (actor.known_for_department || 'acting').toLowerCase();
                if (!dept.includes(targetDept)) continue;
              }
              const nat = (actor.nationality || '').toLowerCase();
              const pob = (actor.place_of_birth || '').toLowerCase();
              const isKr = nat.includes('hàn quốc') || nat.includes('korea') || pob.includes('korea') || pob.includes('seoul') || pob.includes('busan');
              if (!isKr) continue;

              seenIds.add(actor.id);
              pool.push(actor);
            }
          }
        } catch {
          // ignore
        }
      }

      // Special discovery for regional countries with few global popular person entries (e.g. Việt Nam)
      if (targetCountry === 'việt nam' || targetCountry === 'vn' || targetCountry === 'vietnam') {
        try {
          const discRes = await Promise.all([
            this.getAxiosClient().get('/discover/movie', { params: { language, with_origin_country: 'VN', sort_by: 'revenue.desc', page: 1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { language, with_original_language: 'vi', sort_by: 'revenue.desc', page: 1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { language, with_origin_country: 'VN', sort_by: 'popularity.desc', page: 1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { language, with_original_language: 'vi', sort_by: 'popularity.desc', page: 2 } }).catch(() => null)
          ]);

          const discoveredMovies: any[] = [];
          const movieIdsSeen = new Set<number>();
          discRes.forEach((r) => {
            if (r && r.data && r.data.results) {
              r.data.results.forEach((m: any) => {
                if (!movieIdsSeen.has(m.id)) {
                  movieIdsSeen.add(m.id);
                  discoveredMovies.push(m);
                }
              });
            }
          });

          if (discoveredMovies.length > 0) {
            const topMovies = discoveredMovies.slice(0, 60);
            const creditsList = await Promise.all(
              topMovies.map((m: any) =>
                this.getAxiosClient().get(`/movie/${m.id}`, { params: { language, append_to_response: 'credits' } }).catch(() => null)
              )
            );

            const dynamicCastRaw: any[] = [];
            for (const mRes of creditsList) {
              if (!mRes || !mRes.data || !mRes.data.credits || !mRes.data.credits.cast) continue;
              for (const member of mRes.data.credits.cast) {
                if (!member.profile_path || member.profile_path.trim() === '') continue;
                if (seenIds.has(member.id)) continue;
                if (targetGender !== null && member.gender !== targetGender) continue;
                if (isSelfRole(member.character)) continue;
                dynamicCastRaw.push(member);
              }
            }

            const hydratedDiscovered = await this.hydrateActorDetails(dynamicCastRaw, language);
            for (const actor of hydratedDiscovered) {
              if (!actor.profile_path || actor.profile_path.trim() === '') continue;
              if (seenIds.has(actor.id)) continue;
              if (targetGender !== null && actor.gender !== undefined && actor.gender !== targetGender) continue;
              if (targetDept !== null) {
                const dept = (actor.known_for_department || 'acting').toLowerCase();
                if (!dept.includes(targetDept)) continue;
              }
              const nat = (actor.nationality || '').toLowerCase();
              const pob = (actor.place_of_birth || '').toLowerCase();
              const isVn = nat.includes('việt') || nat.includes('vietnam') || pob.includes('vietnam') || pob.includes('việt nam');
              if (!isVn) continue;

              seenIds.add(actor.id);
              pool.push(actor);
            }
          }
        } catch (discErr) {
          // continue to popular scan
        }
      }

      const SCAN_PAGES = 50;
      const tmdbPages = Array.from({ length: SCAN_PAGES }, (_, i) => i + 1);

      for (let i = 0; i < tmdbPages.length; i += 5) {
        const batchPages = tmdbPages.slice(i, i + 5);
        const responses = await Promise.all(
          batchPages.map((pNum) =>
            this.getAxiosClient()
              .get('/person/popular', { params: { language, page: pNum } })
              .catch(() => null)
          )
        );

        for (const res of responses) {
          if (!res || !res.data || !res.data.results) continue;
          const rawList = res.data.results;

          const filteredRaw = rawList.filter((p: any) => {
            if (!p.profile_path || p.profile_path.trim() === '') return false;
            if (seenIds.has(p.id)) return false;
            if (targetGender !== null && p.gender !== undefined && p.gender !== targetGender) return false;
            if (targetDept !== null && p.known_for_department) {
              if (!p.known_for_department.toLowerCase().includes(targetDept)) return false;
            }
            return true;
          });

          const hydrated = await this.hydrateActorDetails(filteredRaw, language);

          for (const actor of hydrated) {
            if (!actor.profile_path || actor.profile_path.trim() === '') continue;
            if (seenIds.has(actor.id)) continue;

            if (targetGender !== null && actor.gender !== undefined && actor.gender !== targetGender) {
              continue;
            }

            if (targetDept !== null) {
              const dept = (actor.known_for_department || 'acting').toLowerCase();
              if (!dept.includes(targetDept)) continue;
            }

            if (targetCountry !== null) {
              const nat = (actor.nationality || '').toLowerCase();
              const pob = (actor.place_of_birth || '').toLowerCase();

              let isMatch = false;
              if (targetCountry === 'hàn quốc' || targetCountry === 'kr' || targetCountry === 'south korea' || targetCountry === 'korea') {
                isMatch = nat.includes('hàn quốc') || nat.includes('korea') || pob.includes('korea') || pob.includes('seoul') || pob.includes('busan');
              } else if (targetCountry === 'việt nam' || targetCountry === 'vn' || targetCountry === 'vietnam') {
                isMatch = nat.includes('việt') || nat.includes('vietnam') || pob.includes('vietnam') || pob.includes('việt nam');
              } else if (targetCountry === 'mỹ' || targetCountry === 'us' || targetCountry === 'usa') {
                isMatch = nat.includes('mỹ') || nat.includes('usa') || nat.includes('united states') || pob.includes('usa') || pob.includes('united states');
              } else if (targetCountry === 'anh' || targetCountry === 'gb' || targetCountry === 'uk') {
                isMatch = nat.includes('anh') || nat.includes('uk') || nat.includes('england') || pob.includes('uk') || pob.includes('england');
              } else if (targetCountry === 'nhật bản' || targetCountry === 'jp' || targetCountry === 'japan') {
                isMatch = nat.includes('nhật') || nat.includes('japan') || pob.includes('japan');
              } else if (targetCountry === 'trung quốc' || targetCountry === 'cn' || targetCountry === 'china') {
                isMatch = nat.includes('trung quốc') || nat.includes('china') || nat.includes('hong kong') || nat.includes('taiwan') || pob.includes('china') || pob.includes('hong kong') || pob.includes('taiwan');
              } else if (targetCountry === 'pháp' || targetCountry === 'fr' || targetCountry === 'france') {
                isMatch = nat.includes('pháp') || nat.includes('france') || pob.includes('france');
              } else if (targetCountry === 'thái lan' || targetCountry === 'th' || targetCountry === 'thailand') {
                isMatch = nat.includes('thái') || nat.includes('thailand') || pob.includes('thailand');
              } else {
                isMatch = nat.includes(targetCountry) || pob.includes(targetCountry);
              }

              if (!isMatch) continue;
            }

            seenIds.add(actor.id);
            pool.push(actor);
          }
        }
      }

      pool.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      const totalAvailable = pool.length;
      const total_pages = Math.max(1, Math.ceil(totalAvailable / 20));
      const startIndex = (page - 1) * 20;

      return {
        actors: pool.slice(startIndex, startIndex + 20),
        total_pages
      };
    } catch (err) {
      console.warn(`[TMDB API Error] /person/popular failed: ${(err as Error).message}`);
      return { actors: [], total_pages: 1 };
    }
  }

  static async getActorDetails(actorId: number, language: string = 'vi-VN'): Promise<Actor | null> {
    try {
      const response = await this.getAxiosClient().get(`/person/${actorId}`, {
        params: { language, append_to_response: 'movie_credits,external_ids' }
      });
      if (response.data) {
        return this.mapTMDBActorDetail(response.data, language);
      }
    } catch (err) {
      console.warn(`[TMDB API Error] /person/${actorId} failed: ${(err as Error).message}`);
    }
    return null;
  }

  static async searchAll(query: string, language: string = 'vi-VN') {
    try {
      const searchQueries = getSmartSearchQueries(query);
      const searchLangs = Array.from(new Set([language, 'vi-VN', 'en-US']));
      const searchReqs: Promise<any>[] = [];

      searchLangs.forEach((langStr) => {
        searchQueries.forEach((qStr) => {
          searchReqs.push(
            this.getAxiosClient().get('/search/movie', { params: { query: qStr, language: langStr } }).catch(() => null)
          );
        });
      });

      const [movResponses, actRes] = await Promise.all([
        Promise.all(searchReqs),
        this.getAxiosClient().get('/search/person', { params: { query, language } }).catch(() => null)
      ]);

      const movieMap = new Map<number, Movie>();
      for (const res of movResponses) {
        if (!res || !res.data || !res.data.results) continue;
        res.data.results.forEach((m: any) => {
          if (isValidMovie(m) && !movieMap.has(m.id)) {
            movieMap.set(m.id, this.mapTMDBMovie(m));
          }
        });
      }

      const movies = Array.from(movieMap.values());
      movies.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        const origA = (a.original_title || '').toLowerCase();
        const origB = (b.original_title || '').toLowerCase();
        const lowerQ = query.toLowerCase();

        const exactA = titleA.includes(lowerQ) || origA.includes(lowerQ) ? 1 : 0;
        const exactB = titleB.includes(lowerQ) || origB.includes(lowerQ) ? 1 : 0;

        if (exactA !== exactB) return exactB - exactA;
        return (b.vote_average || 0) * (b.vote_count || 0) > (a.vote_average || 0) * (a.vote_count || 0) ? 1 : -1;
      });

      return {
        movies,
        actors: actRes?.data?.results?.filter((a: any) => a.profile_path).map((a: any) => this.mapTMDBActor(a)) || []
      };
    } catch (err) {
      console.warn(`[TMDB API Error] /search failed: ${(err as Error).message}`);
      return { movies: [], actors: [] };
    }
  }

  static async filterMovies(opts: {
    q?: string;
    genre?: string;
    country?: string;
    yearFrom?: number;
    yearTo?: number;
    minRating?: number;
    sort?: string;
    page?: number;
    language?: string;
  }): Promise<{ movies: Movie[]; page: number; total_pages: number; total_results: number }> {
    const q = opts.q ? opts.q.trim() : '';
    const genre = opts.genre || 'all';
    const country = opts.country || 'all';
    const yearFrom = opts.yearFrom || 1950;
    const yearTo = opts.yearTo || 2026;
    const minRating = opts.minRating || 0;
    const sort = opts.sort || 'popularity';
    const page = Math.max(1, opts.page || 1);
    const language = opts.language || 'vi-VN';

    const isGlobalMarket = country === 'all' || country === 'US';
    const minVoteCount = isGlobalMarket ? 300 : 5;
    const minVoteCountRecent = isGlobalMarket ? 1000 : 20;

    let candidateMovies: Movie[] = [];
    let tmdbTotalPages = 1;
    let tmdbTotalResults = 0;

    try {
      if (q) {
        const searchQueries = getSmartSearchQueries(q);
        const searchLangs = Array.from(new Set([language, 'vi-VN', 'en-US']));
        const searchReqs: Promise<any>[] = [];

        searchLangs.forEach((langStr) => {
          searchQueries.forEach((queryStr) => {
            searchReqs.push(
              this.getAxiosClient()
                .get('/search/movie', { params: { query: queryStr, language: langStr, page } })
                .catch(() => null)
            );
          });
        });

        const searchResponses = await Promise.all(searchReqs);

        const movieMap = new Map<number, Movie>();
        let maxPages = 1;
        let totalCount = 0;

        for (const res of searchResponses) {
          if (!res || !res.data || !res.data.results) continue;
          maxPages = Math.max(maxPages, Math.min(res.data.total_pages || 1, 500));
          totalCount = Math.max(totalCount, res.data.total_results || 0);

          res.data.results.forEach((m: any) => {
            if (!movieMap.has(m.id)) {
              movieMap.set(m.id, this.mapTMDBMovie(m, minVoteCount, minVoteCountRecent));
            }
          });
        }

        candidateMovies = Array.from(movieMap.values());
        const searchQueriesLower = searchQueries.map((s) => s.toLowerCase());

        candidateMovies.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          const origA = (a.original_title || '').toLowerCase();
          const origB = (b.original_title || '').toLowerCase();
          const titleViA = (a.title_vi || '').toLowerCase();
          const titleViB = (b.title_vi || '').toLowerCase();

          const matchA = searchQueriesLower.some(
            (sq) => titleA.includes(sq) || origA.includes(sq) || (titleViA && titleViA.includes(sq)) || sq.includes(titleA) || sq.includes(origA)
          ) ? 1 : 0;

          const matchB = searchQueriesLower.some(
            (sq) => titleB.includes(sq) || origB.includes(sq) || (titleViB && titleViB.includes(sq)) || sq.includes(titleB) || sq.includes(origB)
          ) ? 1 : 0;

          if (matchA !== matchB) return matchB - matchA;

          if (sort === 'rating') {
            const scoreA = a.imdb_score || a.vote_average || 0;
            const scoreB = b.imdb_score || b.vote_average || 0;
            const mThreshold = isGlobalMarket ? 2500 : 250;
            const wrA = calculateWeightedRating(scoreA, a.vote_count || 0, mThreshold, 6.9);
            const wrB = calculateWeightedRating(scoreB, b.vote_count || 0, mThreshold, 6.9);

            if (Math.abs(wrB - wrA) >= 0.01) {
              return wrB - wrA;
            }
            return scoreB - scoreA;
          }

          return (b.vote_average || 0) * (b.vote_count || 0) - (a.vote_average || 0) * (a.vote_count || 0);
        });

        tmdbTotalPages = maxPages;
        tmdbTotalResults = Math.max(totalCount, candidateMovies.length);
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        let primaryReleaseLte = `${yearTo}-12-31`;
        if (sort === 'date' && yearTo >= new Date().getFullYear()) {
          primaryReleaseLte = todayStr;
        }

        const params: any = {
          language,
          page,
          'primary_release_date.gte': `${yearFrom}-01-01`,
          'primary_release_date.lte': primaryReleaseLte,
          sort_by: sort === 'rating' ? 'vote_average.desc' : sort === 'date' ? 'primary_release_date.desc' : 'popularity.desc'
        };

        if (isGlobalMarket) {
          if (sort === 'date' || yearFrom >= 2024) {
            params['vote_count.gte'] = 5;
          } else if (sort === 'rating' || minRating > 0) {
            params['vote_count.gte'] = 1000;
          }
        } else {
          params['vote_count.gte'] = 5;
        }

        if (genre && genre !== 'all') {
          const key = genre.toLowerCase().replace(/[^a-z]/g, '');
          const genreId = GENRE_NAME_TO_ID[key];
          if (genreId) params.with_genres = genreId;
        }

        if (country && country !== 'all') {
          const cUpper = country.toUpperCase();
          const cInfo = COUNTRY_TO_LANG_MAP[cUpper];
          if (cInfo) {
            if (cInfo.country) params.with_origin_country = cInfo.country;
            if (cInfo.lang) params.with_original_language = cInfo.lang;
          }
        }

        if (minRating > 0) {
          params['vote_average.gte'] = minRating;
        }

        if (sort === 'rating' && country === 'all' && genre === 'all' && !q) {
          const tmdbP1 = (page - 1) * 2 + 1;
          const tmdbP2 = tmdbP1 + 1;
          const legendIds = [278, 238, 155, 240, 389, 424, 122, 680, 120, 121, 27205, 550, 13, 157336, 769, 872585, 496243, 693134, 129, 497, 372058, 637];
          const [res1, res2, legendMovies] = await Promise.all([
            this.getAxiosClient().get('/discover/movie', { params: { ...params, page: tmdbP1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { ...params, page: tmdbP2 } }).catch(() => null),
            page === 1
              ? Promise.all(legendIds.map((lid) => this.getMovieDetails(lid, language).catch(() => null)))
              : Promise.resolve([])
          ]);
          const results1 = res1?.data?.results || [];
          const results2 = res2?.data?.results || [];
          const combined = [...results1, ...results2];
          const map = new Map<number, any>();

          if (page === 1) {
            combined.forEach((m: any) => map.set(m.id, this.mapTMDBMovie(m, minVoteCount, minVoteCountRecent)));
            (legendMovies.filter(Boolean) as Movie[]).forEach((lm) => map.set(lm.id, lm));
          } else {
            combined.forEach((m: any) => {
              if (!legendIds.includes(m.id)) {
                map.set(m.id, this.mapTMDBMovie(m, minVoteCount, minVoteCountRecent));
              }
            });
          }

          candidateMovies = Array.from(map.values());
          tmdbTotalPages = Math.min(res1?.data?.total_pages || 1, 500);
          tmdbTotalResults = res1?.data?.total_results || candidateMovies.length;
        } else if (sort === 'rating' && !isGlobalMarket && !q) {
          // Regional "highest rating" filter (e.g. country = VN): fetch a couple of
          // pages so the in-memory re-sort has a wider pool to pick a real top-N from,
          // instead of just re-sorting whatever single TMDB page happened to come back.
          const tmdbP1 = (page - 1) * 2 + 1;
          const tmdbP2 = tmdbP1 + 1;
          const [res1, res2] = await Promise.all([
            this.getAxiosClient().get('/discover/movie', { params: { ...params, page: tmdbP1 } }).catch(() => null),
            this.getAxiosClient().get('/discover/movie', { params: { ...params, page: tmdbP2 } }).catch(() => null)
          ]);
          const results1 = res1?.data?.results || [];
          const results2 = res2?.data?.results || [];
          const combined = [...results1, ...results2];
          const map = new Map<number, any>();
          combined.forEach((m: any) => map.set(m.id, this.mapTMDBMovie(m, minVoteCount, minVoteCountRecent)));

          candidateMovies = Array.from(map.values());
          tmdbTotalPages = Math.min(res1?.data?.total_pages || 1, 500);
          tmdbTotalResults = res1?.data?.total_results || candidateMovies.length;
        } else {
          const discoverRes = await this.getAxiosClient().get('/discover/movie', { params });
          if (discoverRes.data?.results) {
            candidateMovies = discoverRes.data.results.map((m: any) => this.mapTMDBMovie(m, minVoteCount, minVoteCountRecent));
            tmdbTotalPages = Math.min(discoverRes.data.total_pages || 1, 500);
            tmdbTotalResults = discoverRes.data.total_results || candidateMovies.length;
          }
        }
      }
    } catch (err) {
      console.warn(`[TMDB API Error] filterMovies API call failed: ${(err as Error).message}`);
    }

    let allMovies = candidateMovies.filter((m) => isValidMovie(m));

    allMovies = allMovies.filter((m) => {

      if (country && country !== 'all') {
        const cUpper = country.toUpperCase();
        const cInfo = COUNTRY_TO_LANG_MAP[cUpper];
        let cMatch = false;

        if (m.origin_country) {
          if (Array.isArray(m.origin_country) && m.origin_country.some((c) => c.toUpperCase() === cUpper)) cMatch = true;
          if (typeof m.origin_country === 'string' && m.origin_country.toUpperCase().includes(cUpper)) cMatch = true;
        }
        if (!cMatch && m.original_language && cInfo?.lang && m.original_language.toLowerCase() === cInfo.lang.toLowerCase()) {
          cMatch = true;
        }
        if (!cMatch && cUpper === 'VN') {
          if (m.original_language === 'vi') cMatch = true;
        }
        if (!cMatch) return false;
      }

      if (genre && genre !== 'all') {
        const key = genre.toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetGenreId = GENRE_NAME_TO_ID[key];
        const hasGenre = m.genres?.some((g) => {
          if (targetGenreId && g.id === targetGenreId) return true;
          const gName = g.name.toLowerCase();
          return gName.includes(key) || key.includes(gName);
        });
        if (!hasGenre) return false;
      }

      const year = m.release_date ? parseInt(m.release_date.split('-')[0], 10) : 0;
      if (year > 0) {
        if (year < yearFrom || year > yearTo) return false;
      } else if (yearFrom > 1950 || yearTo < 2026) {
        return false;
      }

      if (sort === 'date') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (!m.release_date || m.release_date > todayStr) return false;
      }

      if (sort === 'rating') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (m.release_date && m.release_date > todayStr) return false;
        if (m.vote_average <= 0 || !m.imdb_score || m.imdb_score <= 0) return false;
        if (isGlobalMarket && m.vote_count < 300) return false;
      }

      if (minRating > 0) {
        if ((m.imdb_score || m.vote_average) < minRating) return false;
      }

      return true;
    });

    if (sort === 'rating') {
      const mThreshold = isGlobalMarket ? 2500 : 250;
      allMovies.sort((a, b) => {
        const scoreA = a.imdb_score || a.vote_average || 0;
        const scoreB = b.imdb_score || b.vote_average || 0;

        const wrA = calculateWeightedRating(scoreA, a.vote_count || 0, mThreshold, 6.9);
        const wrB = calculateWeightedRating(scoreB, b.vote_count || 0, mThreshold, 6.9);

        if (Math.abs(wrB - wrA) >= 0.01) {
          return wrB - wrA;
        }
        return scoreB - scoreA;
      });
    } else if (sort === 'date') {
      allMovies.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    }

    const pagedMovies = allMovies.slice(0, 20);

    return {
      movies: pagedMovies,
      page,
      total_pages: Math.max(1, tmdbTotalPages),
      total_results: tmdbTotalResults || allMovies.length
    };
  }

  static async discoverMovies(params: any) {
    return this.filterMovies(params);
  }

  static async compareActors(actorAId: number, actorBId: number, language: string = 'vi-VN'): Promise<ActorComparison | null> {
    const actorA = await this.getActorDetails(actorAId, language);
    const actorB = await this.getActorDetails(actorBId, language);

    if (!actorA || !actorB) return null;

    const filmsA = actorA.filmography || [];
    const filmsB = actorB.filmography || [];

    const shared = filmsA
      .filter((fa) => filmsB.some((fb) => fb.id === fa.id))
      .map((fa) => {
        const fb = filmsB.find((item) => item.id === fa.id)!;
        return {
          id: fa.id,
          title: fa.title,
          year: fa.year,
          characterA: fa.character,
          characterB: fb.character,
          poster_path: fa.poster_path,
          vote_average: fa.vote_average
        };
      });

    const formatAwardsSummary = (actor: Actor) => {
      const validAwards = (actor.awards || []).filter((a) => {
        if (!a) return false;
        if (a.status === 'nominated' || (a as any).won === false) return false;
        const cat = (a.category || '').toLowerCase();
        const name = (a.name || '').toLowerCase();
        if (cat.includes('đề cử') || cat.includes('nomine') || name.includes('đề cử') || name.includes('nomine')) return false;
        return true;
      });
      if (validAwards.length === 0) return 'Chưa có giải thưởng chính thức';
      const awardNames = Array.from(new Set(validAwards.map((a) => a.name.split(' ')[0])));
      return `${validAwards.length} giải thưởng chính thức (${awardNames.join(', ')})`;
    };

    const currentYear = new Date().getFullYear();
    const careerYearsA = actorA.debut_year ? currentYear - actorA.debut_year : 20;
    const careerYearsB = actorB.debut_year ? currentYear - actorB.debut_year : 20;

    const genreMap: Record<string, { a: number; b: number }> = {};
    filmsA.forEach((f) => {
      const g = f.genre || 'Other';
      if (!genreMap[g]) genreMap[g] = { a: 0, b: 0 };
      genreMap[g].a += 1;
    });
    filmsB.forEach((f) => {
      const g = f.genre || 'Other';
      if (!genreMap[g]) genreMap[g] = { a: 0, b: 0 };
      genreMap[g].b += 1;
    });

    const genre_distribution = Object.keys(genreMap).map((genre) => ({
      genre,
      actorA_count: genreMap[genre].a,
      actorB_count: genreMap[genre].b
    }));

    return {
      actorA,
      actorB,
      shared_movies: shared,
      stats: {
        actorA_avg_rating: filmsA.length > 0 ? Math.round((filmsA.reduce((sum, f) => sum + f.vote_average, 0) / filmsA.length) * 10) / 10 : 7.5,
        actorB_avg_rating: filmsB.length > 0 ? Math.round((filmsB.reduce((sum, f) => sum + f.vote_average, 0) / filmsB.length) * 10) / 10 : 7.5,
        actorA_total_movies: filmsA.length,
        actorB_total_movies: filmsB.length,
        actorA_career_years: careerYearsA,
        actorB_career_years: careerYearsB,
        actorA_major_awards: formatAwardsSummary(actorA),
        actorB_major_awards: formatAwardsSummary(actorB),
        actorA_box_office: actorA.total_box_office || '$2.5 Tỷ USD',
        actorB_box_office: actorB.total_box_office || '$3.8 Tỷ USD',
        genre_distribution
      }
    };
  }

  static async compareMovies(movieAId: number, movieBId: number, lang: string = 'vi-VN') {
    const [movieA, movieB] = await Promise.all([
      this.getMovieDetails(movieAId, lang),
      this.getMovieDetails(movieBId, lang)
    ]);

    if (!movieA || !movieB) return null;

    const parseMoney = (str?: string) => {
      if (!str) return 0;
      const num = parseFloat(str.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    const boxA = parseMoney(movieA.box_office);
    const boxB = parseMoney(movieB.box_office);

    return {
      movieA,
      movieB,
      stats: {
        movieA_rating: movieA.vote_average || 0,
        movieB_rating: movieB.vote_average || 0,
        movieA_box_office: movieA.box_office || 'Chưa có dữ liệu',
        movieB_box_office: movieB.box_office || 'Chưa có dữ liệu',
        movieA_budget: movieA.budget || 'Chưa có dữ liệu',
        movieB_budget: movieB.budget || 'Chưa có dữ liệu',
        movieA_runtime: movieA.runtime || 0,
        movieB_runtime: movieB.runtime || 0,
        box_office_winner: boxA >= boxB ? 'A' : 'B',
        rating_winner: (movieA.vote_average || 0) >= (movieB.vote_average || 0) ? 'A' : 'B'
      }
    };
  }

  static async getActorNetworkGraph(actorId: number) {
    try {
      const apiKey = process.env.TMDB_API_KEY || 'd3c7110bb351e18591a6e6b2b567f156';
      const actor = await this.getActorDetails(actorId);
      const centerActorName = actor ? actor.name : 'Diễn viên';

      // Fetch actor's movie credits
      const creditsRes = await axios.get(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}&language=vi-VN`
      );

      const castFilms = creditsRes.data?.cast || [];
      const topFilms = [...castFilms]
        .sort((a: any, b: any) => (b.vote_count || 0) - (a.vote_count || 0))
        .slice(0, 5);

      const nodesMap = new Map<string, { id: string; name: string; group: number; val: number; profile_path?: string }>();
      nodesMap.set(actorId.toString(), {
        id: actorId.toString(),
        name: centerActorName,
        group: 1,
        val: 20,
        profile_path: actor?.profile_path
      });

      const links: { source: string; target: string; movie_title: string; shared_count: number }[] = [];

      for (const film of topFilms) {
        try {
          const filmCreditsRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${film.id}/credits?api_key=${apiKey}`
          );
          const topCoStars = (filmCreditsRes.data?.cast || [])
            .filter((c: any) => c.id !== actorId && c.profile_path)
            .slice(0, 4);

          for (const coStar of topCoStars) {
            const coStarId = coStar.id.toString();
            if (!nodesMap.has(coStarId)) {
              nodesMap.set(coStarId, {
                id: coStarId,
                name: coStar.name,
                group: 2,
                val: 12,
                profile_path: `https://image.tmdb.org/t/p/w185${coStar.profile_path}`
              });
            }

            const existingLink = links.find(
              (l) => (l.source === actorId.toString() && l.target === coStarId) || (l.source === coStarId && l.target === actorId.toString())
            );

            if (existingLink) {
              existingLink.shared_count += 1;
            } else {
              links.push({
                source: actorId.toString(),
                target: coStarId,
                movie_title: film.title || film.original_title || 'Phim',
                shared_count: 1
              });
            }
          }
        } catch {
          // Ignore individual movie failure
        }
      }

      return {
        nodes: Array.from(nodesMap.values()),
        links
      };
    } catch (err) {
      console.warn('[Network Graph Error]', (err as Error).message);
      return {
        nodes: [{ id: actorId.toString(), name: 'Diễn viên', group: 1, val: 20 }],
        links: []
      };
    }
  }

  private static mapTMDBMovie(m: any, overrideMinVoteCount?: number, overrideMinVoteCountRecent?: number): Movie {
    const auto = resolveVoteThresholds(m);
    const minVoteCount = overrideMinVoteCount ?? auto.minVoteCount;
    const minVoteCountRecent = overrideMinVoteCountRecent ?? auto.minVoteCountRecent;
    const todayStr = new Date().toISOString().split('T')[0];
    const isUpcoming = (m.release_date && m.release_date > todayStr) || m.status === 'In Production' || m.status === 'Post Production' || m.status === 'Planned';
    const score = isUpcoming ? 0 : (m.vote_average ? Math.round(m.vote_average * 10) / 10 : 0);

    return {
      id: m.id,
      title: m.title || m.original_title,
      original_title: m.original_title || m.title,
      title_vi: m.original_language === 'vi' ? m.title : (m.title !== m.original_title ? m.title : undefined),
      origin_country: m.origin_country || (m.original_language === 'vi' ? ['VN'] : ['US']),
      original_language: m.original_language || 'en',
      poster_path: m.poster_path ? (m.poster_path.startsWith('http') ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`) : '',
      backdrop_path: m.backdrop_path ? (m.backdrop_path.startsWith('http') ? m.backdrop_path : `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`) : '',
      release_date: m.release_date || '',
      runtime: m.runtime || 0,
      genres: m.genre_ids ? m.genre_ids.map((gid: number) => ({ id: gid, name: TMDB_GENRE_MAP[gid] || 'Cinema' })) : (m.genres || []),
      director: 'Chưa có dữ liệu',
      vote_average: score,
      vote_count: m.vote_count || 0,
      imdb_score: isUpcoming ? undefined : score,
      weighted_rating: isUpcoming ? undefined : calculateWeightedRating(score, m.vote_count || 0, 2500, 6.9),
      popularity: m.popularity ? Math.round(m.popularity * 10) / 10 : 0,
      overview: m.overview || '',
      overview_vi: m.overview || '',
      cast: []
    };
  }

  private static mapTMDBMovieDetail(m: any, overrideMinVoteCount?: number, overrideMinVoteCountRecent?: number): Movie {
    const auto = resolveVoteThresholds(m);
    const minVoteCount = overrideMinVoteCount ?? auto.minVoteCount;
    const minVoteCountRecent = overrideMinVoteCountRecent ?? auto.minVoteCountRecent;
    const director = m.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'Chưa có dữ liệu';
    const writer = m.credits?.crew?.find((c: any) => c.job === 'Screenplay' || c.job === 'Writer')?.name;
    const studio = m.production_companies?.[0]?.name || 'Chưa có dữ liệu';
    const todayStr = new Date().toISOString().split('T')[0];
    const isUpcoming = (m.release_date && m.release_date > todayStr) || m.status === 'In Production' || m.status === 'Post Production' || m.status === 'Planned';
    const score = isUpcoming ? 0 : (m.vote_average ? Math.round(m.vote_average * 10) / 10 : 0);

    const videos = m.videos?.results || [];
    const youtubeTrailer =
      videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
      videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') ||
      videos.find((v: any) => v.site === 'YouTube' && v.type === 'Teaser') ||
      videos.find((v: any) => v.site === 'YouTube');

    const trailer_url = youtubeTrailer?.key
      ? `https://www.youtube-nocookie.com/embed/${youtubeTrailer.key}`
      : undefined;

    const castList = m.credits?.cast?.slice(0, 5) || [];
    const castNames = castList.map((c: any) => c.name).filter(Boolean);
    const topCastStr = castNames.length > 0 ? castNames.join(', ') : 'nhiều diễn viên tên tuổi';

    const rawOverview = (m.overview || '').trim();
    const p1 = rawOverview || `${m.title || m.original_title} là một tác phẩm điện ảnh thuộc thể loại ${(m.genres || []).map((g: any) => g.name).join(', ') || 'Điện ảnh'}.`;

    const p2_vi = `Tác phẩm quy tụ dàn diễn viên thực lực với sự tham gia của ${topCastStr}, mang đến những màn hóa thân đầy cảm xúc và sức hút trên màn ảnh.`;
    const p2_en = castNames.length > 0 
      ? `The film features a compelling performance by ${castNames[0]}${castNames.length > 1 ? ` alongside an impressive ensemble including ${castNames.slice(1).join(', ')}` : ''}.`
      : `The film features impressive performances by a talented ensemble cast.`;

    const dirStr = director !== 'Chưa có dữ liệu' ? director : 'đội ngũ đạo diễn kinh nghiệm';
    const writerStr = writer && writer !== director ? writer : undefined;
    const studioStr = studio !== 'Chưa có dữ liệu' ? studio : 'các hãng phim uy tín';

    const p3_vi = `Dưới sự chỉ đạo nghệ thuật của đạo diễn ${dirStr}${writerStr ? ` cùng kịch bản do ${writerStr} đảm nhận` : ''}, tác phẩm do ${studioStr} thực hiện, ghi dấu ấn với tư duy điện ảnh sắc bén, hình ảnh thị giác ấn tượng và ngôn ngữ điện ảnh cuốn hút.`;
    const p3_en = `Directed by ${dirStr}${writerStr ? ` with a screenplay by ${writerStr}` : ''}, the production was brought to life by ${studioStr}, showcasing exceptional cinematic craftsmanship and visual storytelling.`;

    const enrichedOverviewVi = `${p1}\n\n${p2_vi}\n\n${p3_vi}`;
    const enrichedOverviewEn = `${p1}\n\n${p2_en}\n\n${p3_en}`;

    return {
      id: m.id,
      title: m.title || m.original_title,
      original_title: m.original_title || m.title,
      title_vi: m.original_language === 'vi' ? m.title : (m.title !== m.original_title ? m.title : undefined),
      origin_country: m.origin_country || m.production_countries?.map((c: any) => c.iso_3166_1) || (m.original_language === 'vi' ? ['VN'] : ['US']),
      original_language: m.original_language || 'en',
      poster_path: m.poster_path ? (m.poster_path.startsWith('http') ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`) : '',
      backdrop_path: m.backdrop_path ? (m.backdrop_path.startsWith('http') ? m.backdrop_path : `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`) : '',
      release_date: m.release_date || '',
      runtime: m.runtime || 0,
      genres: m.genres || [],
      director,
      writer,
      studio,
      vote_average: score,
      vote_count: m.vote_count || 0,
      imdb_score: isUpcoming ? undefined : score,
      weighted_rating: isUpcoming ? undefined : calculateWeightedRating(score, m.vote_count || 0, 2500, 6.9),
      popularity: m.popularity ? Math.round(m.popularity * 10) / 10 : 0,
      rotten_tomatoes: undefined,
      metacritic_score: undefined,
      budget: m.budget && m.budget > 0 ? (m.budget >= 1000000000 ? `$${(m.budget / 1000000000).toFixed(2).replace(/\.00$/, '')} Tỷ USD` : `$${(m.budget / 1000000).toFixed(0)} Triệu USD`) : undefined,
      box_office: m.revenue && m.revenue > 0 ? (m.revenue >= 1000000000 ? `$${(m.revenue / 1000000000).toFixed(2).replace(/\.00$/, '')} Tỷ USD` : `$${(m.revenue / 1000000).toFixed(0)} Triệu USD`) : undefined,
      overview: enrichedOverviewEn,
      overview_vi: enrichedOverviewVi,
      cast: m.credits?.cast?.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w300${c.profile_path}` : ''
      })) || [],
      awards: [],
      trailer_url
    };
  }

  private static mapTMDBActor(a: any): Actor {
    const knownInfo = KNOWN_ACTORS_MAP[a.id.toString()];
    return {
      id: a.id,
      name: a.name,
      original_name: a.original_name || a.name,
      profile_path: a.profile_path ? `https://image.tmdb.org/t/p/w500${a.profile_path}` : '',
      birthday: a.birthday || knownInfo?.birthday || '',
      deathday: a.deathday || knownInfo?.deathday || undefined,
      place_of_birth: a.place_of_birth || knownInfo?.place_of_birth || '',
      nationality: knownInfo?.nationality || inferNationality(a.place_of_birth || knownInfo?.place_of_birth, undefined, a.known_for),
      known_for_department: a.known_for_department || 'Acting',
      biography: a.biography || `${a.name} là một diễn viên điện ảnh.`,
      biography_vi: knownInfo?.biography_vi,
      popularity: a.popularity ? Math.round(a.popularity * 10) / 10 : 0,
      total_box_office: knownInfo?.total_box_office,
      landmark_works: knownInfo?.landmark_works,
      awards: knownInfo?.awards || [],
      known_for: a.known_for,
      filmography: a.known_for ? a.known_for.map((k: any) => ({
        id: k.id,
        title: k.title || k.name || 'Movie',
        original_title: k.original_title || k.title,
        year: k.release_date ? parseInt(k.release_date.split('-')[0], 10) : 2020,
        character: k.character || 'Diễn viên',
        vote_average: k.vote_average || 0,
        poster_path: k.poster_path ? `https://image.tmdb.org/t/p/w300${k.poster_path}` : '',
        genre: 'Cinema'
      })) : []
    };
  }

  private static mapTMDBActorDetail(a: any, language: string = 'vi-VN'): Actor {
    const knownInfo = KNOWN_ACTORS_MAP[a.id.toString()];
    const isDirector = (a.known_for_department || '').toLowerCase().includes('directing');

    const rawCastFilms = a.movie_credits?.cast || [];
    const castFilms = rawCastFilms.filter((c: any) => !isSelfRole(c.character));
    const crewList = a.movie_credits?.crew || [];
    const crewFilms = crewList
      .filter((c: any) => {
        const j = (c.job || '').toLowerCase();
        const d = (c.department || '').toLowerCase();
        return j === 'director' || d === 'directing' || d === 'writing' || j.includes('screenplay') || j.includes('writer');
      })
      .map((c: any) => {
        const j = (c.job || '').toLowerCase();
        const d = (c.department || '').toLowerCase();
        const roleLabel = j === 'director' || d === 'directing' ? 'Đạo diễn' : 'Biên kịch';
        return { ...c, character: roleLabel };
      });

    const hasCast = castFilms.length > 0;
    const hasDirecting = crewList.some((c: any) => (c.job || '').toLowerCase() === 'director' || (c.department || '').toLowerCase() === 'directing');
    const hasWriting = crewList.some((c: any) => (c.department || '').toLowerCase() === 'writing' || (c.job || '').toLowerCase().includes('screenplay') || (c.job || '').toLowerCase().includes('writer'));

    const rolesSet = new Set<string>();
    const primaryDept = (a.known_for_department || 'Acting').toLowerCase();

    if (primaryDept.includes('directing') && hasDirecting) rolesSet.add('Directing');
    else if (primaryDept.includes('writing') && hasWriting) rolesSet.add('Writing');
    else if (hasCast) rolesSet.add('Acting');

    if (hasDirecting) rolesSet.add('Directing');
    if (hasWriting) rolesSet.add('Writing');
    if (hasCast) rolesSet.add('Acting');

    if (rolesSet.size === 0) {
      rolesSet.add(a.known_for_department || 'Acting');
    }

    const multiRolesStr = Array.from(rolesSet).join(' • ');

    const rawCombined = isDirector && crewFilms.length > 0 ? [...crewFilms, ...castFilms] : [...castFilms, ...crewFilms];
    const seenMovieIds = new Set<number>();
    const uniqueFilms: any[] = [];
    for (const f of rawCombined) {
      if (!seenMovieIds.has(f.id)) {
        seenMovieIds.add(f.id);
        uniqueFilms.push(f);
      }
    }

    const sortedCast = [...uniqueFilms].sort((f1, f2) => (f2.vote_count || 0) - (f1.vote_count || 0));

    const filmography = sortedCast.slice(0, 100).map((f: any) => {
      const rawImg = f.poster_path || f.backdrop_path;

      const mRoles: string[] = [];
      const crewForMovie = crewList.filter((c: any) => c.id === f.id);
      const isDir = crewForMovie.some((c: any) => (c.job || '').toLowerCase() === 'director' || (c.department || '').toLowerCase() === 'directing');
      const isWri = crewForMovie.some((c: any) => (c.department || '').toLowerCase() === 'writing' || (c.job || '').toLowerCase().includes('screenplay') || (c.job || '').toLowerCase().includes('writer'));
      const castItem = castFilms.find((c: any) => c.id === f.id);

      if (isDir) mRoles.push('Đạo diễn');
      if (isWri) mRoles.push('Biên kịch');
      if (castItem) {
        mRoles.push(castItem.character ? castItem.character : 'Diễn viên');
      }

      const roleSummary = mRoles.length > 0 ? mRoles.join(' • ') : (f.character || (isDirector ? 'Đạo diễn' : 'Chưa có dữ liệu'));

      return {
        id: f.id,
        title: f.title || f.original_title,
        original_title: f.original_title || f.title,
        year: f.release_date ? parseInt(f.release_date.split('-')[0], 10) : 0,
        character: roleSummary,
        vote_average: f.vote_average ? Math.round(f.vote_average * 10) / 10 : 0,
        poster_path: rawImg ? (rawImg.startsWith('http') ? rawImg : `https://image.tmdb.org/t/p/w300${rawImg}`) : '',
        genre: resolveGenre(f.genre_ids)
      };
    });

    const dynamicLandmarks = sortedCast
      .filter((f) => f.title || f.original_title)
      .slice(0, 5)
      .map((f) => {
        const year = f.release_date ? f.release_date.split('-')[0] : '';
        const title = f.title || f.original_title;
        return year ? `${title} (${year})` : title;
      });

    const landmark_works =
      knownInfo?.landmark_works ||
      (dynamicLandmarks.length > 0 ? dynamicLandmarks : undefined);

    const validYears = castFilms
      .map((f: any) => (f.release_date ? parseInt(f.release_date.split('-')[0], 10) : null))
      .filter((y: any): y is number => y !== null && !isNaN(y) && y > 1930);
    const dynamicDebutYear = validYears.length > 0 ? Math.min(...validYears) : undefined;

    const dynamicHighestGrossing = sortedCast[0]
      ? `${sortedCast[0].title || sortedCast[0].original_title}`
      : undefined;

    const estimatedBoxOffice = knownInfo?.total_box_office;

    const awards = knownInfo?.awards || [];

    const deathday = a.deathday || undefined;
    const endYear = deathday ? parseInt(deathday.split('-')[0], 10) : new Date().getFullYear();
    const yearsActive = dynamicDebutYear ? Math.max(1, endYear - dynamicDebutYear + 1) : null;

    const birthPart = a.birthday ? `sinh ngày ${a.birthday}` : '';
    const placePart = a.place_of_birth ? `tại ${a.place_of_birth}` : '';
    const worksList = landmark_works && landmark_works.length > 0 ? landmark_works.slice(0, 5).join(', ') : '';

    const isEn = language.startsWith('en');
    let enrichedBio = '';

    if (isEn) {
      const bDayStr = a.birthday ? `born ${a.birthday}` : '';
      const bPlaceStr = a.place_of_birth ? `in ${a.place_of_birth}` : '';
      const activeStr = dynamicDebutYear
        ? (deathday ? `active from ${dynamicDebutYear} to ${endYear} (${yearsActive} years)` : `active from ${dynamicDebutYear} to present (${yearsActive} years)`)
        : '';
      const boxOfficeEn = knownInfo?.total_box_office
        ? knownInfo.total_box_office.replace('Tỷ USD', 'Billion USD').replace('Tr USD', 'Million USD')
        : '';

      const introEn = `${a.name} (${bDayStr} ${bPlaceStr}) was ${activeStr}. Across their career, ${a.name} starred in over ${castFilms.length} film and television productions with an estimated total box office of ${boxOfficeEn}.`.replace(/\s+/g, ' ').trim();

      const cleanRawBio = (a.biography || '').trim();
      if (cleanRawBio && cleanRawBio.length > 50) {
        enrichedBio = `${introEn}\n\n${cleanRawBio}`;
      } else {
        enrichedBio = `${introEn}\n\n${a.name} is widely acclaimed by critics and audiences worldwide for versatile acting performances and iconic screen roles.`;
      }
    } else {
      const deathYearStr = deathday ? deathday.split('-')[0] : '';
      const activeSpanStr = dynamicDebutYear
        ? (deathday ? `từ năm ${dynamicDebutYear} đến năm ${deathYearStr} (${yearsActive} năm hoạt động)` : `từ năm ${dynamicDebutYear} đến nay (${yearsActive} năm hoạt động)`)
        : '';
      const boxOfficeStr = knownInfo?.total_box_office || estimatedBoxOffice;
      const isDirectorBio = (a.known_for_department || '').toLowerCase().includes('directing');
      const isWriterBio = (a.known_for_department || '').toLowerCase().includes('writing');

      const p1 = isDirectorBio
        ? `${a.name} ${birthPart} ${placePart}, chính thức dấn thân vào con đường nghệ thuật ${activeSpanStr}. Tính đến nay, ${a.name} đã chỉ đạo nghệ thuật và thực hiện hơn ${uniqueFilms.length} tác phẩm điện ảnh lớn nhỏ với tổng doanh thu phòng vé ấn tượng đạt ${boxOfficeStr}.`.replace(/\s+/g, ' ').trim()
        : isWriterBio
        ? `${a.name} ${birthPart} ${placePart}, chính thức dấn thân vào con đường nghệ thuật ${activeSpanStr}. Tính đến nay, ${a.name} đã sáng tạo kịch bản cho hơn ${uniqueFilms.length} tác phẩm điện ảnh lớn nhỏ với tổng doanh thu phòng vé ấn tượng đạt ${boxOfficeStr}.`.replace(/\s+/g, ' ').trim()
        : `${a.name} ${birthPart} ${placePart}, chính thức dấn thân vào con đường nghệ thuật ${activeSpanStr}. Tính đến nay, ${a.name} đã gia nhập dàn diễn viên của hơn ${uniqueFilms.length} tác phẩm điện ảnh lớn nhỏ với tổng doanh thu phòng vé ấn tượng đạt ${boxOfficeStr}.`.replace(/\s+/g, ' ').trim();

      const p2 = worksList
        ? isDirectorBio
          ? `Sự nghiệp đạo diễn của ${a.name} ghi dấu ấn đậm nét qua các kiệt tác chỉ đạo điện ảnh đình đám như ${worksList}.`.replace(/\s+/g, ' ').trim()
          : isWriterBio
          ? `Sự nghiệp biên kịch của ${a.name} ghi dấu ấn đậm nét qua các kịch bản xuất sắc trong những dự án đình đám như ${worksList}.`.replace(/\s+/g, ' ').trim()
          : `Sự nghiệp của ${a.name} ghi dấu ấn đậm nét qua các vai diễn biểu tượng trong những dự án đình đám như ${worksList}.`.replace(/\s+/g, ' ').trim()
        : '';

      const existingBioVi = knownInfo?.biography_vi;
      if (existingBioVi && existingBioVi.length > 40) {
        enrichedBio = `${p1}\n\n${existingBioVi}${p2 ? `\n\n${p2}` : ''}`;
      } else {
        const p3 = isDirectorBio
          ? `${a.name} được giới chuyên môn và khán giả đánh giá cao nhờ tư duy đạo diễn độc đáo, phong cách dàn dựng ấn tượng và tầm nhìn điện ảnh vượt thời gian.`
          : isWriterBio
          ? `${a.name} được giới chuyên môn và khán giả đánh giá cao nhờ tư duy kịch bản sắc bén, chiều sâu tâm lý nhân vật và những câu chuyện điện ảnh đầy sức hút.`
          : `${a.name} được giới chuyên môn và khán giả đánh giá cao nhờ lối diễn xuất tự nhiên, khả năng làm chủ cảm xúc và sự xả thân hết mình cho từng khung hình. Sự tận tụy với nghề cùng tư duy nghệ thuật sắc bén đã giúp ${a.name} trở thành một trong những gương mặt điện ảnh hàng đầu.`;
        enrichedBio = `${p1}\n\n${p2 ? `${p2}\n\n` : ''}${p3}`;
      }
    }

    return {
      id: a.id,
      name: a.name,
      original_name: a.original_name || a.name,
      profile_path: a.profile_path ? `https://image.tmdb.org/t/p/w500${a.profile_path}` : '',
      birthday: a.birthday || knownInfo?.birthday || '',
      deathday,
      place_of_birth: a.place_of_birth || knownInfo?.place_of_birth || '',
      nationality: inferNationality(a.place_of_birth || knownInfo?.place_of_birth, knownInfo?.nationality, sortedCast),
      height: '1.75 m',
      debut_year: dynamicDebutYear,
      known_for_department: multiRolesStr || a.known_for_department || 'Acting',
      acting_style: knownInfo?.acting_style || 'Phương pháp diễn xuất dấn thân và biến hóa đa dạng qua nhiều thể loại.',
      total_box_office: knownInfo?.total_box_office || estimatedBoxOffice,
      highest_grossing_movie: knownInfo?.highest_grossing_movie || dynamicHighestGrossing,
      landmark_works,
      biography: enrichedBio,
      biography_vi: enrichedBio,
      awards,
      filmography
    };
  }

  static async getUniverseContent(
    universeId: string,
    mediaType: string = 'all',
    page: number = 1,
    language: string = 'vi-VN'
  ): Promise<{ results: any[]; page: number; total_pages: number }> {
    try {
      const UNIVERSE_PARAMS: Record<string, { movieKw?: number; tvKw?: number; company?: number }> = {
        mcu: { movieKw: 180547, company: 420 },
        dc: { movieKw: 242407, company: 128064 },
        starwars: { movieKw: 161176, company: 1 },
        monsterverse: { movieKw: 263548, company: 923 }
      };

      const params = UNIVERSE_PARAMS[universeId.toLowerCase()] || UNIVERSE_PARAMS.mcu;
      let movies: any[] = [];
      let tvShows: any[] = [];
      let totalPages = 1;

      if (mediaType === 'all' || mediaType === 'movie') {
        const movieRes = await this.getAxiosClient().get('/discover/movie', {
          params: {
            language,
            page,
            sort_by: 'primary_release_date.desc',
            with_keywords: params.movieKw,
            with_companies: params.company
          }
        });
        if (movieRes.data && movieRes.data.results) {
          movies = movieRes.data.results.map((m: any) => ({
            ...this.mapTMDBMovie(m),
            media_type: 'movie'
          }));
          totalPages = Math.max(totalPages, movieRes.data.total_pages || 1);
        }
      }

      if (mediaType === 'all' || mediaType === 'tv') {
        const tvRes = await this.getAxiosClient().get('/discover/tv', {
          params: {
            language,
            page,
            sort_by: 'first_air_date.desc',
            with_keywords: params.tvKw || params.movieKw,
            with_companies: params.company
          }
        });
        if (tvRes.data && tvRes.data.results) {
          tvShows = tvRes.data.results.map((t: any) => ({
            id: t.id,
            title: t.name || t.original_name,
            original_title: t.original_name,
            release_date: t.first_air_date || '',
            poster_path: t.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : '',
            backdrop_path: t.backdrop_path ? `https://image.tmdb.org/t/p/w1280${t.backdrop_path}` : '',
            vote_average: t.vote_average ? Math.round(t.vote_average * 10) / 10 : 0,
            overview: t.overview || '',
            media_type: 'tv'
          }));
          totalPages = Math.max(totalPages, tvRes.data.total_pages || 1);
        }
      }

      const combined = [...movies, ...tvShows].sort(
        (a, b) => new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime()
      );

      return {
        results: combined,
        page,
        total_pages: Math.min(totalPages, 500)
      };
    } catch (err) {
      console.warn(`[TMDB API Error] getUniverseContent failed for ${universeId}: ${(err as Error).message}`);
      return { results: [], page: 1, total_pages: 1 };
    }
  }
}