import { useState, useEffect } from "react";
import { Movie } from "../types/entType";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

interface CardsProps {
  results: Movie[];
}

const Cards = ({ results }: CardsProps) => {
  const navigate = useNavigate();

  // State to track loaded images
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Function to handle navigation on click
  function handleClick(id: number, mediatype: string) {
    if (mediatype === "tv") {
      navigate("/tv", {
        state: {
          tmdbId: id,
          entType: mediatype,
        },
      });
    } else {
      navigate("/movie", {
        state: {
          tmdbId: id,
        },
      });
    }
  }

  // Handle image load success
  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id)); // Add the movie ID to the set of loaded images
  };

  // Reset loaded images only when results change significantly
  useEffect(() => {
    // Optionally you can clear loaded images if you want to reset for new search queries
    // setLoadedImages(new Set()); // Uncomment this if you want to reset on a fresh search
  }, [results]); // Trigger the effect whenever `results` change

  return (
<div className="grid place-items-center gap-4 grid-cols-2 md:grid-cols-4 px-6 mx-auto max-w-screen-md">
  {results
    .filter((movie) => movie.media_type === "tv" || movie.media_type === "movie")
    .map((movie) => {
      const imageUrl = `${import.meta.env.VITE_IMAGE}${movie.poster_path}`;
      const isImageLoaded = loadedImages.has(movie.id); // Check if the image is already loaded

      return (
        <div
          key={movie.id}
          className="cursor-pointer"
          onClick={() => handleClick(movie.id, movie.media_type)}
        >
          <div className="relative w-40 h-64">
            {/* Skeleton Placeholder - it will be shown briefly */}
            {!isImageLoaded && (
              <div className="absolute inset-0">
                <Skeleton className="h-full w-full rounded-xl bg-gray-300" />
                {/* Overlay Title and Dates */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 text-sm text-gray-700">
                  <p className="font-semibold">{movie.title}</p>
                  <p>
                    {movie.release_date
                      ? `Release: ${movie.release_date}`
                      : movie.first_air_date
                      ? `First Air: ${movie.first_air_date}`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Image */}
            <img
              src={imageUrl}
              alt={`${movie.title}`}
              className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(movie.id)}
            />
          </div>
        </div>
      );
    })}
</div>


  );
};

export default Cards;
