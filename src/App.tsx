
import { Route, Routes } from 'react-router-dom'
import './App.css'

import AuditoriumRoute from './pages/routes/auditoriumRoute'
import UserRoute from './pages/routes/userRoute'
import VendorRoute from './pages/routes/vendorRoute'




function App() {
   


  return (
    <div>
     <Routes>
      <Route path='/auditorium/*' element={<AuditoriumRoute/>} />
      <Route path='/*' element={<UserRoute/>} />
      <Route path='/vendor/*' element={<VendorRoute/>}/>
     </Routes>
    </div>
  )
}

export default App
