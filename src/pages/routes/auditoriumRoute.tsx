import { Navigate, Route,Routes } from "react-router-dom";
import LoginPage from "../auditorium/Login";
import SignupPage from "../auditorium/Signup";
import VenueManagement from "../auditorium/Venue";
import Dashboard from "../../component/auditorium/Dashboard";
import AuditoriumBooking from "../auditorium/BookingCalender";
import SlotManagementCalendar from "../auditorium/Slot";
import DetailsForm from "../auditorium/details";
import PaymentDetails from "../auditorium/Payment";
import BookingConfirmation from "../auditorium/BookingsDetails";
import StaffManagementUI from "../auditorium/Staff";
import InvoicePanel from "../auditorium/Invoice";
import ProtectedRoute from "../../service/protectedRoute";
import PublicRoute from "../../service/publicRoutes";
import AuditoriumProfile from "../auditorium/profile";
import Offer from "../auditorium/Offer";

import MarriageCertificateTemplate from "../auditorium/Certificate";
import { useSelector } from "react-redux";
import SubscriptionPlans from "../vendor/vendorSubscription";


function AuditoriumRoute() {
   const { currentUser } = useSelector((state: any) => state.auth);

  return (
    <div>
      <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

      <Route path='/login' element={<PublicRoute><LoginPage/></PublicRoute>} />
        <Route path='/signup' element={ <PublicRoute><SignupPage/></PublicRoute>} />
        
        <Route path='/venue' element={ <ProtectedRoute><VenueManagement/></ProtectedRoute>}/>
        <Route path='/bookings' element={<AuditoriumBooking/>} />
        <Route path='/slot' element={<SlotManagementCalendar/>}/>
        <Route path='/details' element={<DetailsForm/>}/>
        <Route path='payment' element={<PaymentDetails/>}/>
        <Route path='Bookingconfirmation' element={<BookingConfirmation/>}/>
         <Route path='/subscription' element={<SubscriptionPlans/>}/>
        
        <Route path='/staff' element={<ProtectedRoute><StaffManagementUI/></ProtectedRoute>}/>
        <Route path='/invoice' element={<InvoicePanel/>}/>
        <Route path='/profile' element={<ProtectedRoute><AuditoriumProfile/></ProtectedRoute>}/>
        <Route path='/offer' element={<ProtectedRoute><Offer/></ProtectedRoute>}/>
        <Route path='/certificate' element={<MarriageCertificateTemplate/>}/>
           <Route
        path="/"
        element={
          currentUser?.role === "auditorium" ? (
            <Navigate to="/auditorium/dashboard" />
          ) : (
            <Navigate to="/auditorium/login" />
          )
        }
      />
      </Routes>
    </div>
  )
}

export default AuditoriumRoute
