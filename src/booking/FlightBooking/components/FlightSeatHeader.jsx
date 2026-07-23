export default function FlightSeatHeader({ flight, activeTab, setActiveTab }) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {flight?.journey?.source?.split('(')[0]?.trim()} → {flight?.journey?.destination?.split('(')[0]?.trim()}
        </h1>
        <p className="text-sm text-gray-600">
          Select your preferred seats for this journey
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("seats")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "seats"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Seats
            </span>
          </button>
          <button
            onClick={() => setActiveTab("meals")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "meals"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Meals
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
