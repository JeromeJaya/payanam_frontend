import {useState, useRef} from "react";
import {useNavigate} from "react-router-dom"
export default function SearchBar({ input, service }) {
    console.log(service)

  const navigate = useNavigate();

  let s = input?.length || 0;
  const cols = Math.min(Math.max(s, 1), 4);
  let inputRef = useRef({});
  const today = new Date().toISOString().split("T")[0];
  const day =  String(new Date()).slice(0,3)
  console.log(day)

  const handleSearch = () => {
    const formData = {};
    Object.keys(inputRef.current).forEach((key) => {
      formData[key] = inputRef.current[key]?.value || "";
    });
    
    // Pass data through navigation state
    navigate("/busbooking", { state: { searchData: formData } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >

        {input.map((field, idx) => {
          const inputValue = field.type === "date" ? today : field.mid;
          const todayDay = field.type === "date" ? day : field.below;
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
                defaultValue={inputValue}
                ref = {(el)=> {inputRef.current[field.name] = el}}
              />
              <p className="text-gray-600 mt-1 text-sm">{todayDay}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end py-6 px-4 bg-gray-50">
        <button className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600
         text-white px-6 py-3 rounded-full text-lg font-semibold transition transform hover:-translate-y-0.5"
         onClick={handleSearch}>
          {`Search ${service ? service.charAt(0).toUpperCase() + service.slice(1) : 'Search'}`}
        </button>
      </div>
    </div>
  );
}