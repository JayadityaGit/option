
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./components/ui/placeholders-and-vanish-input";

import Draw from "./components/ui/Draw";
import { FlipWords } from "./components/ui/flip-words";
import { BackgroundLines } from "./components/ui/background-lines";


interface Movie {
  backdrop_path: string | null;
  id: number;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  origin_country?: string[];
  video: boolean;
}

interface MovieResponse {
  page: number;
  results: Movie[];
}




const App = () => {



  const [ent, setEnt] = useState<Movie[]>([]);
  const [tmdbId, setTmbdId] = useState(0);
  const [drawerState, setDrawer] = useState(false)
  const [resultType, setResultType] = useState("")


  async function fetchMovieDetails(query: string) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${apiKey}`,
      },
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: MovieResponse = await response.json();

      setEnt(data.results)
     
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }

  const placeholders = [
    "Dr. S is ready to watch—what's next?",
    "Movies or series? Dr. S is exploring now!",
    "Dr. S’s next favorite is just a click away.",
    "What will Dr. S stream today?",
    "Dr. S is in the mood for a story—pick one!",
    "Epic shows await Dr. S!"
  ];
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     fetchMovieDetails(e.target.value)
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const words = [


    "peacemaker",
    "healer",
    "uplifter",
    "inspiration",
    "never give up",
    "zomato",
    "bully"

  ];

  return (

    <div>
      
      <div className="h-[20rem] flex flex-col justify-center items-center px-3">
        <BackgroundLines>
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl font-sans py-5 md:py-10 relative z-20 font-bold tracking-tight">
        You are the <FlipWords words={words} />Dr.S 
        </h2>
        
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        </BackgroundLines>
      </div>
      

      
      {
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4 p-4">
        {ent
      .filter((movie) => movie.media_type === "tv" || movie.media_type === "movie")
      .map((movie) => (
        <div
          key={movie.id}
          className="relative group overflow-hidden rounded-lg shadow-lg"
          onClick={() => {
            setDrawer(true);
            setTmbdId(movie.id);
            setResultType(movie.media_type);
          }}
        >
          <img
            src={"http://image.tmdb.org/t/p/w185" + movie.poster_path}
            alt={"Nothing to see here researcher"}
            className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-semibold">
            {movie.title}
          </div>
        </div>
      ))
    }
      </div>
      }

  <Draw isDrawerOpen={drawerState} tmdbId={tmdbId} searchMode={resultType} onClickDrawer={()=>{setDrawer(false)}} />


  </div>




  )
}

export default App