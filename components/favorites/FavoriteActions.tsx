import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";

interface FavoriteActionsProps {
  onRemove: () => void;
  isRemoving: boolean;
}

export const FavoriteActions = ({ onRemove, isRemoving }: FavoriteActionsProps) => (
  <div className="absolute top-3 right-3 z-10 flex gap-2">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
    >
      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
    </Button>
    <Button
      size="icon"
      variant="secondary"
      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={onRemove}
      disabled={isRemoving}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </div>
);