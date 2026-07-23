import { MicVocal, MicOff } from "lucide-react";

export default function SearchActionButtons({ onSearch, onMic, isListening }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={onSearch}
        className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-semibold py-2.5 px-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wide"
      >
        Search
      </button>

      <button
        onClick={onMic}
        className={`flex items-center justify-center gap-2 font-semibold py-2.5 px-6 rounded-lg transition-all text-sm uppercase tracking-wide border-2 text-white
          ${isListening
            ? 'bg-rose-600 border-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.7)] animate-pulse'
            : 'bg-slate-900 border-slate-900 hover:bg-rose-600 hover:border-rose-600 shadow-[0_0_15px_rgba(15,23,42,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)]'
          }`}
      >
        {isListening ? <MicOff /> : <MicVocal />}
      </button>
    </div>
  );
}
