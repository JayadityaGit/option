import { useState } from "react";
import { Movie, MovieResponse } from "../types/entType";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { FlipWords } from "../components/ui/flip-words";
import Cards from "../myComp/Cards";
import meme from "@/assests/meme.gif";
import { PinContainer } from "@/components/ui/3d-pin";

const Home = () => {
  const [ent, setEnt] = useState<Movie[]>([]);

  async function fetchMovieDetails(query: string) {
    const url = `${import.meta.env.VITE_MULTI_SEARCH}?query=${query}`;
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
      setEnt(data.results);
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
    "Epic shows await Dr. S!",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchMovieDetails(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const words = [
    "peacemaker",
    "healer",
    "never give up",
    "suspected zomato mailer",
    "suspected your dost mailer",
    "suspected bully",
    "well wisher",
  ];

  return (
<div className="h-screen">
  <div className="h-[10rem] md:h-[20rem] flex flex-col justify-center px-4">
    <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl font-sans py-5 md:py-10 relative z-20 font-bold tracking-tight">
      <FlipWords words={words} />
    </h2>
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
    />
  </div>

  {ent.length > 0 ? (
    <Cards results={ent} />
  ) : (
    <div className="flex justify-center p-5 md:p-0">
      <PinContainer
        title="whatever happens ... happens, love u :)"
        href="https://www.youtube.com/watch?v=2B_odZRtgf8"
      >
        <div className="flex flex-col items-center justify-center w-[15rem] md:w-[20rem]  h-auto">
          <img
            src={meme}
            alt="the meme is loading"
            className="object-contain rounded-lg max-h-[15rem] sm:max-h-[18rem] md:max-h-[20rem]"
          />
        </div>
      </PinContainer>
    </div>
  )}
</div>

  );
};

export default Home;
