import { Route, Routes } from "react-router-dom"
import AdminLogin from "../admin/AdminLogin"

const AdminRoute = () => {

  return (
    <div>
     <Routes>
        <Route path='/login' element={<AdminLogin/>}/>
        </Routes> 
    </div>
  )
}

export default AdminRoute