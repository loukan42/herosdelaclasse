import { ButtonHTMLAttributes } from "react";

interface ImageChoiceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  image: string;
  label: string;
}

export function ImageChoiceButton({ 
  image,
  label,
  className = "", 
  ...props 
}: ImageChoiceButtonProps) {
  return (
    <button
      className={`
        group relative w-full overflow-hidden rounded-2xl 
        shadow-lg hover:shadow-xl
        transition-all duration-300 hover:-translate-y-1
        focus:outline-none focus:ring-4 focus:ring-primary/50
        ${className}
      `}
      {...props}
    >
      <div className="aspect-[4/5] relative">
        <img 
          src={image} 
          alt={label}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="font-display font-bold text-white text-lg md:text-xl drop-shadow-lg">
            {label}
          </span>
        </div>
      </div>
    </button>
  );
}
