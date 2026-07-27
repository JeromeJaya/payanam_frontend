export default function SearchButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full sm:flex-1 min-w-[140px] h-[44px] md:h-[54px] bg-lime-600 hover:bg-lime-700 text-white font-bold tracking-wide rounded-lg uppercase transition-colors shadow-inner text-sm md:text-base"
    >
      Search
    </button>
  );
}
