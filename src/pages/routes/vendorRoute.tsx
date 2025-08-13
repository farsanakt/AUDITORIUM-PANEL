import { Route, Routes } from "react-router-dom"
import Login from "../vendor/login"
import Dashboard from "../vendor/dashboard"
import Signup from "../vendor/signup"


const VendorRoute = () => {

  return (
    <div>
     <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/signup" element={<Signup/>}/>
        </Routes> 
    </div>
  )
}

export default VendorRoute