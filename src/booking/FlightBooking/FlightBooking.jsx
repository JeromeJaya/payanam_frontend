import Nav from "../../NavComponent.jsx"
import WhereToWhere from "../../search/WhereToWhere.jsx"
import BusCard from "../../cards/BusCard.jsx"
import BusFillterBar from "../../filter/BusFillterBar.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"


export default function FlightBooking(){
    return(
        <>
            <Nav/>
                <WhereToWhere className= " shadow-xl sticky top-20 "/>
            <div className = "bg-mist-50 h-auto my-5 mx-[100px] flex">
                <div className = "filter bg-white-200 w-[25%] h-auto rounded-lg shadow-xl">
                    <div className = "flex justify-center mt-5 font-bold">FILTERS</div>
                    <SearchheckBox title = {"Popular Filters"} text ={[" Non Stop ", " Hide Nearby Airports ", "Refundable Fares", " IndiGo ", " Late Departures ", " Air India ", "Morning Departures ",  " AfterNoon Departure ", "Early Morning Departures "  ]}/>
                    <SearchheckBox title = {"Departure Airports"} text ={["Noida International Airport (71Km) ", " Hindon Airport (32Km) ", " Indira Gandhi International Airport "]}/>
                    <SelectBox title={"AC type"} text = {["AC", "NON-AC"]}/>
                    <SelectBox title ="Seat type" text = {["seater", "sleeper"]}/>
                    <Checkbox title = {"Single Seater/Sleeper"} text = {["Single Seats"]}/>
                    <SearchheckBox title = {"Pick up point - Hyderabad, Telangana"} text= {["Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar"]}/>
                    <SelectBox text={["12 AM - 6AM", "6 AM - 12 PM","12 PM - 6 PM","6 PM - 12 AM"]} title = {"Pick up time - Hyderabad, Telangana"}/>
                    <SearchheckBox title = {"Operators"} text ={["FlixBus", "Bmcc Travels", "IntrCity SmartBus", "Jabbar Travels", "National travels","BigBus","Tranzindia Travels" ]}/>
                    <SearchheckBox title = {"Drop point - Bangalore, Karnataka"} text ={["Kempegowda International Airport Be", "Yelahanka", "Hebbal", "Hennur Cross"]}/>
                    <SelectBox text={["12 AM - 6AM", "6 AM - 12 PM","12 PM - 6 PM","6 PM - 12 AM" ]} title ="Drop time - Bangalore, Karnataka"/>
                    
                </div>
                <div className = "bg-neutral-200 w-[80%] ml-[2%] px-5 rounded-lg shadow-xl flex flex-col">
                    <div className = "bg-white w-full h-auto my-5 rounded-3xl shadow-xl">
                        <BusFillterBar/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                    <div className = "bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                        <BusCard/>
                    </div>
                </div>
            </div>
        </>
);
}