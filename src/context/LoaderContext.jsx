import { createContext, useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

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

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
            <GlobalLoader />
        </LoaderContext.Provider>
    );
};

export default GlobalLoader;
