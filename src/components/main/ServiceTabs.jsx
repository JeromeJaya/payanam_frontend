import Category from "../category.jsx";
import buses from "../../assets/buses.png";
import flight from "../../assets/flight.png";

export default function ServiceTabs({ activeService, onServiceChange }) {
  return (
    <div className="flex flex-row justify-center items-center gap-2 sm:gap-6 mb-6 sm:mb-0 sm:absolute sm:left-1/2 sm:-top-20 sm:-translate-x-1/2 bg-white/90 dark:bg-slate-800/95 sm:backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-1.5 sm:p-2 sm:shadow-md z-10">
      <Category
        icon={<img src={buses} alt="Buses" className="w-5 h-5 sm:w-6 sm:h-6 " />}
        title="Buses"
        onClick={() => onServiceChange('bus')}
        active={activeService === 'bus'}
      />
      <Category
        icon={<img src={flight} alt="Flights" className="w-5 h-5 sm:w-6 sm:h-6 " />}
        title="Flights"
        onClick={() => onServiceChange('flight')}
        active={activeService === 'flight'}
      />
    </div>
  );
}
