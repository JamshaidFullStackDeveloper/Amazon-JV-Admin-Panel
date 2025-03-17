import { useToast } from "@/hooks/use-toast";
import { createContext, useContext } from "react";
// import { useToast } from "@/components/ui/use-toast";
import ToastSound from '../assets/Login/ToastSound.mp3'
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const { toast } = useToast();

    const showToast = (message, type = "default") => {
        // Function to play notification sound
        const playSound = () => {
            const audio = new Audio(ToastSound); // Path to your sound file
            audio.play().catch((error) => console.error("Error playing sound:", error));
        };
        // playSound();
        toast({
            title: type === "success" ? "Success" : type === "error" ? "Error" : "Notification",
            description: message,
            variant: type, // "default", "destructive" (error), or custom styles
        });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useGlobalToast = () => useContext(ToastContext);
