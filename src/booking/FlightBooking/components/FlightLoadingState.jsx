export default function FlightLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20 px-4">
      <div className="relative p-6 sm:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 shadow-2xl w-full max-w-sm sm:max-w-none">
        <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-sky-200 dark:border-slate-600 border-t-sky-600 dark:border-t-lime-500 border-r-transparent border-b-blue-400 dark:border-b-teal-500 border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-2 rounded-full border-3 border-blue-200 dark:border-slate-500 border-b-blue-600 dark:border-b-lime-400 border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 rounded-full border-2 border-sky-300 dark:border-slate-500 border-l-sky-600 dark:border-l-teal-400 border-r-transparent border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 dark:from-lime-500 dark:to-teal-500 animate-pulse shadow-lg shadow-sky-500/50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 text-center">
          <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-lime-400 dark:to-teal-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            Searching for Flights
          </h3>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-slate-400 font-medium mb-4 sm:mb-6">
            Finding the best flight options for you...
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-sky-600 dark:bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
              <div className="w-2.5 h-2.5 bg-sky-500 dark:bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }}></div>
              <div className="w-2.5 h-2.5 bg-sky-400 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-slate-700 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-sky-700 dark:text-slate-300 font-medium">Please wait a moment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
