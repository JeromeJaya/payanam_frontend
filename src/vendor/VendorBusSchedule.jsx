import { ArrowLeft, Plus } from "lucide-react";
import ScheduleList from "./components/ScheduleList";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleBoardingPoints from "./components/ScheduleBoardingPoints";
import ScheduleActions from "./components/ScheduleActions";

export default function VendorBusSchedule({
  busSchedules,
  busSchedulesLoading,
  buses,
  busRoutes,
  busRoutesLoading,
  showScheduleForm,
  setShowScheduleForm,
  scheduleFormData,
  setScheduleFormData,
  scheduleLoading,
  scheduleSuccess,
  scheduleError,
  onFetchBusSchedules,
  onFetchBusRoutes,
  onScheduleSubmit,
  onCancelSchedule,
  onBack,
}) {
  const addBoardingPoint = () => {
    setScheduleFormData(prev => ({
      ...prev,
      boardingPoints: [...prev.boardingPoints, { city: "", name: "", address: "", time: "", landmark: "" }]
    }));
  };

  const addDroppingPoint = () => {
    setScheduleFormData(prev => ({
      ...prev,
      droppingPoints: [...prev.droppingPoints, { city: "", name: "", address: "", time: "", landmark: "" }]
    }));
  };

  const updateBoardingPoint = (index, field, value) => {
    setScheduleFormData(prev => ({
      ...prev,
      boardingPoints: prev.boardingPoints.map((point, i) => i === index ? { ...point, [field]: value } : point)
    }));
  };

  const updateDroppingPoint = (index, field, value) => {
    setScheduleFormData(prev => ({
      ...prev,
      droppingPoints: prev.droppingPoints.map((point, i) => i === index ? { ...point, [field]: value } : point)
    }));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Schedule Bus Trip</h3>
          <p className="text-sm text-slate-500">Create and manage bus schedules</p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="ml-auto flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Schedule
        </button>
      </div>

      <ScheduleList
        busSchedules={busSchedules}
        busSchedulesLoading={busSchedulesLoading}
        onFetchBusSchedules={onFetchBusSchedules}
        onCancelSchedule={onCancelSchedule}
      />

      {showScheduleForm && (
        <form onSubmit={onScheduleSubmit} className="space-y-6">
          <ScheduleForm
            scheduleFormData={scheduleFormData}
            setScheduleFormData={setScheduleFormData}
            scheduleSuccess={scheduleSuccess}
            scheduleError={scheduleError}
            onFetchBusRoutes={onFetchBusRoutes}
            buses={buses}
            busRoutes={busRoutes}
            busRoutesLoading={busRoutesLoading}
          />

          <ScheduleBoardingPoints
            scheduleFormData={scheduleFormData}
            addBoardingPoint={addBoardingPoint}
            addDroppingPoint={addDroppingPoint}
            updateBoardingPoint={updateBoardingPoint}
            updateDroppingPoint={updateDroppingPoint}
          />

          <ScheduleActions
            setShowScheduleForm={setShowScheduleForm}
            scheduleLoading={scheduleLoading}
          />
        </form>
      )}
    </>
  );
}
