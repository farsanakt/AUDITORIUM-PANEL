import { Route, Routes } from "react-router-dom"
import AdminLogin from "../admin/AdminLogin"
import AdminDashboard from "../admin/AdminDasboard"
import AuditoriumManagement from "../admin/AllAuditorium"

const AdminRoute = () => {

  return (
    <div>
     <Routes>
        <Route path='/login' element={<AdminLogin/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path="/allauditorium" element={<AuditoriumManagement/>}/>
        </Routes> 
    </div>
  )
}

export default AdminRoute