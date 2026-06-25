export function Banner({title, text, onClick}) {
    return (
        <div className="max-w-sm mx-auto duration-500 group overflow-hidden relative rounded bg-neutral-800 text-neutral-50 p-4 flex flex-col justify-evenly">
  <div className="absolute blur duration-500 group-hover:blur-none w-72 h-72 rounded-full group-hover:translate-x-12 group-hover:translate-y-12 bg-sky-50 right-1 -bottom-24"></div>
  <div className="absolute blur duration-500 group-hover:blur-none w-12 h-12 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 bg-lime-700 right-12 bottom-12"></div>
  <div className="absolute blur duration-500 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 bg-lime-800 right-1 -top-12"></div>
  <div className="absolute blur duration-500 group-hover:blur-none w-24 h-24 bg-sky-700 rounded-full group-hover:-translate-x-12"></div>
  <div className="z-10 flex flex-col justify-evenly w-full h-full">
    <span className="text-2xl font-bold">{title}</span>
    <p>{text}</p>
    <button className="hover:bg-neutral-200 bg-neutral-50 rounded text-neutral-800 font-extrabold w-full p-3" onClick={onClick}>
      Book Now
    </button>
  </div>
</div>

    );
}