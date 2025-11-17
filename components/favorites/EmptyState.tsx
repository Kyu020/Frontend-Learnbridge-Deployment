import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type: string;
  onBrowse: () => void;
}

export const EmptyState = ({ type, onBrowse }: EmptyStateProps) => (
  <Card className="mx-4 sm:mx-0">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <Heart className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium text-foreground mb-2 text-center">
        No favorite {type} yet
      </p>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        {type === 'resources' 
          ? "Start exploring and save resources you like" 
          : "Find tutors you'd like to work with"}
      </p>
      <Link href={type === 'resources' ? "/resources" : "/tutors"}>
        <Button onClick={onBrowse}>
          Browse {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </Link>
    </CardContent>
  </Card>
);