import { Route,Routes } from "react-router-dom";
import React from 'react'
import LoginPage from "../auditorium/Login";
import SignupPage from "../auditorium/Signup";

function AuditoriumRoute() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
      </Routes>
    </div>
  )
}

export default AuditoriumRoute
