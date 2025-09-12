
import { Route, Routes } from 'react-router-dom'
import AuditoriumDetails from '../user/AuditoriumDetails'
import Bookings from '../user/Bookings'
import DetailsForm from '../auditorium/details'
import UserRegistrationPage from '../user/Registration'
import UserLoginPage from '../user/Login'
import HomePage from '../user/Home'
import AuditoriumList from '../user/AuditoriumList'
import VenuePage from '../user/VenueList'
import VendorList from '../user/Vendor'
import VendorDetails from '../user/vendorDetails'
import ProtectedRoute from '../../service/user/userProtectedRoute'
import UserProfile from '../user/userProfile'
import UserBookings from '../user/userBookings'



const UserRoute = () => {
 
  return (
    <div>
     <Routes>
      
        <Route path='/auditoriumdetails/:id' element={<ProtectedRoute><AuditoriumDetails/></ProtectedRoute>} />
        <Route path ='/bookings/:id' element={<ProtectedRoute><Bookings/></ProtectedRoute>}/>
        <Route path='/details/:email' element={<DetailsForm/>} />
        <Route path='/singup' element={<UserRegistrationPage/>} />
        <Route path='/login' element={<UserLoginPage/>} />
        <Route path='/' element={<HomePage/>}/>
        <Route path='/auditoriumlist' element={<AuditoriumList/>}/>
        <Route path='/venuelist/:id' element={<VenuePage/>}/>
        <Route path='/vendorslist/' element={<VendorList/>}/>
        <Route path='/vendordetails/:id' element={<ProtectedRoute><VendorDetails/></ProtectedRoute>} />
        <Route path='/userprofile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
        <Route path='/userbookings' element={<ProtectedRoute><UserBookings/></ProtectedRoute>} />
        </Routes> 
    </div>
  )
}

export default UserRoute
