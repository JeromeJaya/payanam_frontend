import Nav from "../../NavComponent.jsx"
import WhereToWhere from "../../search/WhereToWhere.jsx"
import BusCard from "../../cards/BusCard.jsx"
import BusFillterBar from "../../filter/BusFillterBar.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import {useState, useEffect} from "react";
import { useLocation} from "react-router-dom";
import api from "../../api/axios.js"


export default function BusBooking(){

  const location = useLocation();
  const searchData = location.state?.searchData || {};
  const [from, setFrom] = useState(searchData.from || "");
  const [to, setTo] = useState(searchData.to || "");
  const [acFilter, setAcFilter] = useState("ALL");
  const [seatType, setSeatType] = useState("ALL");
  const [pickupTimeFilter, setPickupTimeFilter] = useState("ALL");
  const [dropTimeFilter, setDropTimeFilter] = useState("ALL");
  const [buses, setBuses] = useState([]);
  const [date, setDate] = useState(searchData.date || (() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  })());

  const getTimeMinutes = (timeValue) => {
    if (!timeValue) return null;
    const [hours, minutes] = String(timeValue).split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const matchesTimeRange = (timeValue, rangeLabel) => {
    if (rangeLabel === "ALL") return true;
    const minutes = getTimeMinutes(timeValue);
    if (minutes === null) return false;

    const ranges = {
      "12 AM - 6AM": [0, 360],
      "6 AM - 12 PM": [360, 720],
      "12 PM - 6 PM": [720, 1080],
      "6 PM - 12 AM": [1080, 1440],
    };

    const [start, end] = ranges[rangeLabel] || [0, 1440];
    return minutes >= start && minutes < end;
  };

  const handleFetchBus = async (
    selectedAc = acFilter,
    selectedSeatType = seatType,
    selectedPickupTime = pickupTimeFilter,
    selectedDropTime = dropTimeFilter
  ) => {
    try {
      const params = { from, to, date };
      if (selectedAc === "AC") params.isAC = "true";
      if (selectedAc === "NON-AC") params.isAC = "false";

      const res = await api.get("/api/v1/buses/search", { params });
      let results = res?.data?.data || [];

      if (selectedSeatType === "seater") {
        results = results.filter((schedule) =>
          schedule.busId?.busType?.toLowerCase().includes("seater")
        );
      } else if (selectedSeatType === "sleeper") {
        results = results.filter((schedule) =>
          schedule.busId?.busType?.toLowerCase().includes("sleeper")
        );
      }

      if (selectedPickupTime !== "ALL") {
        results = results.filter((schedule) =>
          matchesTimeRange(schedule.departureTime, selectedPickupTime)
        );
      }

      if (selectedDropTime !== "ALL") {
        results = results.filter((schedule) =>
          matchesTimeRange(schedule.arrivalTime, selectedDropTime)
        );
      }

      setBuses(results);
    } catch (err) {
      console.error(err);
      setBuses([]);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const initialFrom = searchData.from || from;
        const initialTo = searchData.to || to;
        const initialDate = searchData.date || date;
        const res = await api.get("/api/v1/buses/search", {
          params: { from: initialFrom, to: initialTo, date: initialDate },
        });
        setBuses(res?.data?.data || []);
        console.log(res)

      } catch (err) {
        console.error(err);
        setBuses([]);
      }
    };

    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(buses);
  return (
    <>
      <Nav />
      <div className="pt-16">
        <WhereToWhere
          className="shadow-xl sticky top-20"
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          date={date}
          setDate={setDate}
          searchData={searchData}
          handleFetchBus={handleFetchBus}
        />
        <div className="bg-mist-50 h-auto my-5 mx-[100px] flex">
                <div className = "filter bg-white-200 w-[25%] h-auto rounded-lg shadow-xl">
                    <div className = "flex justify-center mt-5 font-bold">FILTERS</div>
                    <SelectBox
                      title={"AC type"}
                      text={['ALL', 'AC', 'NON-AC']}
                      value={acFilter}
                      onChange={(option) => {
                        setAcFilter(option);
                        handleFetchBus(option, seatType, pickupTimeFilter, dropTimeFilter);
                      }}
                    />
                    <SelectBox
                      title ="Seat type"
                      text = {["ALL", "seater", "sleeper"]}
                      value={seatType}
                      onChange={(option) => {
                        setSeatType(option);
                        handleFetchBus(acFilter, option, pickupTimeFilter, dropTimeFilter);
                      }}
                    />
                    <SelectBox
                      text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                      title = {"Pick up time - Hyderabad, Telangana"}
                      value={pickupTimeFilter}
                      onChange={(option) => {
                        setPickupTimeFilter(option);
                        handleFetchBus(acFilter, seatType, option, dropTimeFilter);
                      }}
                    />
                    <SelectBox
                      text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                      title ="Drop time - Bangalore, Karnataka"
                      value={dropTimeFilter}
                      onChange={(option) => {
                        setDropTimeFilter(option);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, option);
                      }}
                    />
                    <Checkbox title = {"Single Seater/Sleeper"} text = {"Single Seats"}/>
                    <SearchheckBox title = {"Pick up point - Hyderabad, Telangana"} text= {["Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar"]}/>
                    <SearchheckBox title = {"Operators"} text ={["FlixBus", "Bmcc Travels", "IntrCity SmartBus", "Jabbar Travels", "National travels","BigBus","Tranzindia Travels" ]}/>
                    <SearchheckBox title = {"Drop point - Bangalore, Karnataka"} text ={["Kempegowda International Airport Be", "Yelahanka", "Hebbal", "Hennur Cross"]}/>
                </div>
                <div className = "bg-neutral-200 w-[80%] ml-[2%] px-5 rounded-lg shadow-xl flex flex-col">
                    <div className = "bg-white w-full h-auto my-5 rounded-3xl shadow-xl">
                        <BusFillterBar />
                    </div>
                    {Array.isArray(buses) && buses.length > 0 ? (
                      buses.map((schedule) => (
                        <div key={schedule._id} className="bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                          <BusCard
                            busName={schedule.busId?.busName}
                            busType={schedule.busId?.busType}
                            departureTime={schedule.departureTime}
                            arrivalTime={schedule.arrivalTime}
                            availableSeats={schedule.availableSeats}
                            calculatedFare={schedule.calculatedFare}
                            operatorName={schedule.busId?.operatorName}
                            averageRating={schedule.busId?.averageRating}
                            totalRatings={schedule.busId?.totalRatings}
                            amenities={schedule.busId?.amenities}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-600">No buses found for the selected route and date.</div>
                    )}
                </div>
            </div>
        </div>
      </>
  );
}
