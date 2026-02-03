import React from 'react'
import Home from './pages/Home'
import {Routes,Route} from 'react-router-dom'
import Login from './auth/login'
import Signup from './auth/signup'


const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />} /> 
    </Routes>
  )
}

export default App