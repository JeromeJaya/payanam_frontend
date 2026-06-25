export default function Category({ icon, title, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={
        `flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all transform ` +
        (active
          ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg scale-105"
          : "hover:bg-gray-100 text-gray-700")
      }
    >
      <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
}