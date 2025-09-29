import { Route, Routes } from "react-router-dom"
import AdminLogin from "../admin/AdminLogin"
import AdminDashboard from "../admin/AdminDasboard"
import AuditoriumManagement from "../admin/AllAuditorium"
import AuditoriumList from "../admin/AllAudiotriumList"

import UsersManagement from "../admin/AllUsers"
import VendorsManagement from "../admin/AllVendors"

const AdminRoute = () => {

  return (
    <div>
     <Routes>
        <Route path='/login' element={<AdminLogin/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path="/allauditorium" element={<AuditoriumManagement/>}/>
        <Route path='/allaudilist' element={<AuditoriumList/>}/>
        <Route path='/allusers' element={<UsersManagement/>}/>
        <Route path='/allvendors' element={<VendorsManagement/>}/>
        </Routes> 
    </div>
  )
}

export default AdminRoute