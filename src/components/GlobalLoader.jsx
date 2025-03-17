import { useLoader } from "@/context/LoaderContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const GlobalLoader = () => {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className={cn(
            'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm'
        )}>
            <div className="p-4 rounded-lg bg-white shadow-lg flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-lg font-medium">Loading...</span>
            </div>
        </div>
    );
};

export default GlobalLoader;
