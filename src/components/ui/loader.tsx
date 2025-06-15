
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "dots" | "pulse" | "spin"
  className?: string
  text?: string
}

export function Loader({ 
  size = "md", 
  variant = "default", 
  className,
  text 
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} 
             style={{ animationDelay: "0ms" }} />
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} 
             style={{ animationDelay: "150ms" }} />
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} 
             style={{ animationDelay: "300ms" }} />
        {text && (
          <span className={cn("ml-3 text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "bg-primary rounded-full animate-pulse-slow", 
          sizeClasses[size]
        )} />
        {text && (
          <span className={cn("ml-3 text-muted-foreground animate-pulse", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <span className={cn("ml-3 text-muted-foreground", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  )
}

// Componente de loading overlay
export function LoadingOverlay({ 
  isLoading, 
  text = "Cargando...", 
  children 
}: { 
  isLoading: boolean
  text?: string
  children: React.ReactNode 
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <Loader size="lg" text={text} variant="spin" />
        </div>
      )}
    </div>
  )
}
