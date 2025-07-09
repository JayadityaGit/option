import { Link } from "react-router"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../firebase/firebase"
import LoginButton from "./LoginButton"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
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
import { Crown, Heart, LogOut, Home } from "lucide-react"
import { useEffect, useState } from "react"

const Header = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="flex items-center justify-between p-6">
      {/* Left side - Navigation and User section */}
      <div className="flex items-center gap-3">
        {/* Home Link */}
        <Link to="/">
          <Button
            variant="ghost"
            size="default"
            className="gap-2 h-10 px-4 transition-all duration-200 bg-background/50 hover:bg-accent/80"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Home</span>
          </Button>
        </Link>

        {user ? (
          <>
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL || "/placeholder.svg"}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-white">
                  {user.displayName?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            {/* Favorites Button */}
            <Link to="/favorites">
              <Button
                variant="ghost"
                size="default"
                className="gap-2 h-10 px-4 transition-all duration-200 bg-background/50 hover:bg-accent/80"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Favorites</span>
              </Button>
            </Link>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="default"
              className="gap-2 h-10 px-4 text-muted-foreground hover:text-destructive transition-all duration-200 bg-background/50 hover:bg-accent/80"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Sign out</span>
            </Button>
          </>
        ) : (
          <LoginButton />
        )}
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground transition-all duration-200 bg-background/50 hover:bg-accent/80"
            >
              <Crown className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Ads</AlertDialogTitle>
              <AlertDialogDescription>
                Install the <strong>uBlock Origin</strong> extension on your browser to block intrusive ads and improve
                your browsing experience.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en"
                >
                  Install for Chrome
                </a>
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/"
                >
                  Install for Firefox
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  )
}

export default Header
