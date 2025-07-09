"use client"

import { useState, useEffect } from "react"
import type { Movie } from "../types/entType"
import { useNavigate } from "react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { auth, firestore } from "../firebase/firebase"
import { doc, setDoc, collection, deleteDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, HeartOff, Check, X } from "lucide-react"

interface CardsProps {
  results: Movie[]
  isFavoritesPage?: boolean
}

const Cards = ({ results, isFavoritesPage = false }: CardsProps) => {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)

  // State to track loaded images
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    type: "success" as "success" | "error",
  })

  // Function to handle navigation on click
  function handleClick(id: number, mediatype: string) {
    if (mediatype === "tv") {
      navigate("/tv", {
        state: {
          tmdbId: id,
          entType: mediatype,
        },
      })
    } else {
      navigate("/movie", {
        state: {
          tmdbId: id,
        },
      })
    }
  }

  // Handle image load success
  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }

  const showSuccessModal = (title: string, description: string) => {
    setModalContent({
      title,
      description,
      type: "success",
    })
    setShowModal(true)
  }

  const showErrorModal = (title: string, description: string) => {
    setModalContent({
      title,
      description,
      type: "error",
    })
    setShowModal(true)
  }

  const handleAddToFavorites = async (movie: Movie) => {
    if (user) {
      try {
        const userFavoritesRef = collection(firestore, "users", user.uid, "favorites")
        await setDoc(doc(userFavoritesRef, movie.id.toString()), movie)
        showSuccessModal("Added to Favorites!", `${movie.title || movie.name} has been added to your favorites list.`)
      } catch (error) {
        showErrorModal("Error", "Failed to add to favorites. Please try again.")
      }
    }
  }

  const handleDeleteFromFavorites = async (movieId: number) => {
    if (user) {
      try {
        const userFavoritesRef = collection(firestore, "users", user.uid, "favorites")
        await deleteDoc(doc(userFavoritesRef, movieId.toString()))
        showSuccessModal("Removed from Favorites", "The item has been removed from your favorites list.")
      } catch (error) {
        showErrorModal("Error", "Failed to remove from favorites. Please try again.")
      }
    }
  }

  // Reset loaded images only when results change significantly
  useEffect(() => {
    // Optionally you can clear loaded images if you want to reset for new search queries
    // setLoadedImages(new Set()); // Uncomment this if you want to reset on a fresh search
  }, [results])

  return (
    <>
      <div className="grid place-items-center gap-4 grid-cols-2 md:grid-cols-4 px-6 mx-auto max-w-screen-md">
        {results
          .filter((movie) => movie.media_type === "tv" || movie.media_type === "movie")
          .map((movie) => {
            const imageUrl = `${import.meta.env.VITE_IMAGE}${movie.poster_path}`
            const isImageLoaded = loadedImages.has(movie.id)

            return (
              <div key={movie.id} className="cursor-pointer">
                <div className="relative w-40 h-64" onClick={() => handleClick(movie.id, movie.media_type)}>
                  {/* Skeleton Placeholder */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0">
                      <Skeleton className="h-full w-full rounded-xl bg-gray-300" />
                      {/* Overlay Title and Dates */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 text-sm text-gray-700">
                        <p className="font-semibold">{movie.media_type == "movie" ? movie.title : movie.name}</p>
                        <p>{movie.media_type}</p>
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
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${movie.title}`}
                    className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(movie.id)}
                  />
                </div>

                {/* Favorite Buttons */}
                {user && (
                  <div className="mt-3 flex justify-center">
                    {isFavoritesPage ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteFromFavorites(movie.id)
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200"
                      >
                        <HeartOff className="w-4 h-4" />
                        <span className="text-xs">Remove</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToFavorites(movie)
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-pink-600 border-pink-200 hover:bg-pink-50 hover:border-pink-300 dark:text-pink-400 dark:border-pink-800 dark:hover:bg-pink-950 dark:hover:border-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">Add to Favorites</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Success/Error Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {modalContent.type === "success" ? (
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              )}
              <DialogTitle className="text-lg font-semibold">{modalContent.title}</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {modalContent.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowModal(false)} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Cards
