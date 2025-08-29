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

interface AdblockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdblockDialog = ({ open, onOpenChange }: AdblockDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default AdblockDialog;
