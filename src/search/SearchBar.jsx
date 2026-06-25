import {useState, useRef} from "react";
import {useNavigate} from "react-router-dom"
export default function SearchBar({ input, service }) {
    console.log(service)
  const [departure, setDeparture] = useState("");
  const [travellers, setTravellers] = useState("");
  const [stateFrom, setSateFrom] = useState("");
  const [stateTo, setStateTo] = useState("");
  const [cityFrom, setCityFrom] = useState("");
  const [checkin, setCheckin]= useState("");
  const [checkout, setCheckOut] = useState("");
  const [guest, setGuest] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay]= useState("Monday");
  const [month, setMonth] =useState("january");
  const [tarinClass, setTrainClass]= useState("SL");
  const [noOfSeat, setNumberOfSeat] = useState("0");


  const navigate = useNavigate();

  let s = input?.length || 0;
  const cols = Math.min(Math.max(s, 1), 4);
  let inputRef = useRef({});
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >

        {input.map((field, idx) => {
          return (
            <div
              key={idx}
              className={`p-4 ${idx < s - 1 ? 'border-r border-gray-200' : ''}`}
            >
              <p className="text-gray-500 text-sm">{field.label}</p>
              <input
                className="w-full mt-2 text-2xl font-semibold bg-transparent outline-none"
                placeholder={field.mid}
                type={field.type || 'text'}
                defaultValue={field.mid}
                ref = {(el)=> {inputRef.current[field.name] = el}}
              />
              <p className="text-gray-600 mt-1 text-sm">{field.below}</p>
            </div>
          );
        })}
        {/* Journey Date */}
        

        {/* Bus Type */}
        {/* <div className="p-4">
          <p className="text-gray-500 text-sm">
            Bus Type
          </p>

          <h3 className="text-2xl font-bold">
            AC Sleeper
          </h3>

          <p className="text-gray-600">
            Luxury Bus
          </p>
        </div> */}

      </div>

      <div className="flex justify-end py-6 px-4 bg-gray-50">
        <button className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600
         text-white px-6 py-3 rounded-full text-lg font-semibold transition transform hover:-translate-y-0.5"
         onClick ={()=>navigate("/busbooking")}>
          {`Search ${service ? service.charAt(0).toUpperCase() + service.slice(1) : 'Search'}`}
        </button>
      </div>
    </div>
  );
}