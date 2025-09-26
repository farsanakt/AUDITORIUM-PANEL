import { Route, Routes } from "react-router-dom"
import AdminLogin from "../admin/AdminLogin"
import AdminDashboard from "../admin/AdminDasboard"
import AuditoriumManagement from "../admin/AllAuditorium"
import AuditoriumList from "../admin/AllAudiotriumList"
import UsersTable from "../admin/AllUsers"
import UsersManagement from "../admin/AllUsers"

const AdminRoute = () => {

  return (
    <div>
     <Routes>
        <Route path='/login' element={<AdminLogin/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path="/allauditorium" element={<AuditoriumManagement/>}/>
        <Route path='/allaudilist' element={<AuditoriumList/>}/>
        <Route path='/allusers' element={<UsersManagement/>}/>
        </Routes> 
    </div>
  )
}

export default AdminRoute