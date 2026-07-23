export function But({text="hihgggggggggggggggggggg", color=500}){
    const colors ={
        50:"bg-emerald-50",
100:"bg-emerald-100",
200:"bg-emerald-200",
300:"bg-emerald-300",
400:"bg-emerald-400",
500:"bg-emerald-500",
600:"bg-emerald-600",
700:"bg-emerald-700",
800:"bg-emerald-800",
900:"bg-emerald-900",
950:"bg-emerald-950"
        
    }
    return(
 <button className={`relative px-6 py-3 ${colors[color]} text-white font-semibold rounded-lg`}>
  <span className="relative z-10">${text}</span>
  <div className={`absolute inset-0 ${colors[color]} opacity-0 group-hover:opacity-30 group-hover:animate-ping rounded-lg`}></div>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
</button>
    );
}