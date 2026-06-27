import Nav from "../../NavComponent.jsx"
import WhereToWhere from "../../search/WhereToWhere.jsx"
import BusCard from "../../cards/BusCard.jsx"
import BusFillterBar from "../../filter/BusFillterBar.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
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
  const [selectedPickupPoints, setSelectedPickupPoints] = useState([]);
  const [selectedDropPoints, setSelectedDropPoints] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [buses, setBuses] = useState([]);
  const [sortBy, setSortBy] = useState("Relevance");
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
    selectedDropTime = dropTimeFilter,
    selectedBoardingPoints = selectedPickupPoints,
    selectedDroppingPoints = selectedDropPoints,
    selectedOperatorNames = selectedOperators,
    selectedDate = date
  ) => {
    try {
      const params = { from, to, date: selectedDate };
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

      if (Array.isArray(selectedBoardingPoints) && selectedBoardingPoints.length > 0) {
        results = results.filter((schedule) =>
          Array.isArray(schedule.boardingPoints) &&
          schedule.boardingPoints.some((bp) => selectedBoardingPoints.includes(bp.name))
        );
      }

      if (Array.isArray(selectedDroppingPoints) && selectedDroppingPoints.length > 0) {
        results = results.filter((schedule) =>
          Array.isArray(schedule.droppingPoints) &&
          schedule.droppingPoints.some((dp) => selectedDroppingPoints.includes(dp.name))
        );
      }

      if (Array.isArray(selectedOperatorNames) && selectedOperatorNames.length > 0) {
        results = results.filter((schedule) =>
          selectedOperatorNames.includes(schedule.busId?.operatorName)
        );
      }

      setBuses(results);
    } catch (err) {
      console.error(err);
      setBuses([]);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    handleFetchBus(
      acFilter,
      seatType,
      pickupTimeFilter,
      dropTimeFilter,
      selectedPickupPoints,
      selectedDropPoints,
      selectedOperators,
      selectedDate
    );
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
      } catch (err) {
        console.error(err);
        setBuses([]);
      }
    };

    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickupPointOptions = useMemo(
    () =>
      Array.from(
        new Set(
          buses.flatMap((schedule) =>
            (schedule.boardingPoints || []).map((point) => point.name)
          )
        )
      ),
    [buses]
  );

  const dropPointOptions = useMemo(
    () =>
      Array.from(
        new Set(
          buses.flatMap((schedule) =>
            (schedule.droppingPoints || []).map((point) => point.name)
          )
        )
      ),
    [buses]
  );

  const operatorOptions = useMemo(
    () =>
      Array.from(
        new Set(
          buses
            .map((schedule) => schedule.busId?.operatorName)
            .filter(Boolean)
        )
      ),
    [buses]
  );

  const sortedBuses = useMemo(() => {
    const sorted = [...buses];

    if (sortBy === "Rating") {
      sorted.sort((a, b) => (b.busId?.averageRating || 0) - (a.busId?.averageRating || 0));
    } else if (sortBy === "Price") {
      sorted.sort((a, b) => (a.calculatedFare || a.baseFare) - (b.calculatedFare || b.baseFare));
    } else if (sortBy === "Fastest") {
      sorted.sort((a, b) => {
        const durationA = getTimeMinutes(a.arrivalTime) - getTimeMinutes(a.departureTime);
        const durationB = getTimeMinutes(b.arrivalTime) - getTimeMinutes(b.departureTime);
        return durationA - durationB;
      });
    } else if (sortBy === "Departure") {
      sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sortBy === "Arrival") {
      sorted.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
    }

    return sorted;
  }, [buses, sortBy]);

  const handleSortSelect = (option) => {
    setSortBy(option);
  };

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
                        handleFetchBus(option, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <SelectBox
                      title ="Seat type"
                      text = {["ALL", "seater", "sleeper"]}
                      value={seatType}
                      onChange={(option) => {
                        setSeatType(option);
                        handleFetchBus(acFilter, option, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <SelectBox
                      text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                      title = {"Pick up time - Hyderabad, Telangana"}
                      value={pickupTimeFilter}
                      onChange={(option) => {
                        setPickupTimeFilter(option);
                        handleFetchBus(acFilter, seatType, option, dropTimeFilter, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <SelectBox
                      text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                      title ="Drop time - Bangalore, Karnataka"
                      value={dropTimeFilter}
                      onChange={(option) => {
                        setDropTimeFilter(option);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, option, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <Checkbox title={"Single Seater/Sleeper"} text={"Single Seats"} />
                    <SearchheckBox
                      title={`Pick up point - ${from || "Source"}`}
                      text={pickupPointOptions}
                      selectedPoints={selectedPickupPoints}
                      onChange={(point) => {
                        const next = selectedPickupPoints.includes(point)
                          ? selectedPickupPoints.filter((name) => name !== point)
                          : [...selectedPickupPoints, point];
                        setSelectedPickupPoints(next);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, next, selectedDropPoints);
                      }}
                      onClear={() => {
                        setSelectedPickupPoints([]);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, [], selectedDropPoints);
                      }}
                    />
                    <SearchheckBox
                      title={"Operators"}
                      text={operatorOptions}
                      selectedPoints={selectedOperators}
                      onChange={(point) => {
                        const next = selectedOperators.includes(point)
                          ? selectedOperators.filter((name) => name !== point)
                          : [...selectedOperators, point];
                        setSelectedOperators(next);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints, next);
                      }}
                      onClear={() => {
                        setSelectedOperators([]);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints, []);
                      }}
                    />
                    <SearchheckBox
                      title={`Drop point - ${to || "Destination"}`}
                      text={dropPointOptions}
                      selectedPoints={selectedDropPoints}
                      onChange={(point) => {
                        const next = selectedDropPoints.includes(point)
                          ? selectedDropPoints.filter((name) => name !== point)
                          : [...selectedDropPoints, point];
                        setSelectedDropPoints(next);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, next, selectedOperators);
                      }}
                      onClear={() => {
                        setSelectedDropPoints([]);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, [], selectedOperators);
                      }}
                    />
                </div>
                <div className = "bg-neutral-200 w-[80%] ml-[2%] px-5 rounded-lg shadow-xl flex flex-col">
                    <div className = "bg-white w-full h-auto my-5 rounded-3xl shadow-xl">
                        <BusFillterBar
                          NoOfBus={sortedBuses.length}
                          selectedDate={date}
                          onDateSelect={handleDateSelect}
                          selectedSort={sortBy}
                          onSortSelect={handleSortSelect}
                        />
                    </div>
                    {Array.isArray(sortedBuses) && sortedBuses.length > 0 ? (
                      sortedBuses.map((schedule) => (
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
