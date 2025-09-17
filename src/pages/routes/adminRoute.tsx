import { Route, Routes } from "react-router-dom"
import AdminLogin from "../admin/AdminLogin"
import AdminDashboard from "../admin/AdminDasboard"
import AuditoriumManagement from "../admin/AllAuditorium"
import AuditoriumList from "../admin/AllAudiotriumList"

const AdminRoute = () => {

  return (
    <div>
     <Routes>
        <Route path='/login' element={<AdminLogin/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path="/allauditorium" element={<AuditoriumManagement/>}/>
        <Route path='/allaudilist' element={<AuditoriumList/>}/>
        </Routes> 
    </div>
  )
}

export default AdminRoute