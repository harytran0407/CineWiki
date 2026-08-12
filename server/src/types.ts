export interface Award {
  id: string;
  name: string;
  category: string;
  year: number;
  movie_title: string;
  status: 'won' | 'nominated';
  source?: string;
}

export interface FilmographyItem {
  id: number;
  title: string;
  original_title?: string;
  year: number;
  character: string;
  vote_average: number;
  poster_path: string;
  genre: string;
  box_office_milestone?: string;
}

export interface Actor {
  id: number;
  name: string;
  original_name?: string;
  profile_path: string;
  birthday: string;
  place_of_birth?: string;
  nationality?: string;
  height?: string;
  debut_year?: number;
  known_for_department: string;
  biography: string;
  biography_vi?: string;
  acting_style?: string;
  total_box_office?: string;
  highest_grossing_movie?: string;
  landmark_works?: string[];
  awards?: Award[];
  filmography: FilmographyItem[];
  upcoming_movies?: {
    id: number;
    title: string;
    character: string;
    release_date: string;
    poster_path: string;
    status: string;
  }[];
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  title_vi?: string;
  origin_country?: string[] | string;
  original_language?: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  director: string;
  writer?: string;
  studio?: string;
  vote_average: number;
  vote_count: number;
  imdb_score?: number;
  weighted_rating?: number;
  rotten_tomatoes?: {
    tomatometer: number;
    audience_score: number;
  };
  metacritic_score?: number;
  budget?: string;
  box_office?: string;
  overview: string;
  overview_vi?: string;
  technical_highlights?: {
    cinematography?: string;
    music?: string;
    vfx?: string;
  };
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }[];
  awards?: {
    name: string;
    category: string;
    year: number;
  }[];
  trailer_url?: string;
}

export interface ActorComparison {
  actorA: Actor;
  actorB: Actor;
  shared_movies: {
    id: number;
    title: string;
    year: number;
    characterA: string;
    characterB: string;
    poster_path: string;
    vote_average: number;
  }[];
  stats: {
    actorA_avg_rating: number;
    actorB_avg_rating: number;
    actorA_total_movies: number;
    actorB_total_movies: number;
    actorA_career_years: number;
    actorB_career_years: number;
    actorA_major_awards: string;
    actorB_major_awards: string;
    actorA_box_office: string;
    actorB_box_office: string;
    genre_distribution: {
      genre: string;
      actorA_count: number;
      actorB_count: number;
    }[];
  };
}

export interface GraphNode {
  id: string | number;
  name: string;
  group?: number;
  val?: number;
  profile_path?: string;
}

export interface GraphLink {
  source: any;
  target: any;
  movie_title?: string;
  shared_count?: number;
  shared_movies?: string[];
}

export interface ActorNetwork {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Notification {
  id: string;
  user_id?: string;
  target_id?: string | number;
  actor_id: number;
  actor_name: string;
  actor_profile: string;
  title: string;
  message?: string;
  content?: string;
  content_vi?: string;
  created_at: string;
  is_read: boolean;
  type: 'movie' | 'award' | 'event' | 'new_movie' | 'birthday';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  followed_actor_ids?: number[];
}

export interface Follow {
  user_id: string;
  actor_id: number;
  followed_at?: string;
}
