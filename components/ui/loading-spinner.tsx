// components/ui/loading-spinner.tsx
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary" | "destructive";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  variant = "default",
  className,
  text,
  fullScreen = false
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4"
  };

  const variantClasses = {
    default: "border-gray-300 border-t-gray-600",
    primary: "border-blue-200 border-t-blue-600",
    secondary: "border-gray-200 border-t-gray-600",
    destructive: "border-red-200 border-t-red-600"
  };

  const spinner = (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullScreen && "min-h-screen",
      className
    )}>
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className="mt-3 text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  );

  return spinner;
};

// Convenience components for common use cases
export const PageLoader = () => (
  <LoadingSpinner 
    size="lg" 
    text="Loading..." 
    fullScreen 
    className="min-h-[400px]"
  />
);

export const ButtonLoader = () => (
  <LoadingSpinner size="sm" variant="primary" />
);

export const CardLoader = () => (
  <LoadingSpinner size="md" text="Loading content..." />
);