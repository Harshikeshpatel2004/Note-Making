// import React, { useEffect, useState } from 'react'
// import {Link, useNavigate} from 'react-router-dom'
// const Navbar = () => {
//     const [auth, setAuth] = useState(false)
//     const navigate = useNavigate()

//     useEffect(() => {
//         if(localStorage.getItem("token")){
//             setAuth(true)
//         }else{
//             setAuth(false)
//         }
//     }, [])

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         setAuth(false);
//         navigate("/");
//     }
//   return (
//     <nav className='bg-gray-900 text-white p-4 flex justify-between items-center '>
//         <div className='text-xl font-semibold'>
//           <Link to="/" className='hover:text-green-400'>DigiBal</Link>
//         </div>

//         <div className='space-x-4'>
//             {auth ? (
//             <>
//             <Link to="/dash" className='hover:text-green-400'>Dashboard</Link>
//             <Link to="/" className='hover:text-green-400'>Notes</Link>
//             <button onClick={handleLogout} className='text-green-400 font-bold'>Logout</button>
            
//             </>
//              ):(
//             <>
//             <Link to="/login" className='hover:text-green-400'>Login</Link>
//             <Link to="/register" className='hover:text-green-400'>Register</Link>
//             </>
//       )}

//         </div>
//     </nav>
//   )
// }

// export default Navbar

import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <div>
        <Link to="/" className="font-bold text-xl">Notes App</Link>
      </div>
      <div className='flex items-center'>
        {isLoggedIn ? (
          <>
            <Link to="/dash" className="mx-2">Dashboard</Link>
            <Link to="/" className="mx-2">Notes</Link>
            <button onClick={handleLogout} className="mx-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg hover:from-pink-500 hover:to-red-500 transition-all duration-300 font-semibold flex items-center gap-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mx-2">Login</Link>
            <Link to="/register" className="mx-2">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar