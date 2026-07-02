import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Bus,
  Plane,
  Hotel,
  Train,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Route,
  X
} from "lucide-react";
import api from "./api/axios";
import CreateBusForm from "./components/CreateBusForm";
import EditBusForm from "./components/EditBusForm";
import BusDetailModal from "./components/BusDetailModal";
import CreateRouteForm from "./components/CreateRouteForm";
import BusRoutesModal from "./components/BusRoutesModal";
import CreateFlightForm from "./components/CreateFlightForm";
import FlightDetailModal from "./components/FlightDetailModal";

const SERVICE_CATEGORIES = [
  {
    id: "bus",
    label: "Bus Services",
    icon: Bus,
    gradient: "from-lime-500 to-lime-600",
    hoverBorder: "hover:border-lime-500",
    color: "lime",
    description: "Manage your bus fleet, routes, and schedules"
  },
  {
    id: "flight",
    label: "Flight Services",
    icon: Plane,
    gradient: "from-sky-500 to-sky-600",
    hoverBorder: "hover:border-sky-500",
    color: "sky",
    description: "Manage your flight inventory and bookings"
  },
  {
    id: "train",
    label: "Train Services",
    icon: Train,
    gradient: "from-orange-500 to-orange-600",
    hoverBorder: "hover:border-orange-500",
    color: "orange",
    description: "Manage your train schedules and routes"
  },
  {
    id: "hotel",
    label: "Hotel Services",
    icon: Hotel,
    gradient: "from-purple-500 to-purple-600",
    hoverBorder: "hover:border-purple-500",
    color: "purple",
    description: "Manage your hotel properties and rooms"
  },
];

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateBusForm, setShowCreateBusForm] = useState(false);
  const [showCreateFlightForm, setShowCreateFlightForm] = useState(false);
  const [flightFormKey, setFlightFormKey] = useState(0);
  const [showCreateRouteForm, setShowCreateRouteForm] = useState(false);
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

  // Flights (aircraft) for vendor services page
  const [flights, setFlights] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(false);

  const [scheduleCategory, setScheduleCategory] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    busId: "",
    routeId: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    baseFare: "",
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
    stops: [],
    distanceInKm: "",
    estimatedDurationInMinutes: ""
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
  const [flightRoutes, setFlightRoutes] = useState([]);
  const [flightRoutesLoading, setFlightRoutesLoading] = useState(false);
  const [showFlightScheduleForm, setShowFlightScheduleForm] = useState(false);
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flightSchedulesLoading, setFlightSchedulesLoading] = useState(false);
  const [flightScheduleFormData, setFlightScheduleFormData] = useState({
    routeId: "",
    flightId: "",
    flightNumber: "",
    departureDate: "",
    arrivalDate: "",
    departureTime: "",
    arrivalTime: "",
    baseFare: "",
    departureTerminal: "",
    arrivalTerminal: "",
    mealOptions: ["VEG"],
    cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }]
  });
  const [flightScheduleLoading, setFlightScheduleLoading] = useState(false);
  const [flightScheduleSuccess, setFlightScheduleSuccess] = useState(null);
  const [flightScheduleError, setFlightScheduleError] = useState("");
  const [cancelScheduleConfirm, setCancelScheduleConfirm] = useState(null);
  const searchInputRef = useRef(null);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setSearching(true);
    setSearchError("");

    try {
      if (searchServiceType === "bus") {
        // Try fetching the bus directly — if 404, the catch will handle it
        const response = await api.get(`/api/v1/buses/${q}`);
        if (response.data.success) {
          setSearchResultBusId(q);
          setSearchError("");
          // Switch to services tab and open bus detail
          setActiveTab("services");
          setSelectedCategory("bus");
        }
      } else {
        // For flight/train/hotel — coming soon
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

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchBuses = async () => {
    setBusesLoading(true);
    try {
      const response = await api.get("/api/v1/buses");
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setBusesLoading(false);
    }
  };

  const fetchRoutes = async () => {
    setRoutesLoading(true);
    try {
      const response = await api.get("/api/v1/routes");
      if (response.data.success) {
        setRoutes(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setRoutesLoading(false);
    }
  };

  const fetchFlights = async () => {
    setFlightsLoading(true);
    try {
      const response = await api.get("/api/v1/flights");
      if (response.data.success) {
        setFlights(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setFlightsLoading(false);
    }
  };


  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const response = await api.get("/api/users/vendor/dashboard");
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // When search finds a bus, open the detail modal
  useEffect(() => {
    if (searchResultBusId) {
      setViewBusId(searchResultBusId);
      setSearchResultBusId(null);
    }
  }, [searchResultBusId]);

  // Fetch flight routes when viewFlightRoutes changes
  useEffect(() => {
    if (viewFlightRoutes) {
      fetchFlightRoutes(viewFlightRoutes);
    }
  }, [viewFlightRoutes]);

  useEffect(() => {
    if (user && user.role === "vendor") {
      fetchBuses();
      fetchRoutes();
      fetchFlights();
      fetchDashboardData();
    }
  }, [user]);


  if (!user || user.role !== "vendor") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteBus = async (busId) => {
    try {
      const response = await api.delete(`/api/v1/buses/${busId}`);
      if (response.data.success) {
        setBuses(prev => prev.filter(b => b._id !== busId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Error deleting bus:", err);
      alert(err.response?.data?.message || "Failed to delete bus");
    }
  };

  const handleEditSuccess = (updatedBus) => {
    setBuses(prev => prev.map(b => b._id === updatedBus._id ? updatedBus : b));
  };

  const handleCreateSuccess = (newBus) => {
    setBuses(prev => [newBus, ...prev]);
  };

  const handleCreateFlightSuccess = (newFlight) => {
    // Refresh dashboard data to update flight count
    fetchDashboardData();
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      const response = await api.delete(`/api/v1/flights/${flightId}`);
      if (response.data.success) {
        setFlights(prev => prev.filter(f => f._id !== flightId));
        setDeleteFlightConfirm(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error deleting flight:", err);
      alert(err.response?.data?.message || "Failed to delete flight");
    }
  };

  const handleUpdateFlight = async (updatedFlight) => {
    try {
      const response = await api.patch(`/api/v1/flights/${updatedFlight._id}`, updatedFlight);
      if (response.data.success) {
        setFlights(prev => prev.map(f => f._id === updatedFlight._id ? response.data.data : f));
        setEditFlight(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error updating flight:", err);
      alert(err.response?.data?.message || "Failed to update flight");
    }
  };

  const openCreateFlightForm = () => {
    setFlightFormKey(prev => prev + 1);
    setShowCreateFlightForm(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleLoading(true);
    setScheduleError("");
    setScheduleSuccess(null);

    try {
      const payload = {
        ...scheduleFormData,
        baseFare: parseFloat(scheduleFormData.baseFare),
        boardingPoints: scheduleFormData.boardingPoints.filter(p => p.city && p.name),
        droppingPoints: scheduleFormData.droppingPoints.filter(p => p.city && p.name),
      };

      const response = await api.post("/api/v1/buses/schedules", payload);
      
      if (response.data.success) {
        setScheduleSuccess("Schedule created successfully!");
        setShowScheduleForm(false);
        setScheduleFormData({
          busId: "",
          routeId: "",
          departureDate: "",
          departureTime: "",
          arrivalTime: "",
          baseFare: "",
          boardingPoints: [{ city: "", name: "", address: "", time: "", landmark: "" }],
          droppingPoints: [{ city: "", name: "", address: "", time: "", landmark: "" }],
          cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }]
        });
        
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (err) {
      setScheduleError(err.response?.data?.message || "Failed to create schedule");
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleFlightRouteSubmit = async (e) => {
    e.preventDefault();
    setFlightRouteLoading(true);
    setFlightRouteError("");
    setFlightRouteSuccess(null);

    try {
      const payload = {
        flightId: flightRouteFormData.flightId,
        source: flightRouteFormData.source,
        destination: flightRouteFormData.destination,
        stops: flightRouteFormData.stops.filter(s => s.iataCode && s.name),
        distanceInKm: parseFloat(flightRouteFormData.distanceInKm) || 0,
        estimatedDurationInMinutes: parseInt(flightRouteFormData.estimatedDurationInMinutes) || 0
      };

      const response = await api.post("/api/v1/flights/routes", payload);
      
      if (response.data.success) {
        setFlightRouteSuccess("Flight route created successfully!");
        setShowFlightRouteForm(false);
        setFlightRouteFormData({
          flightId: "",
          source: { name: "", iataCode: "", city: "", country: "India", displayText: "" },
          destination: { name: "", iataCode: "", city: "", country: "India" },
          stops: [],
          distanceInKm: "",
          estimatedDurationInMinutes: ""
        });
        
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (err) {
      setFlightRouteError(err.response?.data?.message || "Failed to create flight route");
    } finally {
      setFlightRouteLoading(false);
    }
  };

  const addFlightStop = () => {
    setFlightRouteFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { 
        name: "", 
        iataCode: "", 
        city: "", 
        arrivalTime: "", 
        departureTime: "", 
        minutesFromSource: 0, 
        order: prev.stops.length + 1 
      }]
    }));
  };

  const updateFlightStop = (index, field, value) => {
    setFlightRouteFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === index ? { ...stop, [field]: value } : stop
      )
    }));
  };

  const searchAirports = async (query) => {
    if (!query || query.length < 2) {
      setAirportSuggestions([]);
      return;
    }

    setAirportSearchLoading(true);
    try {
      const response = await api.get(`/api/v1/airports/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setAirportSuggestions(response.data.data || []);
      }
    } catch (err) {
      console.error("Error searching airports:", err);
      setAirportSuggestions([]);
    } finally {
      setAirportSearchLoading(false);
    }
  };

  const selectAirport = (airport, type) => {
    if (type === "source") {
      setFlightRouteFormData(prev => ({
        ...prev,
        source: {
          name: airport.name,
          iataCode: airport.iataCode,
          city: airport.city,
          country: airport.country,
          displayText: airport.displayText
        }
      }));
      setShowSourceSuggestions(false);
    } else if (type === "destination") {
      setFlightRouteFormData(prev => ({
        ...prev,
        destination: {
          name: airport.name,
          iataCode: airport.iataCode,
          city: airport.city,
          country: airport.country
        }
      }));
      setShowDestSuggestions(false);
    }
  };

  const selectStopAirport = (airport, stopIndex) => {
    setFlightRouteFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === stopIndex ? {
          ...stop,
          name: airport.name,
          iataCode: airport.iataCode,
          city: airport.city
        } : stop
      )
    }));
    setShowStopSuggestions(prev => ({ ...prev, [stopIndex]: false }));
  };

  const fetchBusRoutes = async (busId) => {
    if (!busId) {
      setBusRoutes([]);
      return;
    }

    setBusRoutesLoading(true);
    try {
      const response = await api.get(`/api/v1/buses/${busId}/routes`);
      if (response.data.success) {
        setBusRoutes(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching bus routes:", err);
      setBusRoutes([]);
    } finally {
      setBusRoutesLoading(false);
    }
  };

  const fetchFlightRoutes = async (flightId) => {
    if (!flightId) {
      setFlightRoutes([]);
      return;
    }

    setFlightRoutesLoading(true);
    try {
      const response = await api.get(`/api/v1/flights/${flightId}/routes`);
      if (response.data.success) {
        setFlightRoutes(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching flight routes:", err);
      setFlightRoutes([]);
    } finally {
      setFlightRoutesLoading(false);
    }
  };

  const fetchFlightRoutesForSchedule = async (flightId) => {
    if (!flightId) {
      setFlightRoutes([]);
      return;
    }

    setFlightRoutesLoading(true);
    try {
      const response = await api.get(`/api/v1/flights/${flightId}/routes`);
      if (response.data.success) {
        setFlightRoutes(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching flight routes for schedule:", err);
      setFlightRoutes([]);
    } finally {
      setFlightRoutesLoading(false);
    }
  };

  const fetchFlightSchedules = async () => {
    setFlightSchedulesLoading(true);
    try {
      const response = await api.get("/api/v1/flights/schedules");
      if (response.data.success) {
        setFlightSchedules(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching flight schedules:", err);
      setFlightSchedules([]);
    } finally {
      setFlightSchedulesLoading(false);
    }
  };

  const handleFlightScheduleSubmit = async (e) => {
    e.preventDefault();
    setFlightScheduleLoading(true);
    setFlightScheduleError("");
    setFlightScheduleSuccess(null);

    try {
      const payload = {
        ...flightScheduleFormData,
        baseFare: parseFloat(flightScheduleFormData.baseFare),
        mealOptions: flightScheduleFormData.mealOptions,
        cancellationPolicy: flightScheduleFormData.cancellationPolicy
      };

      const response = await api.post("/api/v1/flights/schedules", payload);
      
      if (response.data.success) {
        setFlightScheduleSuccess("Flight schedule created successfully!");
        setShowFlightScheduleForm(false);
        setFlightScheduleFormData({
          routeId: "",
          flightId: "",
          flightNumber: "",
          departureDate: "",
          arrivalDate: "",
          departureTime: "",
          arrivalTime: "",
          baseFare: "",
          departureTerminal: "",
          arrivalTerminal: "",
          mealOptions: ["VEG"],
          cancellationPolicy: [{ hoursBeforeDeparture: 24, refundPercentage: 75 }]
        });
        
        // Refresh schedules list
        fetchFlightSchedules();
      }
    } catch (err) {
      setFlightScheduleError(err.response?.data?.message || "Failed to create flight schedule");
    } finally {
      setFlightScheduleLoading(false);
    }
  };

  const handleCancelSchedule = async (scheduleId) => {
    try {
      const response = await api.patch(`/api/v1/flights/schedules/${scheduleId}/cancel`);
      if (response.data.success) {
        setCancelScheduleConfirm(null);
        // Refresh schedules list
        fetchFlightSchedules();
        alert(response.data.message || "Schedule cancelled successfully");
      }
    } catch (err) {
      console.error("Error cancelling schedule:", err);
      alert(err.response?.data?.message || "Failed to cancel schedule");
    }
  };

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
      boardingPoints: prev.boardingPoints.map((point, i) => 
        i === index ? { ...point, [field]: value } : point
      )
    }));
  };

  const updateDroppingPoint = (index, field, value) => {
    setScheduleFormData(prev => ({
      ...prev,
      droppingPoints: prev.droppingPoints.map((point, i) => 
        i === index ? { ...point, [field]: value } : point
      )
    }));
  };

  const stats = dashboardData ? [
    { 
      label: "Total Buses", 
      value: dashboardData.buses.total.toString(), 
      change: `${dashboardData.buses.active} active`, 
      icon: Bus, 
      color: "lime" 
    },
    { 
      label: "Total Flights", 
      value: dashboardData.flights.total.toString(), 
      change: `${dashboardData.flights.active} active`, 
      icon: Plane, 
      color: "sky" 
    },
    { 
      label: "Confirmed Bookings", 
      value: dashboardData.bookings.confirmed.toString(), 
      change: "", 
      icon: Calendar, 
      color: "green" 
    },
    { 
      label: "Total Revenue", 
      value: `₹${dashboardData.revenue.total.toLocaleString('en-IN')}`, 
      change: "", 
      icon: TrendingUp, 
      color: "teal" 
    },
  ] : [
    { label: "Total Buses", value: "—", change: "", icon: Bus, color: "lime" },
    { label: "Total Flights", value: "—", change: "", icon: Plane, color: "sky" },
    { label: "Confirmed Bookings", value: "—", change: "", icon: Calendar, color: "green" },
    { label: "Total Revenue", value: "—", change: "", icon: TrendingUp, color: "teal" },
  ];

  const recentBookings = [
    { id: "BK001", customer: "Rahul Sharma", service: "Flight", route: "Delhi → Mumbai", amount: "₹5,499", status: "Confirmed", date: "2024-01-15" },
    { id: "BK002", customer: "Priya Patel", service: "Bus", route: "Bangalore → Chennai", amount: "₹1,200", status: "Confirmed", date: "2024-01-15" },
    { id: "BK003", customer: "Ananya Reddy", service: "Hotel", route: "Goa Resort", amount: "₹8,999", status: "Pending", date: "2024-01-14" },
    { id: "BK004", customer: "Vikram Singh", service: "Train", route: "Mumbai → Pune", amount: "₹450", status: "Confirmed", date: "2024-01-14" },
  ];

  const colorClasses = {
    lime: "from-lime-500 to-lime-600",
    emerald: "from-emerald-500 to-emerald-600",
    green: "from-green-500 to-green-600",
    teal: "from-teal-500 to-teal-600",
    sky: "from-sky-500 to-sky-600",
  };

  const renderServiceCategoryGrid = () => (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">Service Categories</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const itemCount = cat.id === "bus" ? buses.length : cat.id === "flight" ? flights.length : 0;
          const itemLabel = cat.id === "bus" ? (itemCount === 1 ? "Bus" : "Buses") : 
                           cat.id === "flight" ? (itemCount === 1 ? "Aircraft" : "Aircraft") : 
                           "Coming Soon";
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-left bg-white border-2 border-slate-200 rounded-xl p-6 ${cat.hoverBorder} hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {cat.label}
                  </h4>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-slate-900">
                  {itemCount} {itemLabel}
                </span>
                <span className="text-xs text-slate-400 ml-auto group-hover:translate-x-1 transition-transform">
                  Click to manage →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderBusServiceView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Bus Services</h3>
          <p className="text-sm text-slate-500">Manage your bus fleet</p>
        </div>
        <button 
          onClick={() => setShowCreateBusForm(true)}
          className="ml-auto flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Bus
        </button>
      </div>
      );

      {busesLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">Loading buses...</p>
        </div>
      ) : buses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Bus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Buses Yet</h3>
          <p className="text-sm text-slate-600 mb-4">Create your first bus to get started</p>
          <button
            onClick={() => setShowCreateBusForm(true)}
            className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Bus
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {buses.map((bus) => (
            <div key={bus._id} className="border border-slate-200 rounded-xl p-6 hover:border-lime-500 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{bus.busName}</h4>
                    <p className="text-xs text-slate-500">{bus.busNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  bus.status === "ACTIVE" 
                    ? "bg-green-100 text-green-700" 
                    : bus.status === "MAINTENANCE"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {bus.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-bold text-slate-900">{bus.busType?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Registration:</span>
                  <span className="font-bold text-slate-900">{bus.registrationNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Seats:</span>
                  <span className="font-bold text-slate-900">{bus.totalSeats}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Amenities:</span>
                  <span className="font-bold text-slate-900">{(bus.amenities || []).length}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setViewBusId(bus._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-lime-700 bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => setViewRoutesBus(bus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <Route className="w-3.5 h-3.5" />
                  Routes
                </button>
                <button
                  onClick={() => setEditBus(bus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(bus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFlightServiceView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Flight Services</h3>
          <p className="text-sm text-slate-500">Manage your flight fleet</p>
        </div>
        <button 
          onClick={openCreateFlightForm}
          className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Flight
        </button>
      </div>

      {flightsLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">Loading flights...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Flights Yet</h3>
          <p className="text-sm text-slate-600 mb-4">Register your first aircraft to get started</p>
          <button
            onClick={openCreateFlightForm}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Your First Flight
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {flights.map((flight) => (
            <div
              key={flight._id}
              className="border border-slate-200 rounded-xl p-6 hover:border-sky-500 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{flight.airlineName}</h4>
                    <p className="text-xs text-slate-500">{flight.registrationNumber}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    flight.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {flight.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Model:</span>
                  <span className="font-bold text-slate-900">{flight.aircraftModel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-bold text-slate-900">{flight.aircraftType.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Seats:</span>
                  <span className="font-bold text-slate-900">{flight.totalSeats}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Cabin Classes:</span>
                  <span className="font-bold text-slate-900">{(flight.cabinClasses || []).join(", ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Amenities:</span>
                  <span className="font-bold text-slate-900">{(flight.amenities || []).length}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setViewFlightId(flight._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => setEditFlight(flight)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteFlightConfirm(flight)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


  const renderComingSoonView = (category) => {
    const cat = SERVICE_CATEGORIES.find(c => c.id === category);
    const Icon = cat?.icon || Bus;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-xl font-bold text-slate-900">{cat?.label || "Service"}</h3>
        </div>
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Icon className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{cat?.label || "Coming Soon"}</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            This service management is coming soon. You'll be able to manage your {category} inventory, schedules, and bookings here.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-600 to-lime-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              V
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Vendor Dashboard</h1>
              <p className="text-xs text-slate-500">Welcome back, {user?.name || "Vendor"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="w-full px-6 sm:px-12 lg:px-20 py-8">
        {/* Quick Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Quick Search</span>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <select
                  value={searchServiceType}
                  onChange={(e) => setSearchServiceType(e.target.value)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                >
                  <option value="bus">Bus</option>
                  <option value="flight">Flight</option>
                  <option value="train">Train</option>
                  <option value="hotel">Hotel</option>
                </select>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={`Enter ${searchServiceType} ID...`}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                {searching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
          {searchError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {searchError}
            </div>
          )}
        </div>

         {/* Stats Grid */}
         {dashboardLoading ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse"></div>
                 </div>
                 <div className="h-8 bg-slate-200 rounded animate-pulse mb-2"></div>
                 <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
               </div>
             ))}
           </div>
         ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {stats.map((stat, idx) => {
               const Icon = stat.icon;
               return (
                 <div 
                   key={idx}
                   className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center shadow-lg`}>
                       <Icon className="w-6 h-6 text-white" />
                     </div>
                     {stat.change && (
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                         {stat.change}
                       </span>
                     )}
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                   <p className="text-sm text-slate-600">{stat.label}</p>
                 </div>
               );
             })}
           </div>
         )}

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
          <div className="border-b border-slate-200 px-6">
            <nav className="flex gap-8">
              {["overview", "bookings", "routes", "services", "schedule", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedCategory(null);
                    setScheduleCategory(null);
                  }}
                  className={`py-4 text-sm font-bold capitalize border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? "border-lime-500 text-lime-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Overview</h3>
                  {dashboardData && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">
                          <span className="font-bold text-slate-900">{dashboardData.schedules.totalUpcoming}</span> upcoming schedules
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {dashboardData ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Upcoming Schedules */}
                    <div className="bg-gradient-to-br from-lime-50 to-emerald-50 border-2 border-lime-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-lime-600" />
                        Upcoming Schedules
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Bus Schedules</span>
                          <span className="text-2xl font-black text-lime-600">{dashboardData.schedules.upcomingBus}</span>
                        </div>
                        <div className="w-full bg-lime-200 rounded-full h-2">
                          <div 
                            className="bg-lime-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((dashboardData.schedules.upcomingBus / Math.max(dashboardData.schedules.totalUpcoming, 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Flight Schedules</span>
                          <span className="text-2xl font-black text-sky-600">{dashboardData.schedules.upcomingFlight}</span>
                        </div>
                        <div className="w-full bg-sky-200 rounded-full h-2">
                          <div 
                            className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((dashboardData.schedules.upcomingFlight / Math.max(dashboardData.schedules.totalUpcoming, 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Fleet Status */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Bus className="w-5 h-5 text-blue-600" />
                        Fleet Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Total Buses</span>
                          <span className="text-2xl font-black text-slate-900">{dashboardData.buses.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Active</span>
                          <span className="text-lg font-bold text-green-600">{dashboardData.buses.active}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Inactive</span>
                          <span className="text-lg font-bold text-slate-500">{dashboardData.buses.inactive}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${dashboardData.buses.total > 0 ? (dashboardData.buses.active / dashboardData.buses.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Overview */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        Revenue Overview
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
                          <p className="text-3xl font-black text-emerald-600">₹{dashboardData.revenue.total.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-slate-600">Confirmed Bookings</span>
                          <span className="text-xl font-bold text-slate-900">{dashboardData.bookings.confirmed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Status */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Plane className="w-5 h-5 text-sky-600" />
                        Flight Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Total Flights</span>
                          <span className="text-2xl font-black text-slate-900">{dashboardData.flights.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Active</span>
                          <span className="text-lg font-bold text-green-600">{dashboardData.flights.active}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Inactive</span>
                          <span className="text-lg font-bold text-slate-500">{dashboardData.flights.inactive}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${dashboardData.flights.total > 0 ? (dashboardData.flights.active / dashboardData.flights.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Data Available</h3>
                    <p className="text-sm text-slate-600">Unable to load dashboard statistics</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">All Bookings</h3>
                <p className="text-sm text-slate-600">Manage all your bookings here</p>
              </div>
            )}

            {activeTab === "routes" && (
              <div className="space-y-6">
                {!routeCategory ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Select Service Type</h3>
                      <p className="text-sm text-slate-600">Choose a service category to manage routes</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {SERVICE_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setRouteCategory(cat.id)}
                            className={`text-left bg-white border-2 border-slate-200 rounded-xl p-6 ${cat.hoverBorder} hover:shadow-md transition-all duration-300 group`}
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                                  {cat.label}
                                </h4>
                                <p className="text-xs text-slate-500">{cat.description}</p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform inline-block">
                              Click to manage routes →
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : routeCategory === "bus" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setRouteCategory(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Bus Routes</h3>
                        <p className="text-sm text-slate-500">Create and manage routes for your buses</p>
                      </div>
                      <button
                        onClick={() => setShowCreateRouteForm(true)}
                        disabled={buses.filter(b => b.status === "ACTIVE").length === 0}
                        className="ml-auto flex items-center gap-2 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create Route
                      </button>
                    </div>

                    {buses.filter(b => b.status === "ACTIVE").length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                        <Bus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Buses</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          You need at least one active bus before you can create a route. Go to Services → Bus Services to add or activate a bus.
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {buses.filter(b => b.status === "ACTIVE").map((bus) => (
                          <div key={bus._id} className="border border-slate-200 rounded-xl p-5 hover:border-lime-500 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                                <Bus className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">{bus.busName}</h4>
                                <p className="text-xs text-slate-500">{bus.busNumber} — {bus.busType?.replace(/_/g, " ")}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">
                              Click "Create Route" above to define a route for this bus with source, destination, and stops.
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : routeCategory === "flight" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setRouteCategory(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Flight Routes</h3>
                        <p className="text-sm text-slate-500">Create and manage routes for your flights</p>
                      </div>
                      <button
                        onClick={() => setShowFlightRouteForm(true)}
                        disabled={flights.length === 0}
                        className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create Route
                      </button>
                    </div>

                    {flights.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                        <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Flights Available</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          You need at least one flight before you can create a route. Go to Services → Flight Services to register an aircraft.
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {flights.map((flight) => (
                          <div key={flight._id} className="border border-slate-200 rounded-xl p-5 hover:border-sky-500 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                                <Plane className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">{flight.airlineName}</h4>
                                <p className="text-xs text-slate-500">{flight.registrationNumber} — {flight.aircraftModel}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-3">
                              Click "Create Route" above to define a route for this flight with source, destination, and stops.
                            </p>
                            <button
                              onClick={() => setViewFlightRoutes(flight._id)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                            >
                              <Route className="w-3.5 h-3.5" />
                              View Routes
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    {SERVICE_CATEGORIES.find(c => c.id === routeCategory)?.icon && (
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        {(() => {
                          const Icon = SERVICE_CATEGORIES.find(c => c.id === routeCategory).icon;
                          return <Icon className="w-10 h-10 text-slate-500" />;
                        })()}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      {routeCategory === "train" && "Train route management will be available soon."}
                      {routeCategory === "hotel" && "Hotel location management will be available soon."}
                    </p>
                    <button
                      onClick={() => setRouteCategory(null)}
                      className="mt-4 inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
                    >
                      Back to Categories
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "services" && (
              <>
                {selectedCategory === null && renderServiceCategoryGrid()}
                {selectedCategory === "bus" && renderBusServiceView()}
                {selectedCategory === "flight" && renderFlightServiceView()}
                {(selectedCategory === "train" || selectedCategory === "hotel") && renderComingSoonView(selectedCategory)}
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
                          <button
                            key={cat.id}
                            onClick={() => setScheduleCategory(cat.id)}
                            className={`text-left bg-white border-2 border-slate-200 rounded-xl p-6 ${cat.hoverBorder} hover:shadow-md transition-all duration-300 group`}
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                                  {cat.label}
                                </h4>
                                <p className="text-xs text-slate-500">{cat.description}</p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform inline-block">
                              Click to schedule →
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : scheduleCategory === "bus" ? (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => { setScheduleCategory(null); setShowScheduleForm(false); }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Schedule Bus Trip</h3>
                        <p className="text-sm text-slate-500">Create a new bus schedule</p>
                      </div>
                    </div>

                    {!showScheduleForm ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                        <Bus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Schedule</h3>
                        <p className="text-sm text-slate-600 mb-4">Click the button below to create a new bus schedule</p>
                        <button
                          onClick={() => setShowScheduleForm(true)}
                          className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Create New Schedule
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleScheduleSubmit} className="space-y-6">
                        {scheduleSuccess && (
                          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {scheduleSuccess}
                          </div>
                        )}
                        {scheduleError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {scheduleError}
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Bus *</label>
                            <select
                              value={scheduleFormData.busId}
                              onChange={(e) => {
                                const busId = e.target.value;
                                setScheduleFormData({ ...scheduleFormData, busId, routeId: "" });
                                fetchBusRoutes(busId);
                              }}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                              required
                            >
                              <option value="">Choose a bus...</option>
                              {buses.filter(b => b.status === "ACTIVE").map(bus => (
                                <option key={bus._id} value={bus._id}>
                                  {bus.busName} ({bus.busNumber})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Route *</label>
                            <select
                              value={scheduleFormData.routeId}
                              onChange={(e) => setScheduleFormData({ ...scheduleFormData, routeId: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                              required
                              disabled={!scheduleFormData.busId || busRoutesLoading}
                            >
                              <option value="">Choose a route...</option>
                              {busRoutes.map(route => (
                                <option key={route._id} value={route._id}>
                                  {route.source.city} -- {route.destination.city}
                                </option>
                              ))}
                            </select>
                            {busRoutesLoading && (
                              <p className="text-xs text-slate-500 mt-1">Loading routes...</p>
                            )}
                            {!scheduleFormData.busId && (
                              <p className="text-xs text-amber-600 mt-1">Please select a bus first</p>
                            )}
                            {scheduleFormData.busId && !busRoutesLoading && busRoutes.length === 0 && (
                              <p className="text-xs text-amber-600 mt-1">No routes available. Create routes in the Routes tab first.</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Departure Date *</label>
                            <input
                              type="date"
                              value={scheduleFormData.departureDate}
                              onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureDate: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Departure Time *</label>
                            <input
                              type="time"
                              value={scheduleFormData.departureTime}
                              onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureTime: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Time *</label>
                            <input
                              type="time"
                              value={scheduleFormData.arrivalTime}
                              onChange={(e) => setScheduleFormData({ ...scheduleFormData, arrivalTime: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Base Fare (₹) *</label>
                            <input
                              type="number"
                              value={scheduleFormData.baseFare}
                              onChange={(e) => setScheduleFormData({ ...scheduleFormData, baseFare: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                              required
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>

                        {/* Boarding Points */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700">Boarding Points</label>
                            <button
                              type="button"
                              onClick={addBoardingPoint}
                              className="text-xs font-bold text-lime-600 hover:text-lime-700"
                            >
                              + Add Point
                            </button>
                          </div>
                          {scheduleFormData.boardingPoints.map((point, index) => (
                            <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
                              <input
                                type="text"
                                placeholder="City"
                                value={point.city}
                                onChange={(e) => updateBoardingPoint(index, "city", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Name"
                                value={point.name}
                                onChange={(e) => updateBoardingPoint(index, "name", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Time (HH:mm)"
                                value={point.time}
                                onChange={(e) => updateBoardingPoint(index, "time", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Address"
                                value={point.address}
                                onChange={(e) => updateBoardingPoint(index, "address", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Landmark"
                                value={point.landmark}
                                onChange={(e) => updateBoardingPoint(index, "landmark", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Dropping Points */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700">Dropping Points</label>
                            <button
                              type="button"
                              onClick={addDroppingPoint}
                              className="text-xs font-bold text-lime-600 hover:text-lime-700"
                            >
                              + Add Point
                            </button>
                          </div>
                          {scheduleFormData.droppingPoints.map((point, index) => (
                            <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
                              <input
                                type="text"
                                placeholder="City"
                                value={point.city}
                                onChange={(e) => updateDroppingPoint(index, "city", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Name"
                                value={point.name}
                                onChange={(e) => updateDroppingPoint(index, "name", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Time (HH:mm)"
                                value={point.time}
                                onChange={(e) => updateDroppingPoint(index, "time", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Address"
                                value={point.address}
                                onChange={(e) => updateDroppingPoint(index, "address", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                              <input
                                type="text"
                                placeholder="Landmark"
                                value={point.landmark}
                                onChange={(e) => updateDroppingPoint(index, "landmark", e.target.value)}
                                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowScheduleForm(false)}
                            className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={scheduleLoading}
                            className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
                          >
                            {scheduleLoading ? "Creating..." : "Create Schedule"}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : scheduleCategory === "flight" ? (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => { setScheduleCategory(null); setShowFlightScheduleForm(false); }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Schedule Flight Trip</h3>
                        <p className="text-sm text-slate-500">Create and manage flight schedules</p>
                      </div>
                      <button
                        onClick={() => setShowFlightScheduleForm(true)}
                        className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create Schedule
                      </button>
                    </div>

                    {/* Flight Schedules List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-slate-900">Your Flight Schedules</h4>
                        <button
                          onClick={fetchFlightSchedules}
                          className="text-sm font-bold text-sky-600 hover:text-sky-700"
                        >
                          Refresh
                        </button>
                      </div>

                      {flightSchedulesLoading ? (
                        <div className="text-center py-12">
                          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-sm text-slate-600">Loading schedules...</p>
                        </div>
                      ) : flightSchedules.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-slate-900 mb-2">No Schedules Yet</h3>
                          <p className="text-sm text-slate-600 mb-4">Create your first flight schedule to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {flightSchedules.map((schedule) => (
                            <div key={schedule._id} className="border border-slate-200 rounded-xl p-6 hover:border-sky-500 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                                    <Plane className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold text-slate-900">
                                      {schedule.flight?.airlineName || "Flight"} - {schedule.flightNumber}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                      {schedule.route?.source?.city} → {schedule.route?.destination?.city}
                                    </p>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  schedule.status === "SCHEDULED" 
                                    ? "bg-green-100 text-green-700" 
                                    : schedule.status === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                  {schedule.status}
                                </span>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Departure:</span>
                                    <span className="font-bold text-slate-900">
                                      {new Date(schedule.departureDate).toLocaleDateString('en-IN')} at {schedule.departureTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Arrival:</span>
                                    <span className="font-bold text-slate-900">
                                      {new Date(schedule.arrivalDate).toLocaleDateString('en-IN')} at {schedule.arrivalTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Base Fare:</span>
                                    <span className="font-bold text-slate-900">₹{schedule.baseFare?.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Departure Terminal:</span>
                                    <span className="font-bold text-slate-900">{schedule.departureTerminal}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Arrival Terminal:</span>
                                    <span className="font-bold text-slate-900">{schedule.arrivalTerminal}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Meal Options:</span>
                                    <span className="font-bold text-slate-900">{(schedule.mealOptions || []).join(", ")}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Cancellation Policy */}
                              {schedule.cancellationPolicy && schedule.cancellationPolicy.length > 0 && (
                                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                                  <p className="text-xs font-semibold text-slate-700 mb-2">Cancellation Policy</p>
                                  <div className="space-y-1">
                                    {schedule.cancellationPolicy.map((policy, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">
                                          {policy.hoursBeforeDeparture}h before departure
                                        </span>
                                        <span className="font-bold text-slate-900">{policy.refundPercentage}% refund</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              {schedule.status === "SCHEDULED" && (
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                                  <button
                                    onClick={() => setCancelScheduleConfirm(schedule)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Cancel Schedule
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    {SERVICE_CATEGORIES.find(c => c.id === scheduleCategory)?.icon && (
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        {(() => {
                          const Icon = SERVICE_CATEGORIES.find(c => c.id === scheduleCategory).icon;
                          return <Icon className="w-10 h-10 text-slate-500" />;
                        })()}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      {scheduleCategory === "train" && "Train scheduling will be available soon. You'll be able to manage train schedules and routes here."}
                      {scheduleCategory === "hotel" && "Hotel scheduling will be available soon. You'll be able to manage hotel bookings and availability here."}
                    </p>
                    <button
                      onClick={() => setScheduleCategory(null)}
                      className="mt-4 inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
                    >
                      Back to Categories
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Reports</h3>
                <p className="text-sm text-slate-600">View detailed analytics and generate reports</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Bus</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.busName}</strong> ({deleteConfirm.busNumber})?
                This will also delete all associated routes and schedules. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBus(deleteConfirm._id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Flight Confirmation Modal */}
      {deleteFlightConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Flight</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete <strong>{deleteFlightConfirm.airlineName}</strong> ({deleteFlightConfirm.registrationNumber})?
                This will also delete all associated routes and schedules. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteFlightConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteFlight(deleteFlightConfirm._id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Bus Modal */}
      {showCreateBusForm && (
        <CreateBusForm 
          onClose={() => setShowCreateBusForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Create Flight Modal */}
      {showCreateFlightForm && (
        <CreateFlightForm
          key={flightFormKey}
          onClose={() => setShowCreateFlightForm(false)}
          onSuccess={handleCreateFlightSuccess}
        />
      )}

      {/* Edit Flight Modal */}
      {editFlight && (
        <CreateFlightForm
          key={editFlight._id}
          flight={editFlight}
          isEdit={true}
          onClose={() => setEditFlight(null)}
          onSuccess={handleUpdateFlight}
        />
      )}

      {/* Edit Bus Modal */}
      {editBus && (
        <EditBusForm
          bus={editBus}
          onClose={() => setEditBus(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* View Bus Detail Modal */}
      {viewBusId && (
        <BusDetailModal
          busId={viewBusId}
          onClose={() => setViewBusId(null)}
        />
      )}

      {/* View Flight Detail Modal */}
      {viewFlightId && (
        <FlightDetailModal
          flightId={viewFlightId}
          onClose={() => setViewFlightId(null)}
        />
      )}

      {/* Create Route Modal */}
      {showCreateRouteForm && (
        <CreateRouteForm
          buses={buses}
          onClose={() => setShowCreateRouteForm(false)}
          onSuccess={() => {
            setShowCreateRouteForm(false);
            alert("Route created successfully!");
          }}
        />
      )}

      {/* View Bus Routes Modal */}
      {viewRoutesBus && (
        <BusRoutesModal
          bus={viewRoutesBus}
          onClose={() => setViewRoutesBus(null)}
        />
      )}

      {/* View Flight Routes Modal */}
      {viewFlightRoutes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Flight Routes</h2>
              <button
                onClick={() => setViewFlightRoutes(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6">
              {flightRoutesLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-slate-600">Loading routes...</p>
                </div>
              ) : flightRoutes.length === 0 ? (
                <div className="text-center py-12">
                  <Route className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Routes Found</h3>
                  <p className="text-sm text-slate-600">This flight doesn't have any routes yet. Create a route to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flightRoutes.map((route, index) => (
                    <div key={route._id || index} className="border border-slate-200 rounded-xl p-5 hover:border-sky-500 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                          <Route className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Route {index + 1}</h4>
                          <p className="text-xs text-slate-500">
                            {route.source?.city} → {route.destination?.city}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Source */}
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Source</p>
                          <p className="text-sm font-bold text-slate-900">{route.source?.name}</p>
                          <p className="text-xs text-slate-600">
                            {route.source?.city}, {route.source?.country} ({route.source?.iataCode})
                          </p>
                        </div>

                        {/* Stops */}
                        {route.stops && route.stops.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Stops</p>
                            <div className="space-y-2">
                              {route.stops.map((stop, stopIndex) => (
                                <div key={stopIndex} className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                                    {stop.order || stopIndex + 1}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">{stop.name}</p>
                                    <p className="text-xs text-slate-600">
                                      {stop.city} ({stop.iataCode}) - {stop.arrivalTime} to {stop.departureTime}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Destination */}
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
                          <p className="text-sm font-bold text-slate-900">{route.destination?.name}</p>
                          <p className="text-xs text-slate-600">
                            {route.destination?.city}, {route.destination?.country} ({route.destination?.iataCode})
                          </p>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Distance</p>
                            <p className="text-sm font-bold text-slate-900">{route.distanceInKm} km</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Duration</p>
                            <p className="text-sm font-bold text-slate-900">{route.estimatedDurationInMinutes} min</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Flight Route Form Modal */}
      {showFlightRouteForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Create Flight Route</h2>
              <button
                onClick={() => setShowFlightRouteForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleFlightRouteSubmit} className="p-6 space-y-6">
              {flightRouteSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {flightRouteSuccess}
                </div>
              )}
              {flightRouteError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {flightRouteError}
                </div>
              )}

              {/* Flight Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Flight Details
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Flight *</label>
                  <select
                    value={flightRouteFormData.flightId}
                    onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, flightId: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  >
                    <option value="">Choose a flight...</option>
                    {flights.map(flight => (
                      <option key={flight._id} value={flight._id}>
                        {flight.airlineName} ({flight.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Route Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Source Airport with Autocomplete */}
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Source Airport *</label>
                    <input
                      type="text"
                      value={flightRouteFormData.source.name}
                      onChange={(e) => {
                        setFlightRouteFormData({
                          ...flightRouteFormData,
                          source: { ...flightRouteFormData.source, name: e.target.value }
                        });
                        searchAirports(e.target.value);
                        setShowSourceSuggestions(true);
                      }}
                      onFocus={() => flightRouteFormData.source.name && setShowSourceSuggestions(true)}
                      required
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="Search airport (e.g., Delhi, DEL, Indira Gandhi)"
                    />
                    {showSourceSuggestions && airportSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {airportSuggestions.map((airport, index) => (
                          <div
                            key={index}
                            onClick={() => selectAirport(airport, "source")}
                            className="px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          >
                            <p className="text-sm font-bold text-slate-900">{airport.displayText}</p>
                            <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Source IATA Code *</label>
                    <input
                      type="text"
                      value={flightRouteFormData.source.iataCode}
                      onChange={(e) => setFlightRouteFormData({
                        ...flightRouteFormData,
                        source: { ...flightRouteFormData.source, iataCode: e.target.value.toUpperCase() }
                      })}
                      required
                      maxLength="3"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., DEL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Source City *</label>
                    <input
                      type="text"
                      value={flightRouteFormData.source.city}
                      onChange={(e) => setFlightRouteFormData({
                        ...flightRouteFormData,
                        source: { ...flightRouteFormData.source, city: e.target.value }
                      })}
                      required
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., Delhi"
                    />
                  </div>

                  {/* Destination Airport with Autocomplete */}
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination Airport *</label>
                    <input
                      type="text"
                      value={flightRouteFormData.destination.name}
                      onChange={(e) => {
                        setFlightRouteFormData({
                          ...flightRouteFormData,
                          destination: { ...flightRouteFormData.destination, name: e.target.value }
                        });
                        searchAirports(e.target.value);
                        setShowDestSuggestions(true);
                      }}
                      onFocus={() => flightRouteFormData.destination.name && setShowDestSuggestions(true)}
                      required
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="Search airport (e.g., Mumbai, BOM, Chhatrapati Shivaji)"
                    />
                    {showDestSuggestions && airportSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {airportSuggestions.map((airport, index) => (
                          <div
                            key={index}
                            onClick={() => selectAirport(airport, "destination")}
                            className="px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          >
                            <p className="text-sm font-bold text-slate-900">{airport.displayText}</p>
                            <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination IATA Code *</label>
                    <input
                      type="text"
                      value={flightRouteFormData.destination.iataCode}
                      onChange={(e) => setFlightRouteFormData({
                        ...flightRouteFormData,
                        destination: { ...flightRouteFormData.destination, iataCode: e.target.value.toUpperCase() }
                      })}
                      required
                      maxLength="3"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., BOM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination City *</label>
                    <input
                      type="text"
                      value={flightRouteFormData.destination.city}
                      onChange={(e) => setFlightRouteFormData({
                        ...flightRouteFormData,
                        destination: { ...flightRouteFormData.destination, city: e.target.value }
                      })}
                      required
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                </div>
              </div>

              {/* Stops */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Stops (Optional)
                  </h3>
                  <button
                    type="button"
                    onClick={addFlightStop}
                    className="text-sm font-bold text-sky-600 hover:text-sky-700"
                  >
                    + Add Stop
                  </button>
                </div>
                {flightRouteFormData.stops.length === 0 ? (
                  <p className="text-sm text-slate-500">No stops added. This will be a direct flight.</p>
                ) : (
                  <div className="space-y-3">
                    {flightRouteFormData.stops.map((stop, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-slate-700">Stop {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              setFlightRouteFormData(prev => ({
                                ...prev,
                                stops: prev.stops.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          {/* Stop Airport with Autocomplete */}
                          <div className="relative">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Airport Name</label>
                            <input
                              type="text"
                              value={stop.name}
                              onChange={(e) => {
                                updateFlightStop(index, "name", e.target.value);
                                searchAirports(e.target.value);
                                setShowStopSuggestions(prev => ({ ...prev, [index]: true }));
                              }}
                              onFocus={() => stop.name && setShowStopSuggestions(prev => ({ ...prev, [index]: true }))}
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                              placeholder="Search airport"
                            />
                            {showStopSuggestions[index] && airportSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {airportSuggestions.map((airport, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => selectStopAirport(airport, index)}
                                    className="px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                                  >
                                    <p className="text-sm font-bold text-slate-900">{airport.displayText}</p>
                                    <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">IATA Code</label>
                            <input
                              type="text"
                              value={stop.iataCode}
                              onChange={(e) => updateFlightStop(index, "iataCode", e.target.value.toUpperCase())}
                              maxLength="3"
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                              placeholder="e.g., BLR"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                            <input
                              type="text"
                              value={stop.city}
                              onChange={(e) => updateFlightStop(index, "city", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Arrival Time</label>
                            <input
                              type="time"
                              value={stop.arrivalTime}
                              onChange={(e) => updateFlightStop(index, "arrivalTime", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Departure Time</label>
                            <input
                              type="time"
                              value={stop.departureTime}
                              onChange={(e) => updateFlightStop(index, "departureTime", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Minutes from Source</label>
                            <input
                              type="number"
                              value={stop.minutesFromSource}
                              onChange={(e) => updateFlightStop(index, "minutesFromSource", parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Additional Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Distance (km) *</label>
                    <input
                      type="number"
                      value={flightRouteFormData.distanceInKm}
                      onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, distanceInKm: e.target.value })}
                      required
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., 1150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimated Duration (minutes) *</label>
                    <input
                      type="number"
                      value={flightRouteFormData.estimatedDurationInMinutes}
                      onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, estimatedDurationInMinutes: e.target.value })}
                      required
                      min="0"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., 135"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFlightRouteForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={flightRouteLoading}
                  className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {flightRouteLoading ? "Creating Route..." : "Create Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flight Schedule Form Modal */}
      {showFlightScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Create Flight Schedule</h2>
              <button
                onClick={() => setShowFlightScheduleForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleFlightScheduleSubmit} className="p-6 space-y-6">
              {flightScheduleSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {flightScheduleSuccess}
                </div>
              )}
              {flightScheduleError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {flightScheduleError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Flight *</label>
                  <select
                    value={flightScheduleFormData.flightId}
                    onChange={(e) => {
                      const flightId = e.target.value;
                      setFlightScheduleFormData({ ...flightScheduleFormData, flightId, routeId: "" });
                      // Fetch routes for selected flight
                      if (flightId) {
                        fetchFlightRoutesForSchedule(flightId);
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  >
                    <option value="">Choose a flight...</option>
                    {flights.map(flight => (
                      <option key={flight._id} value={flight._id}>
                        {flight.airlineName} ({flight.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Flight Number *</label>
                  <input
                    type="text"
                    value={flightScheduleFormData.flightNumber}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, flightNumber: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                    placeholder="e.g., 6E-204"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Route *</label>
                  <select
                    value={flightScheduleFormData.routeId}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, routeId: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                    disabled={!flightScheduleFormData.flightId || flightRoutesLoading}
                  >
                    <option value="">Choose a route...</option>
                    {flightRoutes.map(route => (
                      <option key={route._id} value={route._id}>
                        {route.source?.city} → {route.destination?.city}
                      </option>
                    ))}
                  </select>
                  {flightRoutesLoading && (
                    <p className="text-xs text-slate-500 mt-1">Loading routes...</p>
                  )}
                  {!flightScheduleFormData.flightId && (
                    <p className="text-xs text-amber-600 mt-1">Please select a flight first</p>
                  )}
                  {flightScheduleFormData.flightId && !flightRoutesLoading && flightRoutes.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No routes available. Create routes for this flight first.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Base Fare (₹) *</label>
                  <input
                    type="number"
                    value={flightScheduleFormData.baseFare}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, baseFare: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 4500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Departure Date *</label>
                  <input
                    type="date"
                    value={flightScheduleFormData.departureDate}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, departureDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Date *</label>
                  <input
                    type="date"
                    value={flightScheduleFormData.arrivalDate}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, arrivalDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Departure Time *</label>
                  <input
                    type="time"
                    value={flightScheduleFormData.departureTime}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, departureTime: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Time *</label>
                  <input
                    type="time"
                    value={flightScheduleFormData.arrivalTime}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, arrivalTime: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Departure Terminal *</label>
                  <input
                    type="text"
                    value={flightScheduleFormData.departureTerminal}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, departureTerminal: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                    placeholder="e.g., Terminal 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Terminal *</label>
                  <input
                    type="text"
                    value={flightScheduleFormData.arrivalTerminal}
                    onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, arrivalTerminal: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                    placeholder="e.g., T2"
                  />
                </div>
              </div>

              {/* Meal Options */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Meal Options</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={flightScheduleFormData.mealOptions.includes("VEG")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlightScheduleFormData({
                            ...flightScheduleFormData,
                            mealOptions: [...flightScheduleFormData.mealOptions, "VEG"]
                          });
                        } else {
                          setFlightScheduleFormData({
                            ...flightScheduleFormData,
                            mealOptions: flightScheduleFormData.mealOptions.filter(m => m !== "VEG")
                          });
                        }
                      }}
                      className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={flightScheduleFormData.mealOptions.includes("NON_VEG")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlightScheduleFormData({
                            ...flightScheduleFormData,
                            mealOptions: [...flightScheduleFormData.mealOptions, "NON_VEG"]
                          });
                        } else {
                          setFlightScheduleFormData({
                            ...flightScheduleFormData,
                            mealOptions: flightScheduleFormData.mealOptions.filter(m => m !== "NON_VEG")
                          });
                        }
                      }}
                      className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700">Non-Vegetarian</span>
                  </label>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cancellation Policy</label>
                <div className="space-y-2">
                  {flightScheduleFormData.cancellationPolicy.map((policy, index) => (
                    <div key={index} className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Hours Before Departure</label>
                        <input
                          type="number"
                          value={policy.hoursBeforeDeparture}
                          onChange={(e) => {
                            const newPolicy = [...flightScheduleFormData.cancellationPolicy];
                            newPolicy[index] = { ...newPolicy[index], hoursBeforeDeparture: parseInt(e.target.value) || 0 };
                            setFlightScheduleFormData({ ...flightScheduleFormData, cancellationPolicy: newPolicy });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Refund Percentage</label>
                        <input
                          type="number"
                          value={policy.refundPercentage}
                          onChange={(e) => {
                            const newPolicy = [...flightScheduleFormData.cancellationPolicy];
                            newPolicy[index] = { ...newPolicy[index], refundPercentage: parseInt(e.target.value) || 0 };
                            setFlightScheduleFormData({ ...flightScheduleFormData, cancellationPolicy: newPolicy });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFlightScheduleForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={flightScheduleLoading}
                  className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {flightScheduleLoading ? "Creating..." : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Schedule Confirmation Modal */}
      {cancelScheduleConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Flight Schedule</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to cancel this flight schedule? All confirmed bookings will be automatically refunded in full. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelScheduleConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Keep Schedule
                </button>
                <button
                  onClick={() => handleCancelSchedule(cancelScheduleConfirm._id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}