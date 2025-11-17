import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import { Resource } from '@/interfaces/resources.interfaces';
import { useToast } from '@/hooks/use-toast';

interface ResourceCardProps {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (resourceId: string) => void;
  isUpdatingFavorite?: boolean;
  onRecordView?: (resourceId: string) => void;
}

export const ResourceCard = ({ 
  resource, 
  isFavorite, 
  onToggleFavorite, 
  isUpdatingFavorite = false,
  onRecordView
}: ResourceCardProps) => {
  const { toast } = useToast();
  const favoriteCount = resource.favoriteCount || 0;

  const handleViewFile = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      // Record the resource interaction by calling the getfile endpoint
      if (onRecordView) {
        await onRecordView(resource._id);
      }
      
      toast({
        title: "Opening file",
        description: `Opening ${resource.title}`,
      });
      
      // The file URL should come from the API response after recording the view
      // For now, we'll use the existing googleDriveLink
      if (resource.googleDriveLink) {
        window.open(resource.googleDriveLink, '_blank', 'noopener,noreferrer');
      } else {
        toast({
          title: "Error",
          description: "No file link available",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error recording resource view:', error);
      toast({
        title: "Error",
        description: "Failed to record view, but opening file...",
        variant: "destructive"
      });
      // Still open the file even if recording fails
      if (resource.googleDriveLink) {
        window.open(resource.googleDriveLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const truncateCourse = (course: string, maxLength: number = 20) => {
    if (course.length <= maxLength) return course;
    return course.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 flex flex-col h-full border-2 hover:border-blue-200 min-w-0">
      <CardContent className="p-4 sm:p-6 flex flex-col flex-grow min-w-0">
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-3 gap-2 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2 flex-1 min-w-0 break-words">
              {resource.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {favoriteCount > 0 && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500 flex-shrink-0" />
                  <span>{favoriteCount}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(resource._id)}
                disabled={isUpdatingFavorite}
                className={`h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 ${
                  isFavorite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
                />
              </Button>
            </div>
          </div>
          
        <div className="mb-3 flex flex-wrap gap-1">
            <Badge 
                variant="secondary" 
                className="text-xs max-w-full truncate flex-shrink-0"
                title={resource.course}
            >
                {resource.course.length > 50 ? 
                resource.course.substring(0, 50) + '...' : 
                resource.course
                }
            </Badge>
        </div>
          
          
          {(resource.uploader || resource.uploaderName) && (
            <div className="flex items-center gap-2 mb-3 min-w-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {(resource.uploaderName || resource.uploader || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground truncate flex-1 min-w-0">
                Uploaded by {resource.uploaderName || resource.uploader || 'Unknown'}
              </span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mb-4">
            Added {new Date(resource.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-auto text-xs sm:text-sm flex-shrink-0"
          onClick={handleViewFile}
        >
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mr-2" />
          <span className="truncate">View File</span>
        </Button>
      </CardContent>
    </Card>
  );
};