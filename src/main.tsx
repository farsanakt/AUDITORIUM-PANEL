import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Provider store={store}>
   <StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
  </Provider>
  </BrowserRouter>
 
)
