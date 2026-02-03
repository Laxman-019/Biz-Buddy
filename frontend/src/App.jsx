import React from 'react'
import Home from './pages/Home'
import {Routes,Route} from 'react-router-dom'
import Login from './auth/login'
import Signup from './auth/signup'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";


const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
    </Routes>
  )
}

export default App