import { useState } from "react";
import { Banner } from "./cards/Banner.jsx";

export function Service() {
  const [service, setService] = useState("flight");
  const [formData, setFormData] = useState({});

  const formFields = {
    flight: [
      { name: "from", label: "From Where", type: "text" },
      { name: "to", label: "To Where", type: "text" },
      { name: "departure", label: "Departure", type: "date" },
      { name: "travellers", label: "Travellers", type: "number" },
    ],
    hotel: [
      { name: "city", label: "City", type: "text" },
      { name: "checkin", label: "Check In", type: "date" },
      { name: "checkout", label: "Check Out", type: "date" },
      { name: "guests", label: "Guests", type: "number" },
      { name: "NoOfRooms", label: "No. of Rooms", type: "number" },
    ],
    bus: [
      { name: "from", label: "From", type: "text" },
      { name: "to", label: "To", type: "text" },
      { name: "date", label: "Journey Date", type: "date" },
      { name: "NoOfSeats", label: "Number of Seats", type: "number" },
      { name: "AC", label: "AC / Non-AC", type: "text" },
    ],
    train: [
      { name: "from", label: "From", type: "text" },
      { name: "to", label: "To", type: "text" },
      { name: "date", label: "Journey Date", type: "date" },
      { name: "class", label: "Class", type: "text" },
      { name: "quota", label: "Quota", type: "text" },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {/* Service Selection Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Banner
          title="Flight"
          text="Payanam Flight Booking helps travelers discover and reserve flights quickly, securely, and conveniently."
          onClick={() => setService("flight")}
          className="flex-1 min-w-[200px] bg-lime-100 hover:bg-lime-200 border-2 border-lime-300 rounded-lg p-4 cursor-pointer transition-all"
        />
        <Banner
          title="Hotel"
          text="Payanam Hotel Booking helps travelers find the perfect accommodation for their stay."
          onClick={() => setService("hotel")}
          className="flex-1 min-w-[200px] bg-lime-100 hover:bg-lime-200 border-2 border-lime-300 rounded-lg p-4 text-lime-800 font-semibold transition-all"
        />
        <Banner
          title="Bus"
          text="Payanam Bus Booking helps travelers get around efficiently and comfortably."
          onClick={() => setService("bus")}
          className="flex-1 min-w-[200px] bg-lime-100 hover:bg-lime-200 border-2 border-lime-300 rounded-lg p-4 text-lime-800 font-semibold transition-all"
        />
        <Banner
          title="Train"
          text="Payanam Train Booking helps travelers travel efficiently and affordably."
          onClick={() => setService("train")}
          className="flex-1 min-w-[200px] bg-lime-100 hover:bg-lime-200 border-2 border-lime-300 rounded-lg p-4 text-lime-800 font-semibold transition-all"
        />
      </div>

      {/* Dynamic Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Data sent successfully:", formData);
        }}
        className="bg-white p-6 rounded-xl shadow-lg border border-lime-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
          {formFields[service].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-lime-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="border-2 border-lime-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                required={field.name !== "sample"} // Optional: Skip validation for "sample" field
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </form>
    </div>
  );
}