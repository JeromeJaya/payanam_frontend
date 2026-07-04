import {Routes, Route} from 'react-router-dom';
import {EmailLogin} from './Authentication/EmailLogin.jsx';
import LandingPage from "./LandingPage.jsx";
import Nav from "./NavComponent.jsx";
import {GetUserDetail} from "./forms ui/GetUserDetail.jsx";
import {RightDraw} from "./forms ui/RightDraw.jsx";
import {Offers} from "./Carousels/Offers.jsx";
import {FeedBack} from "./Carousels/FeedBack.jsx";
import {EmailSignUp} from "./Authentication/EmailSignUp";
import {Service} from "./SelectService.jsx"
import {Banner} from "./cards/Banner.jsx"
import {SearchCard} from "./cards/SearchCard.jsx";
import MainPage from "./MainPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { VendorProtectedRoute } from "./components/ProtectedRoute.jsx";
import ExplorePlace from "./ExplorePlace.jsx";
import WhereToWhere from "./search/WhereToWhere.jsx";
import SearchBar from "./search/SearchBar.jsx";
import Demo from "./demo.jsx";
import BusCard from "./cards/BusCard.jsx"
import BusFillterBar from "./filter/BusFillterBar.jsx"
import Checkbox from "./filter/Checkbox.jsx";
import SearchheckBox from "./filter/SearchheckBox.jsx"
import SelectBox from "./filter/SelectBox.jsx"
import SeatArrange from "./booking/BusBooking/SeatArrange.jsx"
import BusBooking from "./booking/BusBooking/BusBooking.jsx"
import SeatSelection from "./booking/BusBooking/SeatSelection.jsx"
import ForgotPassword from "./Authentication/ForgotPassword.jsx";
import ResetPassword from "./Authentication/ResetPassword.jsx";
import BookingSummary from "./booking/BusBooking/BookingSummary.jsx";
import UserProfile from "./UserProfile.jsx";
import FlightBooking from "./booking/FlightBooking/FlightBooking.jsx";
import HotelBooking from "./booking/HotelBooking/HotelBooking.jsx";
import VendorDashboard from "./VendorDashboard.jsx";
//import VendorEmailLogin from "./Authentication/vendor/VendorEmailLogin.jsx";
import TicketDetails from "./booking/BusBooking/TicketDetails.jsx";
import CheckoutPage from "./booking/BusBooking/CheckoutPage.jsx";
import SeatConfirmation from "./booking/BusBooking/SeatConfirmation.jsx";
import VendorEmailSignUp from "./Authentication/vendor/VendorEmailSignUp.jsx";


export function Router (){
    return(
<Routes>
    <Route path='/' element={<MainPage/>}/>
    <Route path='/login' element={<EmailLogin/>}/>
    <Route path='/nav' element={<Nav/>}/>
    <Route path='/GetUserDetail' element={<GetUserDetail/>}/>
    <Route path='/RightDraw' element={<RightDraw/>}/>
    <Route path='/Offers' element={<Offers/>}/>
    <Route path='/FeedBack' element={<FeedBack/>}/>
    <Route path='/EmailSignUp' element={<EmailSignUp/>}/>
    <Route path='/Service' element={<Service/>}/>  
    <Route path='/Banner' element={<Banner/>}/>
    <Route path='/searchcard' element={<SearchCard/>}/>  
    <Route path='/MainPage' element={<MainPage/>}/>
    <Route path='/profile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
    <Route path='/ExplorePlace' element={<ExplorePlace/>}/>
    <Route path='/SearchBar' element={<SearchBar/>}/>
    <Route path='/demo' element={<Demo/>}/>
    <Route path='/WhereToWhere' element={<WhereToWhere/>}/>
    <Route path='/BusCard' element={<BusCard/>}/>
    <Route path='/BusFillterBar' element={<BusFillterBar/>}/>
    <Route path='/Checkbox' element={<Checkbox/>}/>
    <Route path='/SearchheckBox' element={<SearchheckBox/>}/>
    <Route path='/SelectBox' element={<SelectBox/>}/>
    <Route path='/SeatArrange' element={<SeatArrange/>}/>
    <Route path='/busbooking' element={<BusBooking/>}/>  
    <Route path='/SeatSelection' element={<SeatSelection/>}/>  
    <Route path='/ForgotPassword' element={<ForgotPassword/>}/>  
    <Route path='/ResetPassword' element={<ResetPassword/>}/>  
    <Route path='/BookingSummary' element={<BookingSummary/>}/>  
    <Route path='/flightbooking' element={<FlightBooking/>}/>  
    <Route path='/hotelbooking' element={<HotelBooking/>}/>  
    <Route path='/TicketDetails' element={<TicketDetails/>}/>  
    <Route path='/checkout' element={<CheckoutPage/>}/>  
    <Route path='/seatconfirmation' element={<SeatConfirmation/>}/>  
    <Route path='/vendordashboard' element={<VendorDashboard/>}/>  
    {/* <Route path='/VendorEmailLogin' element={<VendorEmailLogin/>}/>   */}
    <Route path='/VendorEmailSignUp' element={<VendorEmailSignUp/>}/>  



</Routes>
    );
}