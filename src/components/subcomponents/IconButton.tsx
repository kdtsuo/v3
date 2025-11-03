import { LucideIcon } from "lucide-react";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  size?: number;
  className?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`flex items-center gap-2 p-2 rounded ${className || ""}`}
        {...props}
      >
        <Icon size={size} />
        {label && <span>{label}</span>}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
