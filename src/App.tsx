
import { Route, Routes } from 'react-router-dom'
import './App.css'

import AuditoriumRoute from './pages/routes/auditoriumRoute'

function App() {
  return (
    <div>
     <Routes>
      <Route path='/*' element={<AuditoriumRoute/>} />
     </Routes>
    </div>
  )
}

export default App
