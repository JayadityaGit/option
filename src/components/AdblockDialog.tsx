import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface AdblockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdblockDialog = ({ open, onOpenChange }: AdblockDialogProps) => {
  const [dontRemindAgain, setDontRemindAgain] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && dontRemindAgain) {
      localStorage.setItem("dontRemindAdblock", "true");
    }
    onOpenChange(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Ads</AlertDialogTitle>
          <AlertDialogDescription>
            Install the <strong>uBlock Origin</strong> extension on your browser to block intrusive ads and improve
            your browsing experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="dont-remind-again"
            checked={dontRemindAgain}
            onChange={(e) => setDontRemindAgain(e.target.checked)}
          />
          <label
            htmlFor="dont-remind-again"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Don't remind me again
          </label>
        </div>
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
  );
};

export default AdblockDialog;
