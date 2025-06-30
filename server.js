import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from'path';
import { type } from 'os';

const app = express()
const _dirname = path.resolve();

app.use(express.json())
app.use(cors())
const SECRET_KEY = 'your_jwt_secret_key';

app.use("/uploads", express.static( "uploads"));

mongoose
.connect('mongodb+srv://harshikeshpatel2004:Harsh%402002@mern-notes-app2.anuondr.mongodb.net/?retryWrites=true&w=majority&appName=mern-notes-app2')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))
//user 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})
const User = mongoose.model('User', userSchema)

//notes model
const notesSchema = new mongoose.Schema({
    title:String,
    description:String,
    filePath:String,
    uploadedBy: String,
    createdAt:{type: Date, default: Date.now}
})

const Notes = mongoose.model('Notes', notesSchema)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb)  {
        cb(null, Date.now() + "-" + path.extname(file.originalname));
       
    }
});

const upload = multer({ storage: storage });

app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid Password' });
         } //       server.js
        //  app.get('/notes', async (req, res) => {
        //      const { username } = req.query;
        //      try {
        //        const notes = await Notes.find({ uploadedBy: username });
        //         res.json(notes);
        //     } catch (error) {
        //         res.status(500).json({ error: 'Failed to fetch notes' });
        //     }
        // });
        const token = jwt.sign({username:user.username,email:user.email}, SECRET_KEY, { expiresIn: '1h' });
        res.json({message:"Login successful", token });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Login Error' });
    }
});

app.post('/notes/upload', upload.single('file'), async (req, res) => {
    const { title, description, username } = req.body;
    const filePath = req.file ? req.file.filename: "";
    try {
        const note = new Notes({ title, description, filePath, uploadedBy: username });
        await note.save();
        res.status(201).json({ message: 'Note uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/notes/user/:username', async (req, res) => {
    try{
        const notes=await Notes.find({ uploadedBy: req.params.username });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.get('/notes', async (req, res) => {
    try{
        const notes = await Notes.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.get('/notes/user/:username', async (req, res) => {
    try {
        const notes = await Notes.find({ uploadedBy: req.params.username });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Delete a note by ID
app.delete('/notes/:id', async (req, res) => {
    try {
        await Notes.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.put('/notes/update/:id', upload.single('file'), async (req, res) => {
    const { title, description } = req.body;
    const filePath = req.file ? req.file.filename : null;

    try {
        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.title = title || note.title;
        note.description = description || note.description;
        if (filePath) {
            // Delete the old file if it exists
            if (fs.existsSync(note.filePath)) {
                fs.unlinkSync(note.filePath);
            }
            note.filePath = filePath;
        }

        await note.save();
        res.json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

app.get('/notes/view/:id', async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({filePath: `http://localhost:${PORT}/${note.filePath}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});
const PORT = 5000;

app.use(express.static(path.join(_dirname, '/app/dist')));
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, '/app/dist/index.html'));
}); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


