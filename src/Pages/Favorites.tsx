import { useState, useEffect } from "react";
import { auth, firestore } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Movie } from "../types/entType";
import Cards from "../myComp/Cards";

const Favorites = () => {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    if (user) {
      const userFavoritesRef = collection(firestore, "users", user.uid, "favorites");
      const unsubscribe = onSnapshot(userFavoritesRef, (querySnapshot) => {
        const favs = querySnapshot.docs.map((doc) => doc.data() as Movie);
        setFavorites(favs);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl text-center my-8">Your Favorites</h1>
      {favorites.length > 0 ? (
        <Cards results={favorites} isFavoritesPage={true} />
      ) : (
        <p className="text-center">You have no favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;
