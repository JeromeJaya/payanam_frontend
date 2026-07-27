import Nav from "../../NavComponent.jsx"
import WhereToWhere from "../../search/WhereToWhere.jsx"
import MobileFilterToggle from "./components/MobileFilterToggle.jsx"
import BusFilterPanel from "./components/BusFilterPanel.jsx"
import BusResultsList from "./components/BusResultsList.jsx"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../../api/axios.js"

export default function BusBooking() {
  const [searchParams, setSearchParams] = useSearchParams()

  const fromParam = searchParams.get("from") || ""
  const toParam = searchParams.get("to") || ""
  const dateParam = searchParams.get("date") || (() => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  })()
  const noOfSeatsParam = searchParams.get("NoOfSeats") || "1"

  const [from, setFrom] = useState(fromParam)
  const [to, setTo] = useState(toParam)
  const [date, setDate] = useState(dateParam)
  const [acFilter, setAcFilter] = useState("ALL")
  const [seatType, setSeatType] = useState("ALL")
  const [pickupTimeFilter, setPickupTimeFilter] = useState("ALL")
  const [dropTimeFilter, setDropTimeFilter] = useState("ALL")
  const [passengerCount, setPassengerCount] = useState(noOfSeatsParam)
  const [selectedPickupPoints, setSelectedPickupPoints] = useState([])
  const [selectedDropPoints, setSelectedDropPoints] = useState([])
  const [selectedOperators, setSelectedOperators] = useState([])
  const [singleSeatsFilter, setSingleSeatsFilter] = useState({})
  const [allBuses, setAllBuses] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("Relevance")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const getStorageKey = (searchFrom, searchTo, searchDate) =>
    `bus_search_${(searchFrom || from).trim()}_${(searchTo || to).trim()}_${(searchDate || date)}`

  const getTimeMinutes = (timeValue) => {
    if (!timeValue) return null
    const [hours, minutes] = String(timeValue).split(":").map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return hours * 60 + minutes
  }

  const matchesTimeRange = (timeValue, rangeLabel) => {
    if (rangeLabel === "ALL") return true
    const minutes = getTimeMinutes(timeValue)
    if (minutes === null) return false
    const ranges = {
      "12 AM - 6AM": [0, 360],
      "6 AM - 12 PM": [360, 720],
      "12 PM - 6 PM": [720, 1080],
      "6 PM - 12 AM": [1080, 1440],
    }
    const [start, end] = ranges[rangeLabel] || [0, 1440]
    return minutes >= start && minutes < end
  }

  const filteredBuses = useMemo(() => {
    let results = [...allBuses]
    if (acFilter === "AC") results = results.filter((s) => s.bus?.isAC === true || s.bus?.isAC === "true")
    else if (acFilter === "NON-AC") results = results.filter((s) => s.bus?.isAC === false || s.bus?.isAC === "false")
    if (seatType === "SEATER") results = results.filter((s) => s.bus?.type?.toLowerCase().includes("seater"))
    else if (seatType === "SLEEPER") results = results.filter((s) => s.bus?.type?.toLowerCase().includes("sleeper"))
    if (singleSeatsFilter["Single Seats"]) results = results.filter((s) => s.bus?.type?.toLowerCase().includes("seater"))
    if (pickupTimeFilter !== "ALL") results = results.filter((s) => matchesTimeRange(s.journey?.departureTime, pickupTimeFilter))
    if (dropTimeFilter !== "ALL") results = results.filter((s) => matchesTimeRange(s.journey?.arrivalTime, dropTimeFilter))
    if (selectedPickupPoints.length > 0) {
      results = results.filter((s) =>
        Array.isArray(s.boardingPoints) && s.boardingPoints.some((bp) => selectedPickupPoints.includes(bp.name))
      )
    }
    if (selectedDropPoints.length > 0) {
      results = results.filter((s) =>
        Array.isArray(s.droppingPoints) && s.droppingPoints.some((dp) => selectedDropPoints.includes(dp.name))
      )
    }
    if (selectedOperators.length > 0) {
      results = results.filter((s) => selectedOperators.includes(s.operator?.name))
    }
    if (passengerCount && passengerCount !== "ANY" && passengerCount !== "") {
      const required = parseInt(passengerCount, 10)
      if (!isNaN(required) && required >= 1) results = results.filter((s) => (s.seats?.available ?? 0) >= required)
    }
    return results
  }, [allBuses, acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints, selectedOperators, passengerCount, singleSeatsFilter])

  const sortedAndFilteredBuses = useMemo(() => {
    const sorted = [...filteredBuses]
    if (sortBy === "Rating") sorted.sort((a, b) => (b.bus?.rating || 0) - (a.bus?.rating || 0))
    else if (sortBy === "Price") sorted.sort((a, b) => (a.pricing?.calculatedFare || a.pricing?.baseFare) - (b.pricing?.calculatedFare || b.pricing?.baseFare))
    else if (sortBy === "Fastest") sorted.sort((a, b) => {
      const da = getTimeMinutes(a.journey?.arrivalTime) - getTimeMinutes(a.journey?.departureTime)
      const db = getTimeMinutes(b.journey?.arrivalTime) - getTimeMinutes(b.journey?.departureTime)
      return da - db
    })
    else if (sortBy === "Departure") sorted.sort((a, b) => a.journey?.departureTime.localeCompare(b.journey?.departureTime))
    else if (sortBy === "Arrival") sorted.sort((a, b) => a.journey?.arrivalTime.localeCompare(b.journey?.arrivalTime))
    return sorted
  }, [filteredBuses, sortBy])

  const handleFetchBus = async (selectedDate = date) => {
    const storageKey = getStorageKey(from, to, selectedDate)
    const cachedData = sessionStorage.getItem(storageKey)
    if (cachedData) { setAllBuses(JSON.parse(cachedData)); return }
    setLoading(true)
    try {
      const res = await api.get("/api/v1/buses/search", { params: { from, to, date: selectedDate } })
      const allResults = res?.data?.data || []
      sessionStorage.setItem(storageKey, JSON.stringify(allResults))
      setAllBuses(allResults)
    } catch (err) {
      console.error(err)
      setAllBuses([])
    } finally { setLoading(false) }
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    handleFetchBus(selectedDate)
  }

  const handleNextDaySearch = () => {
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    handleDateSelect(nextDate.toISOString().slice(0, 10))
  }

  const handleClearFilters = (e) => {
    if (e) e.preventDefault()
    setAcFilter("ALL")
    setSeatType("ALL")
    setPickupTimeFilter("ALL")
    setDropTimeFilter("ALL")
    setPassengerCount("1")
    setSelectedPickupPoints([])
    setSelectedDropPoints([])
    setSelectedOperators([])
    setSingleSeatsFilter({})
  }

  useEffect(() => {
    const params = {}
    if (from) params.from = from
    if (to) params.to = to
    if (date) params.date = date
    if (passengerCount && passengerCount !== "1") params.NoOfSeats = passengerCount
    setSearchParams(params, { replace: true })
  }, [from, to, date, passengerCount])

  useEffect(() => {
    const doFetch = async () => {
      const storageKey = getStorageKey(from, to, date)
      const cachedData = sessionStorage.getItem(storageKey)
      if (cachedData) { setAllBuses(JSON.parse(cachedData)); return }
      setLoading(true)
      try {
        const res = await api.get("/api/v1/buses/search", { params: { from, to, date } })
        const allResults = res?.data?.data || []
        sessionStorage.setItem(storageKey, JSON.stringify(allResults))
        setAllBuses(allResults)
      } catch (err) {
        console.error(err)
        setAllBuses([])
      } finally { setLoading(false) }
    }
    doFetch()
  }, [])

  const pickupPointOptions = useMemo(
    () => Array.from(new Set(allBuses.flatMap((s) => (s.boardingPoints || []).map((p) => p.name)))),
    [allBuses]
  )

  const dropPointOptions = useMemo(
    () => Array.from(new Set(allBuses.flatMap((s) => (s.droppingPoints || []).map((p) => p.name)))),
    [allBuses]
  )

  const operatorOptions = useMemo(
    () => Array.from(new Set(allBuses.map((s) => s.operator?.name).filter(Boolean))),
    [allBuses]
  )

  return (
    <>
      <Nav />
      <div className="pt-16 md:pt-20">
        <WhereToWhere
          from={from}
          to={to}
          date={date}
          onFromChange={setFrom}
          onToChange={setTo}
          onDateChange={setDate}
          onSearch={() => handleFetchBus(date)}
          passengerCount={passengerCount}
          onPassengerCountChange={setPassengerCount}
        />
        {!loading && allBuses.length > 0 && (
          <MobileFilterToggle
            showMobileFilters={showMobileFilters}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          />
        )}
        <div className="bg-slate-50 dark:bg-slate-900 pt-4 h-auto my-4 md:my-5 mx-2 sm:mx-4 md:mx-[100px] flex flex-col lg:flex-row">
          {!loading && allBuses.length > 0 && (
            <BusFilterPanel
              acFilter={acFilter} setAcFilter={setAcFilter}
              seatType={seatType} setSeatType={setSeatType}
              pickupTimeFilter={pickupTimeFilter} setPickupTimeFilter={setPickupTimeFilter}
              dropTimeFilter={dropTimeFilter} setDropTimeFilter={setDropTimeFilter}
              singleSeatsFilter={singleSeatsFilter} setSingleSeatsFilter={setSingleSeatsFilter}
              selectedPickupPoints={selectedPickupPoints} setSelectedPickupPoints={setSelectedPickupPoints}
              selectedDropPoints={selectedDropPoints} setSelectedDropPoints={setSelectedDropPoints}
              selectedOperators={selectedOperators} setSelectedOperators={setSelectedOperators}
              pickupPointOptions={pickupPointOptions}
              dropPointOptions={dropPointOptions}
              operatorOptions={operatorOptions}
              from={from} to={to}
              showMobileFilters={showMobileFilters}
              onCloseMobile={() => setShowMobileFilters(false)}
            />
          )}
          <BusResultsList
            loading={loading}
            sortedAndFilteredBuses={sortedAndFilteredBuses}
            allBuses={allBuses}
            date={date}
            sortBy={sortBy}
            from={from}
            to={to}
            onDateSelect={handleDateSelect}
            onSortSelect={setSortBy}
            onClearFilters={handleClearFilters}
            onNextDaySearch={handleNextDaySearch}
            maxSeats={passengerCount}
          />
        </div>
      </div>
    </>
  )
}
