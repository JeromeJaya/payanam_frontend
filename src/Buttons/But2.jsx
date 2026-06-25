export function But2({text="sample", mt=3, color="green", size}){
    const colors = {
  red: "bg-red-400 dark:bg-red-300",
  blue: "bg-blue-400 dark:bg-blue-300",
  green: "bg-green-400 dark:bg-green-300",
  yellow: "bg-yellow-400 dark:bg-yellow-300",
};
//     const colors ={
//         50:"bg-emerald-50",
// 100:"bg-emerald-100 dark:bg-emerald-100",
// 200:"bg-emerald-200 dark:bg-emerald-200",
// 300:"bg-emerald-300 dark:bg-emerald-300"
//     }
    return (
<button className={`w-full mt-${mt} px-5 py-2.5 ${colors[color]} text-black font-black text-lg border-4 border-black rounded-lg shadow-[0.1em_0.1em_0px_0px_black] hover:shadow-[0.15em_0.15em_0px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[0.05em_0.05em_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150 cursor-pointer dark:bg-${colors[color]}-300 dark:text-gray-900`}>
  {text}
</button>
    );
}
// className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"