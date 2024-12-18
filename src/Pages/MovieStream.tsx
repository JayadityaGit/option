import { useEffect, useState } from "react";
import { useLocation } from "react-router"


const MovieStream = () => {
  const location = useLocation();
  const [tmdbdId, setTmdbId] = useState(location.state.tmdbId);

  useEffect(() => {
    
    const id: string = location.state.tmdbId;
    setTmdbId(id)

  }, [])
  



  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative w-full aspect-video">
        <iframe
          src={`https://vidlink.pro/movie/${tmdbdId}`}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>

  )
}

export default MovieStream