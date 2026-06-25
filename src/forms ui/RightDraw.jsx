export function RightDraw(){
    return(
        <div className="relative w-full h-[600px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-inner flex">
  <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-[2px] z-10"></div>
  <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-20 flex flex-col border-l border-gray-100 dark:border-gray-800">
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Event</h3>
      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <div className="p-6 flex-1 overflow-y-auto">
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Name <span className="text-red-500">*</span></label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500" placeholder="e.g. Annual Design Conference" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea rows="4" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500" placeholder="Briefly describe the event..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
            <input type="time" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input type="radio" name="type" className="text-lime-500 focus:ring-lime-500" checked />
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">Online Event</div>
                <div className="text-xs text-gray-500">Virtual meeting with a link</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input type="radio" name="type" className="text-lime-500 focus:ring-lime-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">In-person</div>
                <div className="text-xs text-gray-500">Physical location required</div>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
    <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
      <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
      <button className="px-4 py-2 bg-lime-500 text-gray-900 font-medium rounded-lg hover:bg-lime-600 transition-colors shadow-sm shadow-lime-500/20">Create Event</button>
    </div>
  </div>
</div>
    );
}