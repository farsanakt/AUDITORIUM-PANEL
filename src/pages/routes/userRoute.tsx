
import { Route, Routes } from 'react-router-dom'
import AuditoriumDetails from '../user/AuditoriumDetails'
import Bookings from '../user/Bookings'
import DetailsForm from '../auditorium/details'
import UserRegistrationPage from '../user/Registration'
import UserLoginPage from '../user/Login'
import HomePage from '../user/Home'
import AuditoriumList from '../user/AuditoriumList'
import VenuePage from '../user/VenueList'
// import DetailsForm from '../user/Details'

const UserRoute = () => {
  console.log('hhhhhh')
  return (
    <div>
     <Routes>
        <Route path='/auditoriumdetails' element={<AuditoriumDetails/>} />
        <Route path ='/bookings' element={<Bookings/>}/>
        <Route path='/details' element={<DetailsForm/>} />
        <Route path='/singup' element={<UserRegistrationPage/>} />
        <Route path='/login' element={<UserLoginPage/>} />
        <Route path='/' element={<HomePage/>}/>
        <Route path='/auditoriumlist' element={<AuditoriumList/>}/>
        <Route path='/venuelist' element={<VenuePage/>}/>
        </Routes> 
    </div>
  )
}

export default UserRoute
