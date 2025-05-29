
import { Route, Routes } from 'react-router-dom'
import AuditoriumDetails from '../user/AuditoriumDetails'

const UserRoute = () => {
  console.log('hhhhhh')
  return (
    <div>
     <Routes>
        <Route path='/auditoriumdetails' element={<AuditoriumDetails/>} />
        </Routes> 
    </div>
  )
}

export default UserRoute
