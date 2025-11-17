import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onUploadClick: () => void;
  onClearSearch: () => void;
}

export const EmptyState = ({ searchQuery, onUploadClick, onClearSearch }: EmptyStateProps) => {
  return (
    <div className="col-span-full text-center py-8 sm:py-12">
      <div className="text-4xl sm:text-6xl mb-4">📚</div>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
        {searchQuery ? "No matching resources found" : "No resources found"}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-4">
        {searchQuery 
          ? "Try adjusting your search terms or browse all resources."
          : "No resources have been uploaded yet. Be the first to share!"
        }
      </p>
      {searchQuery ? (
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={onClearSearch}
          size="sm"
        >
          Clear Search
        </Button>
      ) : (
        <Button 
          className="gap-2 mt-2"
          onClick={onUploadClick}
          size="sm"
        >
          <Upload className="h-4 w-4" /> 
          Upload First Resource
        </Button>
      )}
    </div>
  );
};