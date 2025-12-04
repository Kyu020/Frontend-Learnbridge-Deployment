import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink } from "lucide-react";
import { FavoriteItem, FavoriteResource } from "@/interfaces/favorites.interfaces";
import { FavoriteActions } from "./FavoriteActions";

interface ResourceCardProps {
  favorite: FavoriteItem;
  onRemove: (id: string, tutorId?: string, resourceId?: string) => void;
  onView: (resource: FavoriteResource) => void;
  isRemoving: boolean;
}

export const ResourceCard = ({ favorite, onRemove, onView, isRemoving }: ResourceCardProps) => (
  <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg w-full">
    <FavoriteActions
      onRemove={() => onRemove(favorite._id, undefined, favorite.resourceId)}
      isRemoving={isRemoving}
    />
    
    <CardContent className="p-4">
      <div className="mb-2">
        <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">
          {favorite.resource?.title || "Untitled Resource"}
        </h3>
      </div>
      
      <div className="mb-3">
        {favorite.resource?.program && (
          <Badge variant="secondary" className="text-xs mb-2">
            {favorite.resource.program}
          </Badge>
        )}
        {favorite.resource?.uploader && (
          <p className="text-xs text-muted-foreground">
            Uploaded by {favorite.resource.uploader}
          </p>
        )}
      </div>
      
      <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Added {new Date(favorite.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <Button 
        className="w-full" 
        size="sm"
        onClick={() => favorite.resource && onView(favorite.resource)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        View Resource
      </Button>
    </CardContent>
  </Card>
);