import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, Users, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Resource } from "@/interfaces/resources.interfaces"

interface ResourcesSectionProps {
    resources: Resource[];
}

export const ResourcesSection = ({ resources }: ResourcesSectionProps) => {
    const { toast } = useToast();

    const recommendedResources = resources.slice(0, 3);

    return (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Most Popular Resources</h2>
            <Link href="/resources">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs sm:text-sm"
                onClick={() => toast({
                  title: "Viewing all resources",
                  description: "Taking you to the resources page"
                })}
              >
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {resources.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground mb-1">No resources available</p>
                  <p className="text-sm text-muted-foreground">Check back later for study materials</p>
                </CardContent>
              </Card>
            ) : (
              recommendedResources.map((resource) => (
                <Card key={resource._id} className="transition-all hover:shadow-lg border hover:border-blue-200">
                  <CardContent className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">
                        {resource.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
                        {resource.course || "General"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {resource.uploader || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                          {resource.favoriteCount || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
    );
}