
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./Pages/Home"
import TvStream from "./Pages/TvStream"
import MovieStream from "./Pages/MovieStream"
import { ModeToggle } from "./components/mode-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./components/ui/button"



const App = () => {
  return (
    
    <Router>
      <div className="flex justify-center p-10 space-x-3">
      <ModeToggle/>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>premium</Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Ads</AlertDialogTitle>
            <AlertDialogDescription>
           Install the <strong>uBlock Origin</strong> extension on your browser to block intrusive ads and improve your browsing experience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction><a  target="blank" href="https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/">install</a></AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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