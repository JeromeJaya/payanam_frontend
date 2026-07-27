export default function SwapButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="p-1.5 md:p-2 text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 rounded-full transition-colors mx-[-4px] z-10 bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700"
      title="Swap Locations"
    >
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </button>
  );
}
