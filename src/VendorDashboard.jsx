import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, TrendingUp,
  Bus, Plane, 
} from "lucide-react";
import api from "./api/axios";
import CreateBusForm from "./components/CreateBusForm";
import EditBusForm from "./components/EditBusForm";
import BusDetailModal from "./components/BusDetailModal";
import CreateRouteForm from "./components/CreateRouteForm";
import BusRoutesModal from "./components/BusRoutesModal";
import CreateFlightForm from "./components/CreateFlightForm";
import FlightDetailModal from "./components/FlightDetailModal";
import VendorOverview from "./vendor/VendorOverview";
import VendorBookings from "./vendor/VendorBookings";
import VendorRoutes from "./vendor/VendorRoutes";
import VendorAnalytics from "./vendor/VendorAnalytics";
import VendorHeader from "./vendor/VendorHeader";
import VendorServiceCategoryGrid, { SERVICE_CATEGORIES } from "./vendor/VendorServiceCategoryGrid";
import VendorBusServiceView from "./vendor/VendorBusServiceView";
import VendorFlightServiceView from "./vendor/VendorFlightServiceView";
import VendorBusSchedule from "./vendor/VendorBusSchedule";
import VendorFlightSchedule from "./vendor/VendorFlightSchedule";
import { DeleteBusModal, DeleteFlightModal } from "./vendor/VendorDeleteModals";
import ViewFlightRoutesModal from "./vendor/ViewFlightRoutesModal";
import FlightRouteFormModal from "./vendor/FlightRouteFormModal";
import FlightScheduleFormModal from "./vendor/FlightScheduleFormModal";
import { CancelFlightScheduleModal, CancelBusScheduleModal } from "./vendor/VendorCancelScheduleModals";
import VendorBookingDetailModal from "./vendor/VendorBookingDetailModal";

export default function VendorDashboard() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateBusForm, setShowCreateBusForm] = useState(false);
  const [showCreateFlightForm, setShowCreateFlightForm] = useState(false);
  const [flightFormKey, setFlightFormKey] = useState(0);
  const [showCreateRouteForm, setShowCreateRouteForm] = useState(false);
  const [pendingBusId, setPendingBusId] = useState(null);
  const [editBus, setEditBus] = useState(null);
  const [viewBusId, setViewBusId] = useState(null);
  const [viewRoutesBus, setViewRoutesBus] = useState(null);
  const [viewFlightId, setViewFlightId] = useState(null);
  const [editFlight, setEditFlight] = useState(null);
  const [deleteFlightConfirm, setDeleteFlightConfirm] = useState(null);
  const [buses, setBuses] = useState([]);
  const [busesLoading, setBusesLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchServiceType, setSearchServiceType] = useState("bus");
  const [searchResultBusId, setSearchResultBusId] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Vendor Bookings
  const [vendorBookings, setVendorBookings] = useState([]);
  const [vendorBookingsLoading, setVendorBookingsLoading] = useState(false);
  const [vendorBookingsPage, setVendorBookingsPage] = useState(1);
  const [vendorBookingsTotal, setVendorBookingsTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Flights
  const [flights, setFlights] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(false);

  const [busSchedules, setBusSchedules] = useState([]);
  const [busSchedulesLoading, setBusSchedulesLoading] = useState(false);

  const [scheduleCategory, setScheduleCategory] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    busId: "", routeId: "", departureDate: "", departureTime: "", arrivalTime: "", baseFare: "",
    boardingPoints: [{ city: "", name: "", address: "", time: "", landmark: "" }],
    droppingPoints: [{ city: "", name: "", address: "", time: "", landmark: "" }],
    cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }]
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(null);
  const [scheduleError, setScheduleError] = useState("");
  const [busRoutes, setBusRoutes] = useState([]);
  const [busRoutesLoading, setBusRoutesLoading] = useState(false);
  const [routeCategory, setRouteCategory] = useState(null);
  const [showFlightRouteForm, setShowFlightRouteForm] = useState(false);
  const [flightRouteFormData, setFlightRouteFormData] = useState({
    flightId: "",
    source: { name: "", iataCode: "", city: "", country: "India", displayText: "" },
    destination: { name: "", iataCode: "", city: "", country: "India" },
    stops: [], distanceInKm: "", estimatedDurationInMinutes: ""
  });
  const [flightRouteLoading, setFlightRouteLoading] = useState(false);
  const [flightRouteSuccess, setFlightRouteSuccess] = useState(null);
  const [flightRouteError, setFlightRouteError] = useState("");
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [airportSearchLoading, setAirportSearchLoading] = useState(false);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showStopSuggestions, setShowStopSuggestions] = useState({});
  const [viewFlightRoutes, setViewFlightRoutes] = useState(null);
  const [pendingFlightId, setPendingFlightId] = useState(null);
  const [flightRoutes, setFlightRoutes] = useState([]);
  const [flightRoutesLoading, setFlightRoutesLoading] = useState(false);
  const [showFlightScheduleForm, setShowFlightScheduleForm] = useState(false);
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flightSchedulesLoading, setFlightSchedulesLoading] = useState(false);
  const [flightScheduleFormData, setFlightScheduleFormData] = useState({
    routeId: "", flightId: "", flightNumber: "", departureDate: "", arrivalDate: "",
    departureTime: "", arrivalTime: "", baseFare: "", departureTerminal: "", arrivalTerminal: "",
    mealOptions: ["VEG"], cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }]
  });
  const [flightScheduleLoading, setFlightScheduleLoading] = useState(false);
  const [flightScheduleSuccess, setFlightScheduleSuccess] = useState(null);
  const [flightScheduleError, setFlightScheduleError] = useState("");
  const [cancelScheduleConfirm, setCancelScheduleConfirm] = useState(null);
  const [cancelBusScheduleConfirm, setCancelBusScheduleConfirm] = useState(null);

  // --- Handlers ---
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setSearchError("");
    try {
      if (searchServiceType === "bus") {
        const response = await api.get(`/api/v1/buses/${q}`);
        if (response.data.success) {
          setSearchResultBusId(q);
          setSearchError("");
          setActiveTab("services");
          setSelectedCategory("bus");
        }
      } else {
        setSearchError(`${searchServiceType.charAt(0).toUpperCase() + searchServiceType.slice(1)} search coming soon.`);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setSearchError(`No ${searchServiceType} found with ID: "${q}"`);
      } else {
        setSearchError(err.response?.data?.errors || `Failed to search ${searchServiceType}`);
      }
      setSearchResultBusId(null);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && user.role !== "vendor") navigate("/");
  }, [user, authLoading, navigate]);

  const fetchBuses = async () => {
    setBusesLoading(true);
    try { const r = await api.get("/api/v1/buses"); if (r.data.success) setBuses(r.data.data); }
    catch (err) { console.error("Error fetching buses:", err); }
    finally { setBusesLoading(false); }
  };

  const fetchRoutes = async () => {
    setRoutesLoading(true);
    try { const r = await api.get("/api/v1/buses/routes"); if (r.data.success) setRoutes(r.data.data); }
    catch (err) { console.error("Error fetching routes:", err); }
    finally { setRoutesLoading(false); }
  };

  const fetchFlights = async () => {
    setFlightsLoading(true);
    try { const r = await api.get("/api/v1/flights"); if (r.data.success) setFlights(r.data.data || []); }
    catch (err) { console.error("Error fetching flights:", err); }
    finally { setFlightsLoading(false); }
  };

  const fetchBusSchedules = async () => {
    setBusSchedulesLoading(true);
    try { const r = await api.get("/api/v1/buses/schedules"); if (r.data.success) setBusSchedules(r.data.data); }
    catch (err) { console.error("Error fetching bus schedules:", err); }
    finally { setBusSchedulesLoading(false); }
  };

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try { const r = await api.get("/api/users/vendor/dashboard"); if (r.data.success) setDashboardData(r.data.data); }
    catch (err) { console.error("Error fetching dashboard data:", err); }
    finally { setDashboardLoading(false); }
  };

  const fetchVendorBookings = async (page = 1) => {
    setVendorBookingsLoading(true);
    try {
      const r = await api.get(`/api/v1/bookings/vendor-bookings?page=${page}&limit=20`);
      if (r.data.success) {
        if (page === 1) setVendorBookings(r.data.data);
        else setVendorBookings(prev => [...prev, ...r.data.data]);
        setVendorBookingsTotal(r.data.pagination?.totalCount || 0);
        setVendorBookingsPage(page);
      }
    } catch (err) { console.error("Error fetching vendor bookings:", err); }
    finally { setVendorBookingsLoading(false); }
  };

  useEffect(() => {
    if (searchResultBusId) { setViewBusId(searchResultBusId); setSearchResultBusId(null); }
  }, [searchResultBusId]);

  useEffect(() => { if (viewFlightRoutes) fetchFlightRoutes(viewFlightRoutes); }, [viewFlightRoutes]);
  useEffect(() => { if (pendingFlightId) setFlightRouteFormData(prev => ({ ...prev, flightId: pendingFlightId })); }, [pendingFlightId]);

  useEffect(() => {
    if (user && user.role === "vendor") {
      fetchBuses(); fetchRoutes(); fetchFlights(); fetchDashboardData(); fetchBusSchedules(); fetchVendorBookings(1);
    }
  }, [user]);

  if (!authLoading && (!user || user.role !== "vendor")) { navigate("/"); return null; }
  if (authLoading || !user) return null;

  const isVendorApproved = user.vendorApprovalStatus === "APPROVED";
  const vendorApprovalStatus = user.vendorApprovalStatus || "PENDING";

  const handleLogout = () => { logout(); navigate("/"); };

  const handleDeleteBus = async (busId) => {
    try {
      const r = await api.delete(`/api/v1/buses/${busId}`);
      if (r.data.success) { setBuses(prev => prev.filter(b => b._id !== busId)); setDeleteConfirm(null); }
    } catch (err) { console.error("Error deleting bus:", err); alert(err.response?.data?.message || "Failed to delete bus"); }
  };

  const handleEditSuccess = (updatedBus) => { setBuses(prev => prev.map(b => b._id === updatedBus._id ? updatedBus : b)); };

  const handleCreateSuccess = (newBus) => {
    setBuses(prev => [newBus, ...prev]); setShowCreateBusForm(false);
    setPendingBusId(newBus._id); setRouteCategory("bus"); setActiveTab("routes");
    setTimeout(() => setShowCreateRouteForm(true), 100);
  };

  const handleCreateFlightSuccess = (newFlight) => {
    setFlights(prev => [newFlight, ...prev]); setShowCreateFlightForm(false);
    setPendingFlightId(newFlight._id); setRouteCategory("flight"); setActiveTab("routes");
    setTimeout(() => setShowFlightRouteForm(true), 100);
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      const r = await api.delete(`/api/v1/flights/${flightId}`);
      if (r.data.success) { setFlights(prev => prev.filter(f => f._id !== flightId)); setDeleteFlightConfirm(null); fetchDashboardData(); }
    } catch (err) { console.error("Error deleting flight:", err); alert(err.response?.data?.message || "Failed to delete flight"); }
  };

  const handleUpdateFlight = async (updatedFlight) => {
    try {
      const r = await api.patch(`/api/v1/flights/${updatedFlight._id}`, updatedFlight);
      if (r.data.success) { setFlights(prev => prev.map(f => f._id === updatedFlight._id ? r.data.data : f)); setEditFlight(null); fetchDashboardData(); }
    } catch (err) { console.error("Error updating flight:", err); alert(err.response?.data?.message || "Failed to update flight"); }
  };

  const openCreateFlightForm = () => { setFlightFormKey(prev => prev + 1); setShowCreateFlightForm(true); };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault(); setScheduleLoading(true); setScheduleError(""); setScheduleSuccess(null);
    try {
      const payload = { ...scheduleFormData, baseFare: parseFloat(scheduleFormData.baseFare),
        boardingPoints: scheduleFormData.boardingPoints.filter(p => p.city && p.name),
        droppingPoints: scheduleFormData.droppingPoints.filter(p => p.city && p.name) };
      const r = await api.post("/api/v1/buses/schedules", payload);
      if (r.data.success) {
        setScheduleSuccess("Schedule created successfully!"); setShowScheduleForm(false);
        setScheduleFormData({ busId: "", routeId: "", departureDate: "", departureTime: "", arrivalTime: "", baseFare: "",
          boardingPoints: [{ city: "", name: "", address: "", time: "", landmark: "" }],
          droppingPoints: [{ city: "", name: "", address: "", time: "", landmark: "" }],
          cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }] });
        fetchDashboardData(); fetchBusSchedules();
      }
    } catch (err) { setScheduleError(err.response?.data?.message || "Failed to create schedule"); }
    finally { setScheduleLoading(false); }
  };

  const handleFlightRouteSubmit = async (e) => {
    e.preventDefault(); setFlightRouteLoading(true); setFlightRouteError(""); setFlightRouteSuccess(null);
    const selectedFlightId = flightRouteFormData.flightId;
    try {
      const payload = { flightId: flightRouteFormData.flightId, source: flightRouteFormData.source, destination: flightRouteFormData.destination,
        stops: flightRouteFormData.stops.filter(s => s.iataCode && s.name),
        distanceInKm: parseFloat(flightRouteFormData.distanceInKm) || 0,
        estimatedDurationInMinutes: parseInt(flightRouteFormData.estimatedDurationInMinutes) || 0 };
      const r = await api.post("/api/v1/flights/routes", payload);
      if (r.data.success) {
        const createdRoute = r.data.data;
        setFlightRouteSuccess("Flight route created successfully!"); setShowFlightRouteForm(false);
        setFlightRouteFormData({ flightId: "", source: { name: "", iataCode: "", city: "", country: "India", displayText: "" },
          destination: { name: "", iataCode: "", city: "", country: "India" }, stops: [], distanceInKm: "", estimatedDurationInMinutes: "" });
        setPendingFlightId(null); setScheduleCategory("flight");
        setFlightScheduleFormData(prev => ({ ...prev, flightId: selectedFlightId, routeId: createdRoute._id }));
        setActiveTab("schedule"); fetchDashboardData();
      }
    } catch (err) { setFlightRouteError(err.response?.data?.message || "Failed to create flight route"); }
    finally { setFlightRouteLoading(false); }
  };

  const addFlightStop = () => {
    setFlightRouteFormData(prev => ({ ...prev, stops: [...prev.stops, { name: "", iataCode: "", city: "", arrivalTime: "", departureTime: "", minutesFromSource: 0, order: prev.stops.length + 1 }] }));
  };

  const updateFlightStop = (index, field, value) => {
    setFlightRouteFormData(prev => ({ ...prev, stops: prev.stops.map((stop, i) => i === index ? { ...stop, [field]: value } : stop) }));
  };

  const searchAirports = async (query) => {
    if (!query || query.length < 2) { setAirportSuggestions([]); return; }
    setAirportSearchLoading(true);
    try { const r = await api.get(`/api/v1/airports/search?q=${encodeURIComponent(query)}`); if (r.data.success) setAirportSuggestions(r.data.data || []); }
    catch (err) { console.error("Error searching airports:", err); setAirportSuggestions([]); }
    finally { setAirportSearchLoading(false); }
  };

  const selectAirport = (airport, type) => {
    if (type === "source") {
      setFlightRouteFormData(prev => ({ ...prev, source: { name: airport.name, iataCode: airport.iataCode, city: airport.city, country: airport.country, displayText: airport.displayText } }));
      setShowSourceSuggestions(false);
    } else if (type === "destination") {
      setFlightRouteFormData(prev => ({ ...prev, destination: { name: airport.name, iataCode: airport.iataCode, city: airport.city, country: airport.country } }));
      setShowDestSuggestions(false);
    }
  };

  const selectStopAirport = (airport, stopIndex) => {
    setFlightRouteFormData(prev => ({ ...prev, stops: prev.stops.map((stop, i) => i === stopIndex ? { ...stop, name: airport.name, iataCode: airport.iataCode, city: airport.city } : stop) }));
    setShowStopSuggestions(prev => ({ ...prev, [stopIndex]: false }));
  };

  const fetchBusRoutes = async (busId) => {
    if (!busId) { setBusRoutes([]); return; }
    setBusRoutesLoading(true);
    try { const r = await api.get(`/api/v1/buses/${busId}/routes`); if (r.data.success) setBusRoutes(r.data.data); }
    catch (err) { console.error("Error fetching bus routes:", err); setBusRoutes([]); }
    finally { setBusRoutesLoading(false); }
  };

  const fetchFlightRoutes = async (flightId) => {
    if (!flightId) { setFlightRoutes([]); return; }
    setFlightRoutesLoading(true);
    try { const r = await api.get(`/api/v1/flights/${flightId}/routes`); if (r.data.success) setFlightRoutes(r.data.data || []); }
    catch (err) { console.error("Error fetching flight routes:", err); setFlightRoutes([]); }
    finally { setFlightRoutesLoading(false); }
  };

  const fetchFlightRoutesForSchedule = async (flightId) => {
    if (!flightId) { setFlightRoutes([]); return; }
    setFlightRoutesLoading(true);
    try { const r = await api.get(`/api/v1/flights/${flightId}/routes`); if (r.data.success) setFlightRoutes(r.data.data || []); }
    catch (err) { console.error("Error fetching flight routes for schedule:", err); setFlightRoutes([]); }
    finally { setFlightRoutesLoading(false); }
  };

  const fetchFlightSchedules = async () => {
    setFlightSchedulesLoading(true);
    try { const r = await api.get("/api/v1/flights/schedules"); if (r.data.success) setFlightSchedules(r.data.data || []); }
    catch (err) { console.error("Error fetching flight schedules:", err); setFlightSchedules([]); }
    finally { setFlightSchedulesLoading(false); }
  };

  const handleFlightScheduleSubmit = async (e) => {
    e.preventDefault(); setFlightScheduleLoading(true); setFlightScheduleError(""); setFlightScheduleSuccess(null);
    try {
      const payload = { ...flightScheduleFormData, baseFare: parseFloat(flightScheduleFormData.baseFare),
        mealOptions: flightScheduleFormData.mealOptions, cancellationPolicy: flightScheduleFormData.cancellationPolicy };
      const r = await api.post("/api/v1/flights/schedules", payload);
      if (r.data.success) {
        setFlightScheduleSuccess("Flight schedule created successfully!"); setShowFlightScheduleForm(false);
        setFlightScheduleFormData({ routeId: "", flightId: "", flightNumber: "", departureDate: "", arrivalDate: "",
          departureTime: "", arrivalTime: "", baseFare: "", departureTerminal: "", arrivalTerminal: "",
          mealOptions: ["VEG"], cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }] });
        fetchFlightSchedules();
      }
    } catch (err) { setFlightScheduleError(err.response?.data?.message || "Failed to create flight schedule"); }
    finally { setFlightScheduleLoading(false); }
  };

  const handleCancelSchedule = async (scheduleId) => {
    try { const r = await api.patch(`/api/v1/flights/schedules/${scheduleId}/cancel`);
      if (r.data.success) { setCancelScheduleConfirm(null); fetchFlightSchedules(); alert(r.data.message || "Schedule cancelled successfully"); }
    } catch (err) { console.error("Error cancelling schedule:", err); alert(err.response?.data?.message || "Failed to cancel schedule"); }
  };

  const handleCancelBusSchedule = async (scheduleId) => {
    try { const r = await api.patch(`/api/v1/buses/schedules/${scheduleId}/cancel`);
      if (r.data.success) { setCancelBusScheduleConfirm(null); fetchBusSchedules(); fetchDashboardData(); alert(r.data.message || "Bus schedule cancelled successfully"); }
    } catch (err) { console.error("Error cancelling bus schedule:", err); alert(err.response?.data?.message || "Failed to cancel bus schedule"); }
  };

  const stats = dashboardData ? [
    { label: "Total Buses", value: dashboardData.buses.total.toString(), change: `${dashboardData.buses.active} active`, icon: Bus, color: "lime" },
    { label: "Total Flights", value: dashboardData.flights.total.toString(), change: `${dashboardData.flights.active} active`, icon: Plane, color: "sky" },
    { label: "Confirmed Bookings", value: dashboardData.bookings.confirmed.toString(), change: "", icon: Calendar, color: "green" },
    { label: "Total Revenue", value: `₹${dashboardData.revenue.total.toLocaleString('en-IN')}`, change: "", icon: TrendingUp, color: "teal" },
  ] : [
    { label: "Total Buses", value: "—", change: "", icon: Bus, color: "lime" },
    { label: "Total Flights", value: "—", change: "", icon: Plane, color: "sky" },
    { label: "Confirmed Bookings", value: "—", change: "", icon: Calendar, color: "green" },
    { label: "Total Revenue", value: "—", change: "", icon: TrendingUp, color: "teal" },
  ];

  const colorClasses = {
    lime: "from-lime-500 to-lime-600", emerald: "from-emerald-500 to-emerald-600",
    green: "from-green-500 to-green-600", teal: "from-teal-500 to-teal-600", sky: "from-sky-500 to-sky-600",
  };

  // Full page loading state
  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
          <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-600 to-lime-500 flex items-center justify-center text-white font-black text-xl shadow-md">V</div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">Vendor Dashboard</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 w-full px-6 sm:px-12 lg:px-20 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <VendorHeader user={user} onLogout={handleLogout} isVendorApproved={isVendorApproved} vendorApprovalStatus={vendorApprovalStatus} />

      <div className="w-full px-6 sm:px-12 lg:px-20 py-8">
       
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">{stat.change}</span>}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">{stat.value}</h3>
                <p className="text-base text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6">
            <nav className="flex gap-8">
              {["overview", "bookings", "routes", "services", "schedule", "analytics"].map((tab) => (
                <button key={tab} onClick={() => { setActiveTab(tab); setSelectedCategory(null); setScheduleCategory(null); }}
                  className={`py-4 text-sm font-bold capitalize border-b-2 transition-all duration-200 ${
                    activeTab === tab ? "border-lime-500 text-lime-600 dark:text-lime-400" : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}>{tab}</button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && <VendorOverview />}

            {activeTab === "bookings" && (
              <VendorBookings vendorBookings={vendorBookings} vendorBookingsLoading={vendorBookingsLoading}
                vendorBookingsTotal={vendorBookingsTotal} vendorBookingsPage={vendorBookingsPage}
                onSelectBooking={setSelectedBooking} onLoadMore={fetchVendorBookings} />
            )}

            {activeTab === "routes" && (
              <VendorRoutes routeCategory={routeCategory} setRouteCategory={setRouteCategory} buses={buses} flights={flights}
                setShowCreateRouteForm={setShowCreateRouteForm} setShowFlightRouteForm={setShowFlightRouteForm}
                setViewFlightRoutes={setViewRoutesBus} />
            )}

            {activeTab === "services" && (
              <>
                {selectedCategory === null && <VendorServiceCategoryGrid busesCount={buses.length} flightsCount={flights.length} onSelectCategory={setSelectedCategory} />}
                {selectedCategory === "bus" && (
                  <VendorBusServiceView buses={buses} busesLoading={busesLoading} onBack={() => setSelectedCategory(null)}
                    onAddBus={() => setShowCreateBusForm(true)} onViewBus={setViewBusId} onViewRoutes={setViewRoutesBus}
                    onEditBus={setEditBus} onDeleteBus={setDeleteConfirm} />
                )}
                {selectedCategory === "flight" && (
                  <VendorFlightServiceView flights={flights} flightsLoading={flightsLoading} onBack={() => setSelectedCategory(null)}
                    onAddFlight={openCreateFlightForm} onViewFlight={setViewFlightId} onEditFlight={setEditFlight}
                    onDeleteFlight={setDeleteFlightConfirm} />
                )}
              </>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6">
                {!scheduleCategory ? (
                  <>
                    <h3 className="text-xl font-bold text-slate-900">Select Service Type</h3>
                    <p className="text-sm text-slate-600">Choose a service category to schedule a trip</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {SERVICE_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button key={cat.id} onClick={() => { setScheduleCategory(cat.id); if (cat.id === "flight") fetchFlightSchedules(); }}
                            className={`text-left bg-white border-2 border-slate-200 rounded-xl p-6 ${cat.hoverBorder} hover:shadow-md transition-all duration-300 group`}>
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{cat.label}</h4>
                                <p className="text-xs text-slate-500">{cat.description}</p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform inline-block">Click to schedule →</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : scheduleCategory === "bus" ? (
                  <VendorBusSchedule busSchedules={busSchedules} busSchedulesLoading={busSchedulesLoading} buses={buses}
                    busRoutes={busRoutes} busRoutesLoading={busRoutesLoading} showScheduleForm={showScheduleForm}
                    setShowScheduleForm={setShowScheduleForm} scheduleFormData={scheduleFormData} setScheduleFormData={setScheduleFormData}
                    scheduleLoading={scheduleLoading} scheduleSuccess={scheduleSuccess} scheduleError={scheduleError}
                    onFetchBusSchedules={fetchBusSchedules} onFetchBusRoutes={fetchBusRoutes} onScheduleSubmit={handleScheduleSubmit}
                    onCancelSchedule={setCancelBusScheduleConfirm} onBack={() => { setScheduleCategory(null); setShowScheduleForm(false); }} />
                ) : scheduleCategory === "flight" ? (
                  <VendorFlightSchedule flightSchedules={flightSchedules} flightSchedulesLoading={flightSchedulesLoading}
                    showFlightScheduleForm={showFlightScheduleForm} setShowFlightScheduleForm={setShowFlightScheduleForm}
                    onFetchFlightSchedules={fetchFlightSchedules} onCancelSchedule={setCancelScheduleConfirm}
                    onBack={() => { setScheduleCategory(null); setShowFlightScheduleForm(false); }} />
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      {scheduleCategory === "train" && "Train scheduling will be available soon."}
                      {scheduleCategory === "hotel" && "Hotel scheduling will be available soon."}
                    </p>
                    <button onClick={() => setScheduleCategory(null)}
                      className="mt-4 inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
                      Back to Categories
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && <VendorAnalytics />}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteBusModal bus={deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDeleteBus} />
      <DeleteFlightModal flight={deleteFlightConfirm} onClose={() => setDeleteFlightConfirm(null)} onConfirm={handleDeleteFlight} />

      {showCreateBusForm && <CreateBusForm onClose={() => setShowCreateBusForm(false)} onSuccess={handleCreateSuccess} />}
      {showCreateFlightForm && <CreateFlightForm key={flightFormKey} onClose={() => setShowCreateFlightForm(false)} onSuccess={handleCreateFlightSuccess} />}
      {editFlight && <CreateFlightForm key={editFlight._id} flight={editFlight} isEdit={true} onClose={() => setEditFlight(null)} onSuccess={handleUpdateFlight} />}
      {editBus && <EditBusForm bus={editBus} onClose={() => setEditBus(null)} onSuccess={handleEditSuccess} />}
      {viewBusId && <BusDetailModal busId={viewBusId} onClose={() => setViewBusId(null)} />}
      {viewFlightId && <FlightDetailModal flightId={viewFlightId} onClose={() => setViewFlightId(null)} />}

      {showCreateRouteForm && (
        <CreateRouteForm buses={buses} initialBusId={pendingBusId}
          onClose={() => { setShowCreateRouteForm(false); setPendingBusId(null); }}
          onSuccess={(createdRoute) => {
            setShowCreateRouteForm(false); setPendingBusId(null); setRouteCategory(null);
            setScheduleCategory("bus"); setActiveTab("schedule");
            setScheduleFormData(prev => ({ ...prev, busId: createdRoute.busId, routeId: createdRoute._id }));
          }} />
      )}

      {viewRoutesBus && <BusRoutesModal bus={viewRoutesBus} onClose={() => setViewRoutesBus(null)} />}
      {viewFlightRoutes && <ViewFlightRoutesModal flightRoutes={flightRoutes} flightRoutesLoading={flightRoutesLoading} onClose={() => setViewFlightRoutes(null)} />}
      {showFlightRouteForm && (
        <FlightRouteFormModal flights={flights} flightRouteFormData={flightRouteFormData} setFlightRouteFormData={setFlightRouteFormData}
          flightRouteLoading={flightRouteLoading} flightRouteSuccess={flightRouteSuccess} flightRouteError={flightRouteError}
          airportSuggestions={airportSuggestions} airportSearchLoading={airportSearchLoading}
          showSourceSuggestions={showSourceSuggestions} setShowSourceSuggestions={setShowSourceSuggestions}
          showDestSuggestions={showDestSuggestions} setShowDestSuggestions={setShowDestSuggestions}
          showStopSuggestions={showStopSuggestions} setShowStopSuggestions={setShowStopSuggestions}
          onSubmit={handleFlightRouteSubmit} onClose={() => setShowFlightRouteForm(false)}
          onSearchAirports={searchAirports} onSelectAirport={selectAirport} onSelectStopAirport={selectStopAirport}
          onAddStop={addFlightStop} onUpdateStop={updateFlightStop} />
      )}

      {showFlightScheduleForm && (
        <FlightScheduleFormModal flights={flights} flightRoutes={flightRoutes} flightRoutesLoading={flightRoutesLoading}
          flightScheduleFormData={flightScheduleFormData} setFlightScheduleFormData={setFlightScheduleFormData}
          flightScheduleLoading={flightScheduleLoading} flightScheduleSuccess={flightScheduleSuccess} flightScheduleError={flightScheduleError}
          onSubmit={handleFlightScheduleSubmit} onClose={() => setShowFlightScheduleForm(false)} onFetchFlightRoutes={fetchFlightRoutesForSchedule} />
      )}

      <CancelFlightScheduleModal schedule={cancelScheduleConfirm} onClose={() => setCancelScheduleConfirm(null)} onConfirm={handleCancelSchedule} />
      <CancelBusScheduleModal schedule={cancelBusScheduleConfirm} onClose={() => setCancelBusScheduleConfirm(null)} onConfirm={handleCancelBusSchedule} />
      <VendorBookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
}
