import {Routes, Route} from 'react-router-dom';
import {EmailLogin} from './Authentication/EmailLogin.jsx';
import {GetUserDetail} from "./forms ui/GetUserDetail.jsx";
import MainPage from "./MainPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { VendorProtectedRoute } from "./components/ProtectedRoute.jsx";
import ExplorePlace from "./ExplorePlace.jsx";
import BusBooking from "./booking/BusBooking/BusBooking.jsx"
import SeatSelection from "./booking/BusBooking/SeatSelection.jsx"
import ForgotPassword from "./Authentication/ForgotPassword.jsx";
import ResetPassword from "./Authentication/ResetPassword.jsx";
import BookingSummary from "./booking/BusBooking/BookingSummary.jsx";
import UserProfile from "./UserProfile.jsx";
import FlightBooking from "./booking/FlightBooking/FlightBooking.jsx";
import HotelBooking from "./booking/HotelBooking/HotelBooking.jsx";
import FlightCheckoutPage from "./booking/FlightBooking/FlightCheckoutPage.jsx";
import FlightSeatSelection from "./booking/FlightBooking/FlightSeatSelection.jsx";
import VendorDashboard from "./VendorDashboard.jsx";
import TicketDetails from "./booking/BusBooking/TicketDetails.jsx";
import CheckoutPage from "./booking/BusBooking/CheckoutPage.jsx";
import SeatConfirmation from "./booking/BusBooking/SeatConfirmation.jsx";
import VendorEmailSignUp from "./Authentication/vendor/VendorEmailSignUp.jsx";


export function Router (){
    return(
<Routes>
    <Route path='/' element={<MainPage/>}/>
    <Route path='/login' element={<EmailLogin/>}/>
    <Route path='/GetUserDetail' element={<GetUserDetail/>}/>
    <Route path='/MainPage' element={<MainPage/>}/>
    <Route path='/profile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
    <Route path='/ExplorePlace' element={<ExplorePlace/>}/>
    <Route path='/busbooking' element={<BusBooking/>}/>  
    <Route path='/SeatSelection' element={<SeatSelection/>}/>  
    <Route path='/ForgotPassword' element={<ForgotPassword/>}/>  
    <Route path='/ResetPassword' element={<ResetPassword/>}/>  
    <Route path='/BookingSummary' element={<BookingSummary/>}/>  
    <Route path='/flightbooking' element={<FlightBooking/>}/>  
    <Route path='/flight-checkout' element={<FlightCheckoutPage/>}/>  
    <Route path='/flight-seat-selection' element={<FlightSeatSelection/>}/>  
    <Route path='/hotelbooking' element={<HotelBooking/>}/>  
    <Route path='/TicketDetails' element={<TicketDetails/>}/>  
    <Route path='/checkout' element={<CheckoutPage/>}/>  
    <Route path='/seatconfirmation' element={<SeatConfirmation/>}/>  
    <Route path='/vendordashboard' element={<VendorProtectedRoute><VendorDashboard/></VendorProtectedRoute>}/>  
    {/* <Route path='/VendorEmailLogin' element={<VendorEmailLogin/>}/>   */}
    <Route path='/VendorEmailSignUp' element={<VendorEmailSignUp/>}/>  



</Routes>
    );
}