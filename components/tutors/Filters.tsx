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
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row - Search and Filter Label */}
          <div className="flex items-center justify-between">
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

          {/* Filter Controls - Horizontal Layout */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
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

            {/* Price Range Select */}
            <div className="w-full sm:w-48">
              <Label className="text-sm block">Price Range</Label>
              <Select value={priceRange} onValueChange={onPriceRangeChange}>
                <SelectTrigger className="text-sm mt-1">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">₱200-₱400/hr</SelectItem>
                  <SelectItem value="medium">₱400-₱750/hr</SelectItem>
                  <SelectItem value="high">₱750+/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {resultCount} of {totalCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};