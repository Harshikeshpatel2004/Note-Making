import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FaCopy, FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa'
const API_URL = 'http://localhost:5000' // Replace with your actual API URL
const CDash = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
      axios.get(`${API_URL}/notes`).then((res) => 
        setNotes(res.data)
      )
  }, [])

  const copyClick = (fileLink) => {
    navigator.clipboard.writeText(Link)
    alert('Link copied to clipboard!')
  }

  return (
    <>
    <div className = 'min-h-screen bg-gray-800 text-white'>
        <section className='relative bg-cover bg-cover h-[600px]'style={{backgroundImage: "url('/img1.jpg')"}}>
            <div className='absolute inset-0 bg-black opacity-50'></div>
            <div className='relative z-10 flex flex-col justify-center items-center text-center h-full px-6'>
                <h1 className='text-5xl font-bold text-white mb-4 drop-shadow-lg'>Explore & Share Knowledge</h1>
                <p className='text-lg text-white mb-6 drop-shadow-lg'
                >Welcome to the collaborative platform where you can share your notes and learn from others.</p>
                <a className='px-6 py-3 bg-green-400 text-black rounded-full font-bold'>Learn More</a>
            </div>
        </section>
        <div className='container mx-auto px-6 py-10'>
            <h2 className='text-3xl text-center mb-10'>All Notes</h2>
            {notes.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {notes.map((note) => {
                        const fileLink = `${API_URL}/${note.filePath}`;
                        return(
                            <div key={note._id} className='bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl'>
                                <h3 className='text-2xl font-semibold mb-2'>{note.title}</h3>
                                <p className='text-gray-400 mb-4'>{note.description}</p>
                                <p className='text-sm mb-4'>Uploaded on: {new Date(note.createdAt).toLocaleDateString()}</p>
                                <a href={`${API_URL}/uploads/${note.filePath}`} target="_blank" rel="noopener noreferrer">Download File</a>
                                <div className='mt-3 flex space-x-3'>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${fileLink}`} target='_blank' className='text-blue-500 hover:text-blue-400'><FaFacebook/></a>
                                    <a href={`https://twitter.com/intent/tweet?url=${fileLink}`} target='_blank' className='text-blue-500 hover:text-blue-400'><FaTwitter/></a>
                                    <a href={`https://api.whatsapp.com/send?text=${fileLink}`} target='_blank' className='text-green-500 hover:text-blue-400'><FaWhatsapp/></a>
                                    <a href={`https://www.linkedin.com/shareArticle?url=${fileLink}`} target='_blank' className='text-blue-700 hover:text-blue-400'><FaLinkedin/></a>
                                    <button className='text-gray-400 hover:text-white' onClick={() => copyClick(fileLink)}><FaCopy/></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p>No Notes Found</p>
            )}
        </div>

    </div>
    </>
  )
}

export default CDash


