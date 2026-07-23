export default function PriceLockBanner({ onLoginClick }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            Still unsure about this trip? <span className="text-teal-600 dark:text-teal-400">Lock this price!</span>
          </p>
        </div>
      </div>
      <button
        onClick={onLoginClick}
        className="bg-white dark:bg-slate-700 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
      >
        LOGIN NOW
      </button>
    </div>
  );
}
