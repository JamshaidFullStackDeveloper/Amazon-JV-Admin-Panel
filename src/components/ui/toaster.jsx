import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils"; // Utility for conditional classnames
import { useEffect, useState } from "react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant = "default", duration = 5000, ...props }) => (
        <CustomToast
          key={id}
          id={id}
          title={title}
          description={description}
          variant={variant}
          duration={duration}
          {...props}
        />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

function CustomToast({ id, title, description, variant, duration, ...props }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration]);

  const bgColor = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-600 text-white",
    default: "bg-gray-800 text-white",
  };

  return (
    <Toast className={cn("relative p-4 rounded-lg shadow-lg w-[400px]", bgColor[variant])} {...props}>
      <div className="grid gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>
      <ToastClose />

      {/* Progress Slider */}
      <div className="absolute bottom-0 left-0 h-1 bg-white" style={{ width: `${progress}%` }} />
    </Toast>
  );
}
