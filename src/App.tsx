
import { Route, Routes } from 'react-router-dom'
import './App.css'

import AuditoriumRoute from './pages/routes/auditoriumRoute'
import UserRoute from './pages/routes/userRoute'

function App() {
  return (
    <div>
     <Routes>
      <Route path='/*' element={<AuditoriumRoute/>} />
      <Route path='/user/*' element={<UserRoute/>} />
     </Routes>
    </div>
  )
}

export default App
