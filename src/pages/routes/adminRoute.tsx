import { Navigate, Route, Routes } from "react-router-dom"
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
import { useSelector } from "react-redux"
import AdminStaffLogin from "../admin/stafflogin"
import AdminItemsManagement from "../admin/AdminItems"
import AllEnquiries from "../admin/Enquires"
import BulkUpload from "../admin/BulkUpload"


const AdminRoute = () => {
  const { currentUser } = useSelector((state: any) => state.auth);



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
        <Route path='/stafflogin' element={<AdminStaffLogin/>}/>
        <Route path="/items" element={<AdminItemsManagement/>}/>
        <Route path="/alladminenquiry" element={<AllEnquiries/>}/>
        <Route path ='/bulkupload' element={<BulkUpload/>}/>
        <Route path='/subscriptionmanagement' element={<AdminSubscriptionManager/>}/>

          <Route
        path="/"
        element={
          currentUser?.role === "admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
        </Routes> 
    </div>
  )
}

export default AdminRoute