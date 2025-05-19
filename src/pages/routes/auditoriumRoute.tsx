import { Route,Routes } from "react-router-dom";
import LoginPage from "../auditorium/Login";
import SignupPage from "../auditorium/Signup";
import VenueManagement from "../auditorium/Venue";
import Dashboard from "../../component/auditorium/Dashboard";
import AuditoriumBooking from "../auditorium/BookingCalender";
import SlotManagementCalendar from "../auditorium/Slot";
import DetailsForm from "../auditorium/details";
import PaymentDetails from "../auditorium/Payment";
import BookingConfirmation from "../auditorium/BookingsDetails";


function AuditoriumRoute() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path='/venue' element={<VenueManagement/>}/>
        <Route path='/bookings' element={<AuditoriumBooking/>} />
        <Route path='/slot' element={<SlotManagementCalendar/>}/>
        <Route path='/details' element={<DetailsForm/>}/>
        <Route path='payment' element={<PaymentDetails/>}/>
        <Route path='Bookingconfirmation' element={<BookingConfirmation/>}/>
      </Routes>
    </div>
  )
}

export default AuditoriumRoute
