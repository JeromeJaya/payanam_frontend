export default function BusLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-20">
      <div className="relative p-4 md:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 shadow-2xl">
        <div className="relative w-16 h-16 md:w-32 md:h-32 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-slate-600 border-t-blue-600 dark:border-t-lime-500 animate-spin"></div>
        </div>
        <div className="mt-4 md:mt-10 text-center">
          <h3 className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-lime-400 dark:to-teal-400 bg-clip-text text-transparent mb-1">
            Finding Best Bus Routes
          </h3>
          <p className="text-gray-600 dark:text-slate-400 font-medium text-xs md:text-lg">Searching for available buses...</p>
        </div>
      </div>
    </div>
  );
}
