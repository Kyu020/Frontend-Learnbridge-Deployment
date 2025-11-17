// components/tutors/EmptyState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  searchQuery: string;
  onClearFilters: () => void;
}

export const EmptyState = ({ searchQuery, onClearFilters }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-8 sm:p-12 text-center">
        <div className="text-4xl sm:text-6xl mb-4">👨‍🏫</div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          {searchQuery ? "No tutors found" : "No tutors available"}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
          {searchQuery 
            ? "Try adjusting your search criteria or check back later for new tutors."
            : "No tutors are currently registered. Check back later!"
          }
        </p>
        {searchQuery && (
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            size="sm"
          >
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};