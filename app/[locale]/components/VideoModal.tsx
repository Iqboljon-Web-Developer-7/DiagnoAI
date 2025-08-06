import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    category: string;
  } | null;
}

export const VideoModal = ({ isOpen, onClose, video }: VideoModalProps) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-card">
        <DialogHeader className="flex flex-row items-center justify-between p-0">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {video.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <iframe
              src={video.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={video.title}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                {video.category}
              </span>
              {/* <span>{video.duration}</span> */}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};