import { ButtonHTMLAttributes } from "react";

interface ChoiceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

const variantClasses = {
  1: "bg-choice-1 hover:bg-choice-1/90 text-primary-foreground",
  2: "bg-choice-2 hover:bg-choice-2/90 text-primary-foreground",
  3: "bg-choice-3 hover:bg-choice-3/90 text-primary-foreground",
  4: "bg-choice-4 hover:bg-choice-4/90 text-primary-foreground",
};

export function ChoiceButton({ 
  variant = 1, 
  children, 
  className = "", 
  ...props 
}: ChoiceButtonProps) {
  return (
    <button
      className={`
        choice-button
        w-full py-4 px-6 
        rounded-2xl 
        font-display font-semibold text-lg md:text-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center justify-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-base">
          {variant}
        </span>
        <span className="flex-1 text-left">{children}</span>
      </span>
    </button>
  );
}
