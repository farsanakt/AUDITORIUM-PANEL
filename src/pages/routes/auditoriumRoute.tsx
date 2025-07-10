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
import AuditoriumDetails from "../user/AuditoriumDetails";
import StaffManagementUI from "../auditorium/Staff";
import InvoicePanel from "../auditorium/Invoice";
import ProtectedRoute from "../../service/protectedRoute";
import PublicRoute from "../../service/publicRoutes";


function AuditoriumRoute() {
  return (
    <div>
      <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

      <Route path='/' element={<PublicRoute><LoginPage/></PublicRoute>} />
        <Route path='/signup' element={ <PublicRoute><SignupPage/></PublicRoute>} />
        {/* <Route path="/" element={<LoginPage/>}/> */}
        <Route path='/venue' element={<VenueManagement/>}/>
        <Route path='/bookings' element={<AuditoriumBooking/>} />
        <Route path='/slot' element={<SlotManagementCalendar/>}/>
        <Route path='/details' element={<DetailsForm/>}/>
        <Route path='payment' element={<PaymentDetails/>}/>
        <Route path='Bookingconfirmation' element={<BookingConfirmation/>}/>
        {/* <Route path='/auditoriumdetails' element={<AuditoriumDetails/>} /> */}
        <Route path='/staff' element={<StaffManagementUI/>}/>
        <Route path='/invoice' element={<InvoicePanel/>}/>
      </Routes>
    </div>
  )
}

export default AuditoriumRoute
