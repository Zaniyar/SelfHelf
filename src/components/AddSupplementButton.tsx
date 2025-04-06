interface AddSupplementButtonProps {
  onClick: () => void;
}

export const AddSupplementButton = ({ onClick }: AddSupplementButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-[#001830] border border-[#00ffff]/30 text-[#00ffff] rounded-full shadow-lg hover:bg-[#002040] focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:ring-offset-2 focus:ring-offset-[#000814] flex items-center justify-center text-3xl transition-all duration-200 hover:shadow-[#00ffff]/20 hover:shadow-xl"
    >
      +
    </button>
  );
}; 