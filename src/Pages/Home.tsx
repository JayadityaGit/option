import { useState } from "react";
import { Movie, MovieResponse } from "../types/entType";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { FlipWords } from "../components/ui/flip-words";
import Cards from "../myComp/Cards";




const Home = () => {

    const [ent, setEnt] = useState<Movie[]>([]);
  
    async function fetchMovieDetails(query: string) {
      const url = `https://curly-hill-2443.winter-queen-2f83.workers.dev/search/multi?query=${query}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
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
    };
  
    const words = [
      "peacemaker",
      "healer",
      "uplifter",
      "never give up",
      "zomato mailer",
      "bully",
      "well wisher"
  
    ];

  return (  
      <div className="h-screen">
        
        <div className="h-[20rem] flex flex-col justify-center  items-center px-4">
          
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl font-sans py-5 md:py-10 relative z-20 font-bold tracking-tight">
          the <FlipWords words={words}/>
          </h2>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>

        
        
        <Cards resutls={ent}/>
    </div>
  )
}

export default Home