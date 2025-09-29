import { Route, Routes } from "react-router-dom"
import Login from "../vendor/login"
import Dashboard from "../vendor/dashboard"
import Signup from "../vendor/signup"
import VendorManagement from "../vendor/addVendor"
import VendorEnquiries from "../vendor/vendorEnquires"
import Voucher from "../vendor/voucher"


const VendorRoute = () => {

  return (
    <div>
     <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/addvendor' element={<VendorManagement/>}/>
        <Route path='/vendorenquires' element={<VendorEnquiries/>}/>
        <Route path='/vouchers' element={<Voucher/>}/>
        </Routes> 
    </div>
  )
}

export default VendorRoute