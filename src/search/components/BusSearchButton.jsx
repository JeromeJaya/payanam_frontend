export default function BusSearchButton({
  passengerCount,
  searchData,
}) {
  const hasPassenger = passengerCount || searchData?.NoOfSeats;

  return (
    <div className="flex gap-1.5 items-stretch w-full lg:w-auto">
      <button
        type="submit"
        className={`rounded-xl bg-sky-500 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-700 active:bg-sky-700 dark:active:bg-sky-800 text-white font-extrabold text-xs md:text-sm tracking-wider transition-all shadow-sm px-4 uppercase shrink-0 flex items-center justify-center ${hasPassenger ? 'flex-1 md:flex-initial lg:w-32' : 'w-full lg:w-32 py-2.5 lg:py-0'}`}
      >
        Search
      </button>
    </div>
  );
}
