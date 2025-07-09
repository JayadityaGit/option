import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { Button } from "./ui/button";
import { Movie } from "../types/entType";

interface FavoriteButtonProps {
  item: Movie;
}

const FavoriteButton = ({ item }: FavoriteButtonProps) => {
  const [user] = useAuthState(auth);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const userFavoritesRef = collection(firestore, "users", user.uid, "favorites");
      const unsub = onSnapshot(doc(userFavoritesRef, item.id.toString()), (doc) => {
        setIsFavorite(doc.exists());
      });
      return () => unsub();
    }
  }, [user, item.id]);

  const handleToggleFavorite = async () => {
    if (user) {
      const userFavoritesRef = collection(firestore, "users", user.uid, "favorites");
      if (isFavorite) {
        await deleteDoc(doc(userFavoritesRef, item.id.toString()));
      } else {
        await setDoc(doc(userFavoritesRef, item.id.toString()), item);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button onClick={handleToggleFavorite} variant={isFavorite ? "destructive" : "secondary"}>
      {isFavorite ? "Delete Favorite" : "Add to Favorites"}
    </Button>
  );
};

export default FavoriteButton;
