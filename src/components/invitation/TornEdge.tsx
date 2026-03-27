"use client";

interface TornEdgeProps {
  position?: 'top' | 'bottom';
  className?: string;
  color?: string;
}

export default function TornEdge({ position = 'top', className = '', color = 'fill-background' }: TornEdgeProps) {
  return (
    <div className={`absolute left-0 w-full h-6 z-20 pointer-events-none ${position === 'top' ? 'top-[-1px]' : 'bottom-[-1px] rotate-180'} ${className}`}>
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className={`w-full h-full ${color}`}
      >
        <path d="M0,0 L1200,0 L1200,100 C1150,85 1100,115 1050,100 C1000,85 950,115 900,100 C850,85 800,115 750,100 C700,85 650,115 600,100 C550,85 500,115 450,100 C400,85 350,115 300,100 C250,85 200,115 150,100 C100,85 50,115 0,100 Z" />
      </svg>
    </div>
  );
}
