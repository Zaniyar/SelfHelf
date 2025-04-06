interface AddSupplementButtonProps {
  onClick: () => void;
}

export const AddSupplementButton = ({ onClick }: AddSupplementButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-3xl"
    >
      +
    </button>
  );
}; 