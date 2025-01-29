import { useEffect, useState } from "react";
import { useLocation } from "react-router"


const MovieStream = () => {
  const location = useLocation();
  const [tmdbdId, setTmdbId] = useState(location.state.tmdbId);

  const [server, setServer] = useState(false)

  useEffect(() => {
    
    const id: string = location.state.tmdbId;
    setTmdbId(id)

  }, [])
  



  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {server ? 'VidLink' : 'VidSrc'}
          </span>
          <div className="relative">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={server}
              onChange={() => setServer(!server)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>
      <div className="relative w-full aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={server ? `https://vidlink.pro/movie/${tmdbdId}` : `https://vidsrc.icu/embed/movie/${tmdbdId}`}
          title="Movie Stream"
          allowFullScreen
        />
      </div>
    </div>

  )
}

export default MovieStream
