import { useState } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CDash from './components/CDash'
import Navbar from './components/Navbar'
import './App.css'
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
function App() {
  //const [count, setCount] = useState(0)

  return (
    <>

      <Router>
      <AuthProvider>
        <div className='bg-black min-h-screen w-full text-orange-400 mx-auto'>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/" element={<CDash />} />
          </Routes>
        </div>
</AuthProvider>
      </Router>
    </>
  )
}

export default App
