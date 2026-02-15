import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { TVShow, Movie } from '../types/entType'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import FavoriteButton from '../components/FavoriteButton'
import AdblockDialog from '@/components/AdblockDialog'

const TvStream = () => {
    const location = useLocation()
    const tmdbId = location.state.tmdbId
    const [server, setServer] = useState(false)
    const [season, setSeason] = useState(1)
    const [ep, setEp] = useState(1)
    const [tvShowDetails, setTvShowDetails] = useState<Movie | null>(null) // Store as Movie type
    const [tvShowSeasons, setTvShowSeasons] = useState<TVShow | null>(null) // Store seasons separately
    const [currentEpisodes, setCurrentEpisodes] = useState<any[]>([]) // For episodes name
    const [isAdblockDialogOpen, setIsAdblockDialogOpen] = useState(
        !localStorage.getItem('dontRemindAdblock'),
    )

    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
    }

    useEffect(() => {
        async function getTvDetails() {
            const url = `https://api.themoviedb.org/3/tv/${tmdbId}`
            try {
                const response = await fetch(url, options)
                const data = await response.json()
                // Construct Movie object for FavoriteButton
                setTvShowDetails({
                    id: data.id,
                    title: data.name, // TV shows use 'name' instead of 'title'
                    name: data.name,
                    poster_path: data.poster_path,
                    release_date: data.first_air_date, // TV shows use 'first_air_date'
                    first_air_date: data.first_air_date,
                    media_type: 'tv',
                })
                setTvShowSeasons(data) // Set full TVShow data for seasons
            } catch (error) {
                console.error('Error fetching TV details:', error)
            }
        }
        getTvDetails()
    }, [tmdbId])

    // NEW: Effect to fetch episode names whenever the season changes
    useEffect(() => {
        async function getSeasonDetails() {
            const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${season}`
            try {
                const response = await fetch(url, options)
                const data = await response.json()
                setCurrentEpisodes(data.episodes || [])
            } catch (error) {
                console.error('Error fetching season details:', error)
            }
        }
        getSeasonDetails()
    }, [tmdbId, season])

    const handleServerChange = () => {
        setServer(!server)
    }

    return (
        <div className='w-full max-w-7xl mx-auto px-4 space-y-8'>
            <div className='flex justify-end mb-4'>
                {tvShowDetails && <FavoriteButton item={tvShowDetails} />}
                <label className='inline-flex items-center cursor-pointer ml-4'>
                    <span className='mr-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        {server ? 'VidLink' : 'VidSrc'}
                    </span>
                    <div className='relative'>
                        <input
                            type='checkbox'
                            className='sr-only peer'
                            checked={server}
                            onChange={handleServerChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </div>
                </label>
            </div>
            <div className='relative w-full aspect-video'>
                <iframe
                    src={
                        server
                            ? `https://vidlink.pro/tv/${tmdbId}/${season}/${ep}`
                            : `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${ep}`
                    }
                    allowFullScreen
                    className='absolute top-0 left-0 w-full h-full rounded-lg'
                />
            </div>

            {tvShowSeasons && tvShowSeasons.seasons && (
                <div className='w-full'>
                    <Tabs defaultValue={`Season${1}`} className='w-full'>
                        <ScrollArea className='w-full pb-4'>
                            <TabsList className='w-full justify-start sm:mb-4 lg:mt-0'>
                                {tvShowSeasons.seasons.map((s) => (
                                    <TabsTrigger
                                        key={s.season_number}
                                        value={`Season${s.season_number}`}
                                        className='min-w-[100px]'
                                        onClick={() => {
                                            setEp(1)
                                            setSeason(s.season_number)
                                        }}
                                    >
                                        Season {s.season_number}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation='horizontal' />
                        </ScrollArea>

                        {tvShowSeasons.seasons.map((s) => (
                            <TabsContent
                                key={s.season_number}
                                value={`Season${s.season_number}`}
                                className='sm:mt-3 lg:mt-0'
                            >
                                <ScrollArea className='h-[50vh] md:h-80 w-full rounded-md border'>
                                    <div className='p-4'>
                                        <h4 className='mb-4 text-sm font-semibold leading-none '>
                                            {`Dr. S, you're watching Episode ${ep}`}
                                        </h4>
                                        <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                                            {Array.from({ length: s.episode_count }, (_, i) => {
                                                const epNumber = i + 1
                                                // Find the name for this specific episode
                                                const epName = currentEpisodes.find(
                                                    (e) => e.episode_number === epNumber,
                                                )?.name

                                                return (
                                                    <div key={i} className='space-y-2'>
                                                        <Button
                                                            variant='outline'
                                                            className={`w-full h-auto py-3 px-4 flex flex-col items-start gap-1 text-left ${ep === epNumber ? 'border-blue-500 bg-blue-500/10' : ''}`}
                                                            onClick={() => {
                                                                setSeason(s.season_number)
                                                                setEp(epNumber)
                                                            }}
                                                        >
                                                            <span className='text-[10px] uppercase font-bold opacity-50'>
                                                                Episode {epNumber}
                                                            </span>
                                                            <span className='text-sm font-medium truncate w-full'>
                                                                {epName || `Episode ${epNumber}`}
                                                            </span>
                                                        </Button>
                                                        <Separator className='sm:hidden' />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            )}
            <AdblockDialog
                open={isAdblockDialogOpen}
                onOpenChange={setIsAdblockDialogOpen}
            />
        </div>
    )
}

export default TvStream
