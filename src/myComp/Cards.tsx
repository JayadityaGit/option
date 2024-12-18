import { useState } from "react";
import { Movie } from "../types/entType";
import { useNavigate } from "react-router";

interface CardsProps{
    results: Movie[],

}


const Cards = ({results}: CardsProps) => {

  function handleClick(id: number, mediatype: string) {


    if (mediatype == "tv") {
      navigate("/tv", {state: {
        tmdbId : id,
        entType : mediatype
      }})
    }
    else{
      navigate("/movie", {state: {
        tmdbId: id
      }})
    }
  }

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="grid place-items-center gap-4 grid-cols-2 md:grid-cols-4 px-6 mx-auto max-w-screen-md">

      
    {results
        .filter((movie) => movie.media_type === "tv" || movie.media_type === "movie")
        .map((movie) => (
          <div
            key={movie.id}
            className=""
            onClick={()=>handleClick(movie.id, movie.media_type)}
          >
            <img
              src={`https://curly-hill-2443.winter-queen-2f83.workers.dev/image${movie.poster_path}`}
              alt={"Nothing to see here researcher"}
              className={`h-64 rounded-xl transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
            />
    </div>
  ))
}


  </div>
  )
}

export default Cards