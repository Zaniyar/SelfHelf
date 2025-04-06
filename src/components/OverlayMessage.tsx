interface OverlayMessageProps {
  message: string;
  isVisible: boolean;
}

export const OverlayMessage = ({ message, isVisible }: OverlayMessageProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 bottom-8 mx-auto w-fit bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2 text-sm animate-bounce">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}; 