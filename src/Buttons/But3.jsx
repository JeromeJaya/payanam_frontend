export function But3({ text = "HVHDBDVBSZDCBZDJS", className = "", ...props }) {
  return (
    <button 
      {...props} 
      className={`px-20 py-3 bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none transition-all duration-200 ${className}`}
    >
      {text}
    </button>
  );
}
