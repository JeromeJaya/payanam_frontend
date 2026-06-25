import React, { useState, useEffect } from 'react';

// Sample Layout Configuration data based on the provided image
// 'S' = Seating, 'L' = Sleeper (Longer aspect ratio)
// Status: 'available', 'male_booked', 'female_booked', 'selected'
const INITIAL_LAYOUT = {
  berthType: "LOWER BERTH",
  columns: 3, // 1 row on left, aisle, 2 rows on right
  grid: [
    // Row 1
    [
      { id: 'L1', type: 'L', price: 1539, status: 'male_booked', gender: 'male' },
      { id: 'L2', type: 'L', price: 1339, status: 'available' },
      { id: 'L3', type: 'L', price: 1339, status: 'female_booked', gender: 'female' }
    ],
    // Row 2
    [
      { id: 'L4', type: 'L', price: 1619, status: 'female_booked', gender: 'female' },
      { id: 'S1', type: 'S', price: 899, status: 'available' },
      { id: 'S2', type: 'S', price: 899, status: 'available' }
    ],
    // Row 3
    [
      { id: 'L5', type: 'L', price: 1619, status: 'available' },
      { id: 'S3', type: 'S', price: 899, status: 'available' },
      { id: 'S4', type: 'S', price: 899, status: 'available' }
    ],
    // Row 4
    [
      { id: 'L6', type: 'L', price: 1619, status: 'available' },
      { id: 'S5', type: 'S', price: 899, status: 'available' },
      { id: 'S6', type: 'S', price: 899, status: 'female_booked', gender: 'female', isSleeperWindow: false }
    ],
    // Row 5
    [
      { id: 'L7', type: 'L', price: 1539, status: 'available' },
      { id: 'L8', type: 'L', price: 1339, status: 'available' },
      { id: 'L9', type: 'L', price: 1339, status: 'available' }
    ],
    // Row 6
    [
      { id: 'L10', type: 'L', price: 1379, status: 'available' },
      { id: 'L11', type: 'L', price: 1149, status: 'available' },
      { id: 'L12', type: 'L', price: 1149, status: 'available' }
    ]
  ]
};

export default function BusSeatLayout({ busName = 'Bus', onChange}) {
  const [layout, setLayout] = useState(INITIAL_LAYOUT);
    const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'male_booked' || seat.status === 'female_booked') return;

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  useEffect(() => {
    const allSeats = layout.grid.flat();
    const selectedDetails = allSeats.filter(s => selectedSeats.includes(s.id));
    const total = selectedDetails.reduce((sum, s) => sum + (s.price || 0), 0);
    if (typeof onChange === 'function') {
      onChange({ busName, seats: selectedSeats, total });
    }
  }, [selectedSeats, layout]);

  // Helper icons to closely match your image structure
  const PersonIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );

  const SteeringWheel = () => (
    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center h-180 w-60 bg-gray-100 p-4 font-sans text-gray-700">
      <div className="">
        
        {/* Berth Title */}
        <div className="text-center font-bold text-gray-500 tracking-wider text-sm mb-4">
          {layout.berthType}(2)
        </div>

        {/* Bus Container Canvas */}
        <div className="border border-gray-200 rounded-2xl p-4 relative bg-white">
          
          {/* Driver Cabin Indicator */}
          <div className="flex justify-end mb-6 pr-1">
            <SteeringWheel />
          </div>

          {/* Dynamic Grid System */}
          <div className="flex flex-col gap-5">
            {layout.grid.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-x-2 items-center">
                {row.map((seat, colIndex) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isMale = seat.status === 'male_booked';
                  const isFemale = seat.status === 'female_booked';
                  
                  // Style configurations matching the UI states
                  let cardStyles = "border border-gray-200 bg-gray-50/30 text-gray-400";
                  let iconStyles = "text-gray-300";
                  
                  if (isSelected) {
                    cardStyles = "border-2 border-blue-500 bg-blue-50/20 text-blue-600";
                    iconStyles = "text-blue-500";
                  } else if (isMale) {
                    cardStyles = "border border-gray-200 bg-gray-50 text-gray-300 opacity-60 cursor-not-allowed";
                    iconStyles = "text-gray-300";
                  } else if (isFemale) {
                    cardStyles = "border border-purple-300 bg-purple-50/10 text-purple-400 cursor-not-allowed";
                    iconStyles = "text-purple-400";
                  }

                  return (
                    <div 
                      key={seat.id} 
                      className={`flex flex-col
                        
                        
                        
                        gap-0 items-center justify-between cursor-pointer group transition-all select-none
                        ${colIndex === 0 ? 'mr-4' : ''} /* Creates the walk-aisle spacing after the left column */
                      `}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {/* Seat Shape Layer */}
                      {seat.type === 'L' ? (
                        /* Sleeper Berth Layout Shape */
                        <div className={`w-7 h-15 rounded flex flex-col items-center justify-between p-2 relative shadow-sm ${cardStyles}`}>
                          <PersonIcon className={`w-7 h-7 mt-1 ${iconStyles}`} />
                          <div className={`w-6 h-1.5 rounded-full bg-current opacity-40 mb-1`} />
                        </div>
                      ) : (
                        /* Classic Seating Layout Shape */
                        <div className={`w-6 h-10 rounded-xl flex items-center justify-center p-1 relative shadow-sm border-2 ${cardStyles}`}>
                          {/* Inner chair-like border framing matching the mock */}
                          <div className="w-full h-full border border-dashed border-gray-300/60 rounded-md flex items-center justify-center">
                            <PersonIcon className={`w-5 h-5 ${iconStyles}`} />
                          </div>
                        </div>
                      )}

                      {/* Seat Price Display */}
                      <span className={`text-xs mt-1 font-medium transition-colors
                        ${isSelected ? 'text-black font-bold' : 'text-gray-400'}
                        ${isFemale ? 'text-black font-semibold' : ''}
                      `}>
                        ₹{seat.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}