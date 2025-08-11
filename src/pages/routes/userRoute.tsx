
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
// import DetailsForm from '../user/Details'

const UserRoute = () => {
  console.log('hhhhhh')
  return (
    <div>
     <Routes>
        <Route path='/auditoriumdetails/:id' element={<AuditoriumDetails/>} />
        <Route path ='/bookings/:id' element={<Bookings/>}/>
        <Route path='/details' element={<DetailsForm/>} />
        <Route path='/singup' element={<UserRegistrationPage/>} />
        <Route path='/login' element={<UserLoginPage/>} />
        <Route path='/' element={<HomePage/>}/>
        <Route path='/auditoriumlist' element={<AuditoriumList/>}/>
        <Route path='/venuelist/:id' element={<VenuePage/>}/>
        <Route path='/vendorslist/' element={<VendorList/>}/>
        <Route path='/vendordetails/:id' element={<VendorDetails/>} />
        </Routes> 
    </div>
  )
}

export default UserRoute
