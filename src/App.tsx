import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./Pages/Home";
import TvStream from "./Pages/TvStream";
import MovieStream from "./Pages/MovieStream";
import Favorites from "./Pages/Favorites";
import Header from "./components/Header"; // Import the Header component

const App = () => {
  return (
    <Router>
      <Header />
      <div className="pt-16"> {/* Add padding-top to account for sticky header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tv" element={<TvStream />} />
          <Route path="/movie" element={<MovieStream />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

