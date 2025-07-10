
import { Route, Routes } from 'react-router-dom'
import AuditoriumDetails from '../user/AuditoriumDetails'
import Bookings from '../user/Bookings'
import DetailsForm from '../auditorium/details'
import UserRegistrationPage from '../user/Registration'
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
        </Routes> 
    </div>
  )
}

export default UserRoute
