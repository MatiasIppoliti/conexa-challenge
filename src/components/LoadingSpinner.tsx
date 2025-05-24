interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin`}></div>
        <div className={`absolute inset-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20 animate-pulse`}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
      </div>
      
      {message && (
        <p className="mt-4 text-gray-600 text-center animate-pulse">
          {message}
        </p>
      )}
      
      <div className="mt-2 text-xs text-gray-400 text-center">
        🛸 Traveling through dimensions...
      </div>
    </div>
  );
}; 