import { useEffect, useState } from "react";
import { useLocation } from "react-router"
import { TVShow } from "../types/entType";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";


const TvStream = () => {

    const location = useLocation()
    const tmdbId = location.state.tmdbId
    
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
    
      
          getTvDetails();
        
      }, []);
   

    
    
    
  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-8">
      {/* Video Container with responsive aspect ratio */}
      <div className="relative w-full aspect-video">
        <iframe
          src={`https://vidlink.pro/tv/${tmdbId}/${season}/${ep}`}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>

      {/* Season and Episode Selection */}
      <div className="w-full">
        <Tabs defaultValue={`Season${1}`} className="w-full">
          <ScrollArea className="w-full pb-4">
            <TabsList className="w-full justify-start">
              {seasons.map((season) => (
                <TabsTrigger
                  key={season.season_number}
                  value={`Season${season.season_number}`}
                  className="min-w-[100px]"
                >
                  Season {season.season_number}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {seasons.map((season) => (
            <TabsContent 
              key={season.season_number} 
              value={`Season${season.season_number}`}
            >
              <ScrollArea className="h-[50vh] md:h-72 w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    {season.name}
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: season.episode_count }, (_, i) => (
                      <div key={i} className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSeason(season.season_number)
                            setEp(i + 1)
                          }}
                        >
                          Episode {i + 1}
                        </Button>
                        <Separator className="sm:hidden" />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default TvStream