import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Search, BookOpen, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Schedule Session",
    description: "Book with a tutor",
    href: "/tutors",
    icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />,
    color: "bg-blue-100 text-blue-600",
    borderColor: "hover:border-blue-200"
  },
  {
    title: "Find Tutor",
    description: "Browse experts",
    href: "/tutors",
    icon: <Search className="h-5 w-5 sm:h-6 sm:w-6" />,
    color: "bg-green-100 text-green-600",
    borderColor: "hover:border-green-200"
  },
  {
    title: "Browse Resources",
    description: "Explore materials",
    href: "/resources",
    icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />,
    color: "bg-purple-100 text-purple-600",
    borderColor: "hover:border-purple-200"
  },
  {
    title: "My Favorites",
    description: "Saved items",
    href: "/favorites",
    icon: <Heart className="h-5 w-5 sm:h-6 sm:w-6" />,
    color: "bg-red-100 text-red-600",
    borderColor: "hover:border-red-200"
  },
];

export const QuickActions = () => {
  const { toast } = useToast();

  const handleQuickActionClick = (action: string) => {
    toast({
      title: "Navigation",
      description: `Taking you to ${action}`,
    });
  };

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {quickActions.map((action) => (
        <Link 
          key={action.title} 
          href={action.href} 
          className="col-span-2 lg:col-span-1"
        >
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${action.borderColor} h-full`}
            onClick={() => handleQuickActionClick(action.title.toLowerCase())}
          >
            <CardContent className="flex items-center gap-3 p-3 sm:p-4 lg:p-6 h-full">
              <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${action.color} flex-shrink-0`}>
                {action.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm sm:text-base truncate">
                  {action.title}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};