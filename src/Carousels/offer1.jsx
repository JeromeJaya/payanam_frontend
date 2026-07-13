export default function OfferCard({ title, text, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/50 dark:to-slate-900/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:shadow-2xl hover:border-blue-400/40 transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{text}</p>
          {subtitle && <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-5 4h18" />
          </svg>
        </div>
      </div>
    </div>
  );
}