import {Routes, Route as RouteElement} from 'react-router-dom';
import {EmailLogin} from './Authentication/EmailLogin.jsx';
import {EmailSignUp} from './Authentication/EmailSignUp.jsx';
import MainPage from "./MainPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { VendorProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute.jsx";
import ExplorePlace from "./ExplorePlace.jsx";
import BusBooking from "./booking/BusBooking/BusBooking.jsx"
import SeatSelection from "./booking/BusBooking/SeatSelection.jsx"
import ForgotPassword from "./Authentication/ForgotPassword.jsx";
import OTPVerification from "./Authentication/OTPVerification.jsx";
import SetPassword from "./Authentication/SetPassword.jsx";
import BookingSummary from "./booking/BusBooking/BookingSummary.jsx";
import UserProfile from "./UserProfile.jsx";
import FlightBooking from "./booking/FlightBooking/FlightBooking.jsx";
import FlightCheckoutPage from "./booking/FlightBooking/FlightCheckoutPage.jsx";
import FlightSeatSelection from "./booking/FlightBooking/FlightSeatSelection.jsx";
import FlightPassengerDetails from "./booking/FlightBooking/FlightPassengerDetails.jsx";
import VendorDashboard from "./VendorDashboard.jsx";
import TicketDetails from "./booking/BusBooking/TicketDetails.jsx";
import CheckoutPage from "./booking/BusBooking/CheckoutPage.jsx";
import SeatConfirmation from "./booking/BusBooking/SeatConfirmation.jsx";
import VendorEmailSignUp from "./Authentication/vendor/VendorEmailSignUp.jsx";
import NotFound from "./components/NotFound.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminSignUp from "./admin/AdminSignUp.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import HelpCenter from "./HelpCenter.jsx";
import ContactUs from "./ContactUs.jsx";
import FAQs from "./FAQs.jsx";
import TermsConditions from "./TermsConditions.jsx";


export function Router (){
    return(
<Routes>
    <RouteElement path='/' element={<MainPage/>}/>
    <RouteElement path='/login' element={<EmailLogin/>}/>
    <RouteElement path='/emailSignup' element={<EmailSignUp/>}/>
    <RouteElement path='/EmailSignUp' element={<EmailSignUp/>}/>
    <RouteElement path='/MainPage' element={<MainPage/>}/>
    <RouteElement path='/profile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
    <RouteElement path='/profile/:userId' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
    <RouteElement path='/ExplorePlace' element={<ExplorePlace/>}/>
    <RouteElement path='/busbooking' element={<BusBooking/>}/>  
    <RouteElement path='/SeatSelection' element={<SeatSelection/>}/>  
<RouteElement path='/ForgotPassword' element={<ForgotPassword/>}/>
    <RouteElement path='/forgotpassword' element={<ForgotPassword/>}/>
    <RouteElement path='/verify-otp' element={<OTPVerification/>}/>
    <RouteElement path='/set-password' element={<SetPassword/>}/>
    <RouteElement path='/BookingSummary' element={<BookingSummary/>}/>  
    <RouteElement path='/flightbooking' element={<FlightBooking/>}/>
    <RouteElement path='/flight-checkout' element={<FlightCheckoutPage/>}/>  
    <RouteElement path='/flight-seat-selection' element={<FlightSeatSelection/>}/>  
    <RouteElement path='/flight-passenger-details' element={<FlightPassengerDetails/>}/>  
    <RouteElement path='/TicketDetails' element={<TicketDetails/>}/>  
    <RouteElement path='/checkout' element={<CheckoutPage/>}/>  
    <RouteElement path='/seatconfirmation' element={<SeatConfirmation/>}/>  
    <RouteElement path='/vendordashboard' element={<VendorProtectedRoute><VendorDashboard/></VendorProtectedRoute>}/> 
    <RouteElement path='/VendorEmailSignUp' element={<VendorEmailSignUp/>}/>
    <RouteElement path='/vendoremailsignup' element={<VendorEmailSignUp/>}/>
    {/* admin */}
    <RouteElement path='/admin/login' element={<AdminLogin/>}/>
    <RouteElement path='/admin/signup' element={<AdminSignUp/>}/>
    <RouteElement path='/admin/dashboard' element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
    <RouteElement path='/help-center' element={<HelpCenter/>}/>
    <RouteElement path='/contact-us' element={<ContactUs/>}/>
    <RouteElement path='/faqs' element={<FAQs/>}/>
    <RouteElement path='/terms-conditions' element={<TermsConditions/>}/>
    <RouteElement path='*' element={<NotFound/>}/>
</Routes>
    );
}
