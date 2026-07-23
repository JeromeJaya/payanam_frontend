export default function PopularRoutes({ data, service }) {
  if (!data || data.length === 0) return null;

  if (service === "hotel") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{item.city}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.hotels} hotels</p>
            <p className="text-sm text-lime-600 dark:text-lime-400 font-semibold">Starting from {item.startingPrice}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
        >
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            {item.from} → {item.to}
          </div>
          <p className="text-sm text-lime-600 dark:text-lime-400 font-semibold">{item.price}</p>
        </div>
      ))}
    </div>
  );
}
