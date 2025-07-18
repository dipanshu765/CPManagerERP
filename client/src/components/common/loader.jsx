import { useEffect, useState } from "react";

export default function Loader({ isLoading = true, text = "Loading..." }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl border-2 border-black/10">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated CP Logo */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            
            {/* Inner CP text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent animate-pulse">
                  CP
                </span>
                {/* Glowing effect */}
                <div className="absolute inset-0 text-2xl font-bold text-black/20 animate-ping">
                  CP
                </div>
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              CP Manager ERP
            </h3>
            <p className="text-sm text-gray-600 font-mono">
              {text}{dots}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-black to-gray-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing loading states
export function useLoader(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const showLoader = (text) => {
    setIsLoading(text || true);
  };
  
  const hideLoader = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    showLoader,
    hideLoader,
    Loader: ({ text }) => <Loader isLoading={isLoading} text={text} />
  };
}