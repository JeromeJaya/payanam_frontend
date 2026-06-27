import {useState, useEffect } from "react";
import Category from "./components/category.jsx";
import InputBox from "./components/InputBox.jsx";
import OfferCard from "./Carousels/offer1.jsx";
import { Link } from "react-router-dom";
import buses from "./assets/buses.png";
import flight from "./assets/flight.png";
import hotel from "./assets/hotel.png";
import train from "./assets/train.png";
import NavComponent from "./NavComponent.jsx";
import  SearchBar from "./search/SearchBar.jsx";
import flightBG from "./assets/flight_bg.png";
import trainBG from "./assets/train bg.png";
import busBG from "./assets/bus bg.png";
import hotelBG from "./assets/hotel bg.png";
import useNavigate from "react"

export default function App() {
  const [service, setService] = useState("bus");
  const navigate = useNavigate;
  let photo = "";
  if (service === "flight") {
    photo = flightBG;
  } else if (service === "hotel") {
    photo = hotelBG;
  } else if (service === "bus") {
    photo = busBG;
  } else if (service === "train") {
    photo = trainBG;
  }
  
  const formFields = {
    flight: [
      { name: "from", label: "From ", type: "text" ,mid:"delhi",city:"delhi", below:"DEL, Delhi Airport India"},
      { name: "to", label: "To ", type: "text" ,mid:"mumbai",city:"mumbai", below:"BOM, Mumbai Airport India"},
      { name: "departure", label: "Departure", type: "date",  below:"tuesday", mid:"2023-08-20"},
      { name: "travellers", label: "Travellers", type: "number", below:"", mid:"" },
    ],
    hotel: [
      { name: "city", label: "City, Property name or Location", type: "text", mid:"Goa, India", below:"india" },
      { name: "checkin", label: "Check In", type: "date", below:"tuesday", mid:"2023-08-20"},
      { name: "checkout", label: "Check Out", type: "date",below:"friday", mid:"2023-08-21" },
      { name: "guests", label: "Rooms & Guests", type: "number", below:"adults", mid:"1 Rooms-2Adults" },
    ],
    bus: [
      { name: "from", label: "From ", type: "text" ,mid:"trichy, tamilnadu",city:"trichy", below:"india"},
      { name: "to", label: " To ", type: "text" ,mid:"chennai, tamilnadu",city:"chennai", below:"india"},
      { name: "date", label: "Journey Date", type: "date", below:"tuesday", mid:"2023-08-20"},
      { name: "NoOfSeats", label: "Passenger count", type: "number" , below:"Adult", mid:"2 travellers"},
    ],
    train: [
      { name: "from", label: "From", type: "text", mid:"New Delhi",city:"trichy", below:"NDLS, New Delhi Railway Station" },
      { name: "to", label: "To", type: "text",  mid:"New Delhi",city:"trichy", below:"NDLS, New Delhi Railway Station"  },
      { name: "date", label: "Travel Date", type: "date", below:"tuesday", mid:"2023-08-20"},
      { name: "class", label: "Class", type: "text", below:"Sleeper Class", mid:"SL" },
    ],
  };
  useEffect(() => {
  console.log(service, "selected");
}, [service])
        let serv = formFields[service]
        // console.log(serv)
  return (
    <div className="min-h-screen bg-slate-100">
      <NavComponent />

      {/* Hero */}
      <div
        className="relative z-1 h-180 w-full"
        style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto h-full flex items-center px-6">
          <div className="text-black max-w-2xl h-full pt-10">
            <h1 className="text-4xl font-extrabold">Discover and Book Your Next Journey</h1>
            <p className="mt-3 text-lg text-black">Flights, hotels, buses and trains — find the best deals with intelligent search.</p>
            <div className=" flex gap-4">
              <Link to="/explore" className="bg-white text-blue-700 px-5 py-3 rounded-full font-semibold shadow mt-3">Explore</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="relative z-20 w-400 mx-auto -mt-130 bg-white/80 rounded-2xl shadow-xl p-6  ">
        {/* Travel Categories */}
        <div className="flex justify-center gap-15 pb-5 transperant transition-all duration-1000">
          <Category icon={<img src={flight} alt="Flights" />} title="Flights" onClick={() => setService('flight')} active={service === 'flight'} />
          <Category icon={<img src={hotel} alt="Hotels" />} title="Hotels" onClick={() => setService('hotel')} active={service === 'hotel'} />
          <Category icon={<img src={train} alt="Trains" />} title="Trains" onClick={() => setService('train')} active={service === 'train'} />
          <Category icon={<img src={buses} alt="Buses" />} title="Buses" onClick={() => setService('bus')} active={service === 'bus'} />
        </div>

        {/* Trip Type */}
        <div className="flex gap-6 mt-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="trip" defaultChecked />
            <span className="ml-2">One Way</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="trip" />
            <span className="ml-2">Round Trip</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="trip" />
            <span className="ml-2">Multi City</span>
          </label>
        </div>

        {/* Search Fields */}
        <div className="mt-6 ">
          <SearchBar input={serv} service={service} />
        </div>
      </div>

      {/* Offers */}
      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-6">Special Offers</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <OfferCard title="Flights" text="Up to 25% OFF" />
          <OfferCard title="Hotels" text="Flat ₹1500 OFF" />
          <OfferCard title="Holiday Packages" text="Save ₹5000" />
        </div>
      </section>
    </div>
    //......
//     <div
//   className="relative h-screen bg-cover bg-center"
//   style={{ backgroundImage: `url(${hotelBG})` }}
// >
//   <div className=" absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent">hi</div>

//   <div className=" z-10">
//     Your Content
//   </div>
// </div>
//.........
  );
}