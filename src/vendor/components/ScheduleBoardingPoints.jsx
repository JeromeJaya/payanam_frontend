export default function ScheduleBoardingPoints({
  scheduleFormData,
  addBoardingPoint,
  addDroppingPoint,
  updateBoardingPoint,
  updateDroppingPoint,
}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-bold text-slate-700">Boarding Points</label>
          <button type="button" onClick={addBoardingPoint} className="text-xs font-bold text-lime-600 hover:text-lime-700">+ Add Point</button>
        </div>
        {scheduleFormData.boardingPoints.map((point, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
            <input type="text" placeholder="City" value={point.city} onChange={(e) => updateBoardingPoint(index, "city", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Name" value={point.name} onChange={(e) => updateBoardingPoint(index, "name", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Time (HH:mm)" value={point.time} onChange={(e) => updateBoardingPoint(index, "time", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Address" value={point.address} onChange={(e) => updateBoardingPoint(index, "address", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Landmark" value={point.landmark} onChange={(e) => updateBoardingPoint(index, "landmark", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-bold text-slate-700">Dropping Points</label>
          <button type="button" onClick={addDroppingPoint} className="text-xs font-bold text-lime-600 hover:text-lime-700">+ Add Point</button>
        </div>
        {scheduleFormData.droppingPoints.map((point, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
            <input type="text" placeholder="City" value={point.city} onChange={(e) => updateDroppingPoint(index, "city", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Name" value={point.name} onChange={(e) => updateDroppingPoint(index, "name", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Time (HH:mm)" value={point.time} onChange={(e) => updateDroppingPoint(index, "time", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Address" value={point.address} onChange={(e) => updateDroppingPoint(index, "address", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
            <input type="text" placeholder="Landmark" value={point.landmark} onChange={(e) => updateDroppingPoint(index, "landmark", e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
          </div>
        ))}
      </div>
    </>
  );
}
