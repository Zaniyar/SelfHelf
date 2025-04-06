interface OverlayMessageProps {
  message: string;
  isVisible: boolean;
}

export const OverlayMessage = ({ message, isVisible }: OverlayMessageProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center space-x-2 animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}; 