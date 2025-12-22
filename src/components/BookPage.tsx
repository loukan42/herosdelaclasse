import { ReactNode } from "react";

interface BookPageProps {
  children: ReactNode;
  className?: string;
}

export function BookPage({ children, className = "" }: BookPageProps) {
  return (
    <div className={`book-page rounded-3xl p-6 md:p-8 lg:p-10 ${className}`}>
      {/* Paper texture overlay */}
      <div className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
             mixBlendMode: 'overlay'
           }} 
      />
      
      {/* Page edge effect */}
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-foreground/5 to-transparent rounded-r-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
