import React from 'react'
import Home from './pages/Home'
import {Routes,Route} from 'react-router-dom'
import Login from './auth/Login'
import Signup from './auth/signup'
import Privacy from './pages/Privacy'
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";



const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
    </Routes>
  )
}

export default App