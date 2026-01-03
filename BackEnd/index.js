const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Project = require('./models/Project'); // Import our blueprint

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/projectManagerDB') // Using 127.0.0.1 is often more stable than 'localhost'
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error!");
    console.error(err.message);
  });

// This helps catch errors that happen AFTER the initial connection
mongoose.connection.on('error', err => {
  console.error("MongoDB Runtime Error:", err);
});

// // --- NEW: CREATE A PROJECT ROUTE ---
// app.post('/api/projects', async (req, res) => {
//     try {
//         const newProject = new Project(req.body); // Get data from the user
//         const savedProject = await newProject.save(); // Save it to MongoDB
//         res.status(201).json(savedProject); // Send back the result
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });


app.post('/api/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body); // This catches title AND description
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// --- NEW: GET ALL PROJECTS ROUTE ---
app.get('/api/projects', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

app.get('/', (req, res) => {
    res.send("<h1>The Server is ALIVE!</h1>");
});

// --- DELETE A PROJECT ---
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE A PROJECT STATUS ---
app.put('/api/projects/:id', async (req, res) => {
    try {
        // We use findByIdAndUpdate to set the status directly from the request body
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true } // 'new: true' returns the modified document instead of the old one
        );
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET SINGLE PROJECT ---
app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
// Adding '0.0.0.0' tells the server to listen to ALL local network addresses
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is strictly running on port ${PORT}`);
});