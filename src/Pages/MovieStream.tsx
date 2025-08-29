import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import FavoriteButton from "../components/FavoriteButton";
import { Movie } from "../types/entType";
import AdblockDialog from "@/components/AdblockDialog";

const MovieStream = () => {
  const location = useLocation();
  const tmdbId = location.state.tmdbId;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [server, setServer] = useState(true);
  const [isAdblockDialogOpen, setIsAdblockDialogOpen] = useState(
    !localStorage.getItem("dontRemindAdblock")
  );

  useEffect(() => {
    const id: string = location.state.tmdbId;

    async function getMovieDetails() {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/movie/${id}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      };

      try {
        const response = await fetch(url, options);
        const data: Movie = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    getMovieDetails();
  }, [tmdbId]);

  const handleServerChange = () => {
    const newServer = !server;
    setServer(newServer);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        {movie && <FavoriteButton item={{...movie, media_type: 'movie'}} />}
        <label className="inline-flex items-center cursor-pointer ml-4">
          <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {server ? "VidLink" : "VidSrc"}
          </span>
          <div className="relative">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={server}
              onChange={handleServerChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>
      <div className="relative w-full aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={server ? `https://vidlink.pro/movie/${tmdbId}` : `https://vidsrc.icu/embed/movie/${tmdbId}`}
          title="Movie Stream"
          allowFullScreen
        />
      </div>
      <AdblockDialog open={isAdblockDialogOpen} onOpenChange={setIsAdblockDialogOpen} />
    </div>
  );
};

export default MovieStream;
