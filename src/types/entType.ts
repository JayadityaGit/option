export interface Movie {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  release_date: string;
  first_air_date: string;
  media_type: "movie" | "tv";
}

export interface MovieResponse {
  results: Movie[];
}

export interface TVShow {
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
}
