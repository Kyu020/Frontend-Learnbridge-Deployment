// components/tutors/Filters.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
  showMobileFilters?: boolean;
  onMobileFiltersToggle?: () => void;
}

export const Filters = ({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  resultCount,
  totalCount,
  showMobileFilters,
  onMobileFiltersToggle
}: FiltersProps) => {
  return (
    <>
      {/* Mobile Filters Toggle */}
      {onMobileFiltersToggle && (
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={onMobileFiltersToggle}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      )}

      {/* Filters Sidebar - SIMPLIFIED: Remove all conditional display logic */}
      <Card className="sticky top-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Search & Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-sm">Search Tutors</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or subject..."
                  className="pl-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm">Price Range</Label>
              <Select value={priceRange} onValueChange={onPriceRangeChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under ₱50/hr</SelectItem>
                  <SelectItem value="medium">₱50-₱100/hr</SelectItem>
                  <SelectItem value="high">₱100+/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {resultCount} of {totalCount} tutors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};