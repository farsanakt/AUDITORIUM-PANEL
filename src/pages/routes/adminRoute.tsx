import { Route, Routes } from "react-router-dom"
import AdminLogin from "../admin/AdminLogin"
import AdminDashboard from "../admin/AdminDasboard"
import AuditoriumManagement from "../admin/AllAuditorium"
import AuditoriumList from "../admin/AllAudiotriumList"

import UsersManagement from "../admin/AllUsers"
import VendorsManagement from "../admin/AllVendors"
import VoucherList from "../admin/VoucherList"
import AddAdminStaff from "../admin/AdminStaff"
import BookingsManagement from "../admin/AllAuditoriumBookings"
import AdminSubscriptionManager from "../admin/Subscription"

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
        <Route path='/allvouchers' element={<VoucherList/>}/>
        <Route path='/adminstaff' element={<AddAdminStaff/>}/>
        <Route path='/allauditoriumbookings' element={<BookingsManagement/>}/>
        <Route path='/subscriptionmanagement' element={<AdminSubscriptionManager/>}/>
        </Routes> 
    </div>
  )
}

export default AdminRoute