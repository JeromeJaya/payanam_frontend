
 import SeatArrange from "./SeatArrange.jsx"
 import Summary from "./Summary.jsx"
 import Checkbox from "../../filter/Checkbox.jsx"
 import {useState} from "react";

// Tracks selections reported by each SeatArrange instance

export default function SeatSelection (){
    const [busSelections, setBusSelections] = useState({});

    const handleSelectionChange = ({ busName, seats, total }) => {
        setBusSelections(prev => ({ ...prev, [busName]: { seats, total } }));
    };

    return(
        <>
        
        <div className = "w-full flex h-180">

            <div className = "w-auto flex flex-row gap-2">
                <div className= "bg-blue-50 w-auto h-auto rounded-3xl shadow-3xl ">
                    <SeatArrange busName={"Bus 1"} onChange={handleSelectionChange} />
                </div>
                <div className="bg-blue-200 w-auto h-auto rounded-3xl shadow-3xl ">
                    <SeatArrange busName={"Bus 2"} onChange={handleSelectionChange} />
                </div>
            </div>


            <div className = "bg-neutral-50 w-full h-auto flex flex-col rounded-3xl shadow-3xl ">

                <div className = "bg-slate-100 flex justify-center font-bold p-3 rounded "> Select Pickup & Drop Points </div>

                <div className = "flex flex-row">
                    <div className = "w-[50%] h-[70%] rounded-3xl shadow-xl overflow-x-scroll gap-2">
                        <Checkbox title = {"Pick up point - Hyderabad, Telangana"} text= {["Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar","Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar","Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar","Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar"]}/>
                    </div>
                    <div className = "w-[50%] h-[70%] rounded-3xl shadow-xl overflow-x-auto gap-2">
                        <Checkbox title = {"Pick up point - Hyderabad, Telangana"} text= {["Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar","Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar","Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar","Lakdikapul", "Khairatabad", "Punjagutta", "Ameerpet"," SR Nagar"]}/>
                    </div>
                </div>         
                      
            </div>
        </div>

       
 
        </>
    );
}
