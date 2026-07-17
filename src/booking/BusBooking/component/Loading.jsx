import Nav from "../../../NavComponent.jsx";
import {ShieldCheck} from "lucide-react"

export function Loading() {
     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-20">
            <Nav />
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 5rem)' }}>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Animated outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-lime-200 dark:border-lime-800 animate-ping opacity-75"></div>
                {/* Animated middle ring */}
                <div className="absolute inset-2 rounded-full border-4 border-t-lime-600 border-r-transparent border-b-lime-600 border-l-transparent animate-spin"></div>
                {/* Inner circle with icon */}
                <div className="absolute inset-4 rounded-full bg-lime-500 flex items-center justify-center animate-pulse">
                  <ShieldCheck size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 animate-pulse">Preparing Your Booking</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Please wait while we secure your seats...</p>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
            </div>
          </div>
}