import React, {useState} from 'react'
import axios from 'axios'
import { Link} from 'react-router-dom'

   const API_URL = 'http://localhost:5000' // Replace with your actual API URL
 const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const handleChange = (e)=> setFormData({ ...formData,[e.target.name]:e.target.value})

    const handleSubmit =async (e)=>{
        e.preventDefault();
        await axios.post(`${API_URL}/auth/register`, formData)
        window.location.href = "/login"
    }
   // const handleChange = (e)=> setFormData({ ...formData,[e.target.name]:[e.target.value]})


    
   return (
     <div className='w-96 bg-gray-900 p-6 rounded-lg container mx-auto'>
       <h2 className='text-2xl mb-4 text-green-400'>Register</h2>
       <form onSubmit={handleSubmit}>
        <input onChange={handleChange} placeholder='Username' type="text" name="username" className='w-full p-2 my-2 bg-gray-800 text-white '></input>
        <input onChange={handleChange} placeholder='Email' type="email" name="email" className='w-full p-2 my-2 bg-gray-800 text-white '></input>
        <input onChange={handleChange} placeholder='Password' type="password" name="password" className='w-full p-2 my-2 bg-gray-800 text-white '></input>
        <button type="submit" className='w-full p-2 my-2 bg-green-400 text-black'>Register</button>
       </form>
       <p className='text-center text-white'>Already have an account? <Link to="/login">Login</Link></p>
     </div>
   )
}
 export default Register
