import React from 'react'
import Home from './pages/Home'
import {Routes,Route} from 'react-router-dom'
import Login from './auth/Login'
import Signup from './auth/signup'
import Privacy from './pages/Privacy'
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Dashboard from './pages/Dashboard'
import AddRecord from './pages/AddRecord'
import ListRecords from './pages/ListRecord'



const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/add-record" element={<AddRecord />} />  
      <Route path="/records" element={<ListRecords />} />  
      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
    </Routes>
  )
}

export default App