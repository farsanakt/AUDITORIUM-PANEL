import { Route,Routes } from "react-router-dom";

import LoginPage from "../auditorium/Login";
import SignupPage from "../auditorium/Signup";
import AuditoriumDashboard from "../auditorium/Dashboard";

function AuditoriumRoute() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path="/dashboard" element={<AuditoriumDashboard/>}/>
      </Routes>
    </div>
  )
}

export default AuditoriumRoute
