import React, {useEffect, useState} from 'react'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios'
//import { set } from 'mongoose'

const API_URL = 'http://localhost:5000' // Replace with your actual API URL

const Dashboard = () => {
    const [notes, setNotes] = useState([])
    const [formData, setFormData] = useState({ title: '', description: '', file: null })
    const [editNote, setEditNote] = useState(null)

    let user = null;
    const token = localStorage.getItem('token');
    if (token) {
        try{
            user = jwtDecode(token).username;
        } catch(e){
            user = null;
        }
    }
    //const user = jwtDecode(localStorage.getItem('token')).username;
    useEffect(() => {
        const fetchNotes = async () => {
            if (user) {
                const res = await axios.get(`${API_URL}/notes?username=${user}`);
                setNotes(res.data);
            }
        }
        fetchNotes();
    }, [user]);
   
    const handleChange=(e)=> setFormData({...formData,[e.target.name]:e.target.value})

    
    const handleFileChange=(e)=> setFormData({...formData, file: e.target.files[0]})

     const handleSubmit=async(e)=>{
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('file', formData.file);
        formDataObj.append('username', user);

        await axios.post(`${API_URL}/notes/upload`, formDataObj);
        window.location.reload();
        
    }
    useEffect(() => {
        axios.get(`${API_URL}/notes/user/${user}`).then((res) => setNotes(res.data));
    }, [user]);
    const handleEdit = (note) => {
        setEditNote(note);
        setFormData({
            title: note.title,
            description: note.description,
            file: null // Reset file input
        });
    }
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            await axios.delete(`${API_URL}/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        if (formData.file) {
            formDataObj.append('file', formData.file);
        }
        await axios.put(`${API_URL}/notes/update/${editNote._id}`, formDataObj);
        setEditNote(null);
        setFormData({ title: '', description: '', file: null });
        window.location.reload();
    }

  return (
    <>
    <div className='w-1/2  mx-auto'>
      <h2 className='text-2xl mb-4 text-green-400'>Dashboard</h2>

      <form onSubmit={editNote ? handleUpdate : handleSubmit} className='my-4'>
        <input className='w-full p-2 my-2 bg-gray-800 text-white ' name="title" onChange={handleChange} value={formData.title}></input>
        <textarea className='w-full p-2 my-2 bg-gray-800 text-white 'name="description" onChange={handleChange} value={formData.description}></textarea>
        <input type="file" className='w-full p-2 my-2 bg-gray-800 text-white 'onChange={handleFileChange}></input>
        <button className='w-full p-2 my-2 bg-green-400 text-black' type='submit'>{editNote ? 'Update' : 'Upload'}</button>
        </form>
    </div>
    <h2>My Uploaded Files</h2>
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
    {notes.length > 0 ? (
        notes.map((note) => (
            <div key={note._id} className='bg-gray-900 p-4 my-2 rounded my-2'>
                <h3 className='text-xl'>{note.title}</h3>
                <p>{note.description}</p>
                <a href={`${API_URL}/uploads/${note.filePath}`} target="_blank">Download File</a>
            
            <div className ='mt-2'>
                <button className='bg-blue-500 px-3 py-1 rounded-lg mr-2 text-white'onClick={() => handleEdit(note)}>Edit</button>
                <button className='bg-red-500 px-3 py-1 rounded-lg mr-2 text-white'onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
            </div>
        ))
    ) : (
        <p>No files uploaded yet.</p>
    )}
    </div>
    </>
  )
}

export default Dashboard
