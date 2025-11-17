import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  resultCount: number;
  totalCount: number;
}

export const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  resultCount, 
  totalCount 
}: SearchBarProps) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources by title, program, or uploader..."
          className="pl-10 pr-10 text-sm sm:text-base"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {resultCount} resource{resultCount !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
          {resultCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSearch}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
};