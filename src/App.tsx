
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./Pages/Home"
import TvStream from "./Pages/TvStream"
import MovieStream from "./Pages/MovieStream"
import { ModeToggle } from "./components/mode-toggle"


const App = () => {
  return (
    
    <Router>
      <div className="flex justify-end p-10">
      <ModeToggle/>
      </div>
      <Routes>
      
        <Route path="/" element={<Home/>}/>
         <Route path="/tv" element={<TvStream/>}/>
         <Route path="/movie" element={<MovieStream/>}/>
        <Route/>
      </Routes>
    </Router>

  )
}

export default App