import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../vendor/login"
import Dashboard from "../vendor/dashboard"
import Signup from "../vendor/signup"
import VendorManagement from "../vendor/addVendor"
import VendorEnquiries from "../vendor/vendorEnquires"
import Voucher from "../vendor/voucher"
import SubscriptionPlans from "../vendor/vendorSubscription"
import { useSelector } from "react-redux"


const VendorRoute = () => {
    const { currentUser } = useSelector((state: any) => state.auth);



  return (
    <div>
     <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/addvendor' element={<VendorManagement/>}/>
        <Route path='/vendorenquires' element={<VendorEnquiries/>}/>
        <Route path='/vouchers' element={<Voucher/>}/>
        <Route path='/subscription' element={<SubscriptionPlans/>}/>
          <Route
        path="/"
        element={
          currentUser?.role === "vendor" ? (
            <Navigate to="/vendor/dashboard" />
          ) : (
            <Navigate to="/vendor/login" />
          )
        }
      />
        </Routes> 
    </div>
  )
}

export default VendorRoute