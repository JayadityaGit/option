import { useEffect, useState } from "react";
import Accordion from 'rsuite/Accordion';
import 'rsuite/Accordion/styles/index.css';
import { Button, Drawer } from "rsuite";
import 'rsuite/Drawer/styles/index.css';

interface myDrawerProps {
  isDrawerOpen: boolean;
  onClickDrawer: () => void;
  tmdbId: number;
  searchMode: string;
}

interface TVShow {
  adult: boolean;
  backdrop_path: string;
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  first_air_date: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  };
  name: string;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }>;
  next_episode_to_air: null | {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  };
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

const Draw = ({ isDrawerOpen, onClickDrawer, tmdbId, searchMode }: myDrawerProps) => {

  const [season, setSeason] = useState(1);
  const [ep, setEp] = useState(1);

  const [seasons, setSeasons] = useState<Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>>([]);

  useEffect(() => {
    async function getTvDetails() {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://curly-hill-2443.winter-queen-2f83.workers.dev/tv/${tmdbId}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
          `Bearer ${apiKey}`,

     }
      };

      try {
        const response = await fetch(url, options);
        const data: TVShow = await response.json();
        setSeasons(data.seasons || []); // Safely set seasons or empty array if undefined
      } catch (error) {
        console.error("Error fetching TV details:", error);
      }
    }

    if (tmdbId) {
      getTvDetails();
    }
  }, [tmdbId]);

  return (
<Drawer
  size="full"
  placement="bottom"
  open={isDrawerOpen}
  onClose={onClickDrawer}
  className="custom-drawer"
>
  <Drawer.Header>
    <Drawer.Title>Enjoy the Show Doctor!</Drawer.Title>
    <Drawer.Actions>
      <Button onClick={onClickDrawer}>Cancel</Button>
    </Drawer.Actions>
  </Drawer.Header>
  <Drawer.Body>
    {searchMode === "movie" ? (
      <div className="flex justify-center">
        <iframe
          src={`https://vidlink.pro/movie/${tmdbId}`}
          allowFullScreen
        ></iframe>
      </div>
    ) : (
      <div>

       <div className="flex justify-center">
       
          <iframe
            src={`https://vidlink.pro/tv/${tmdbId}/${season}/${ep}`}
            allowFullScreen
          ></iframe>

        </div> 
        
        <Accordion defaultActiveKey={1} bordered>
          {seasons.length > 0 ? (
            seasons.map((season) => (
              <Accordion.Panel
                key={season.id}
                header={`Season ${season.season_number}`}
                eventKey={season.id.toString()}
              >
                <div className="episodes-grid">
                  {Array.from({ length: season.episode_count }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setEp(index + 1);
                        setSeason(season.season_number);
                      }}
                      className="episode-button"
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </Accordion.Panel>
            ))
          ) : (
            <div>No seasons available.</div>
          )}
        </Accordion>
      </div>
    )}
  </Drawer.Body>
</Drawer>

  );
};

export default Draw;
