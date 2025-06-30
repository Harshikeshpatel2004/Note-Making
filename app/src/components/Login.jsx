import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Link } from "react-router-dom"
// filepath: c:\Users\Bipin Bihari\OneDrive\Desktop\Notes Making\app\src\components\Login.jsx

const API_URL = 'http://localhost:5000'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData)
      login(res.data.token)
      navigate('/dash')
    } catch (error) {
      console.error(error)
    }
  }

    // const handleSubmit =async (e)=>{
    //     e.preventDefault();

    //     const {data} = await axios.post(`${API_URL}/auth/login`, formData)
    //     localStorage.setItem('token', data.token)
    //     window.location.href = "/dash"
    // }
   


    
   return (
     <div className='w-96 bg-gray-900 p-6 rounded-lg  container mx-auto w-full px-4'>
       <h2 className='text-2xl mb-4 text-green-400'>Login</h2>
       <form onSubmit={handleSubmit}>
        <input onChange={handleChange} placeholder='Email' type="email" name="email" className='w-full p-2 my-2 bg-gray-800 text-white '></input>
        <input onChange={handleChange} placeholder='Password' type="password" name="password" className='w-full p-2 my-2 bg-gray-800 text-white '></input>
        <button type="submit" className='w-full p-2 my-2 bg-green-400 text-black'>Login</button>
       </form>
       <p className='text-center text-white'>Don't have an account? <Link to="/register">Register</Link></p>
     </div>
   )
}
 export default Login
