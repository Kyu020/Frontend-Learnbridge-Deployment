import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp } from "lucide-react";
import { Resource, Tutor } from "@/interfaces/dashboard.interfaces";


interface StatsSectionProps {
    resources: Resource[];
    tutors: Tutor[];
}

export const StatsSection = ({ resources, tutors }: StatsSectionProps) => {
    const totalFavorites = resources.reduce((acc, resource) => acc + (resource.favoriteCount || 0), 0);

    return (
              <div className="mb-8 lg:mb-12 hidden lg:block">
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{tutors.length}</p>
                  <p className="text-sm text-muted-foreground">Available Tutors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalFavorites}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}