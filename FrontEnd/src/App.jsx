import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Details from './details'; // Import your Details.jsx file
import './App.css';



function Dashboard({ projects, fetchProjects, deleteProject, toggleComplete })  {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    try {
      await axios.post('http://localhost:5000/api/projects', formData);
      setFormData({ title: '', description: '' }); // Reset
      setShowModal(false); // Close popup
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>My Projects</h1>
      
      <input 
        className="search-input" 
        placeholder="Search..." 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      

      <ul>
        {filteredProjects.map(project => (
          <li key={project._id}>
            
            {/* 1. REPLACE THE OLD CHECKMARK WITH THIS BUTTON: */}
            <button 
              onClick={() => toggleComplete(project._id, project.status)}
              style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              {project.status === 'Completed' ? '✅' : '⭕'}
            </button>

            {/* This is your existing link */}
            <Link to={`/project/${project._id}`} className="project-text">
              {project.title}
            </Link>
            
            <button className="delete-btn" onClick={() => deleteProject(project._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* --- FLOATING ACTION BUTTON --- */}
      <button className="fab" onClick={() => setShowModal(true)}>+</button>

      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Project</h2>
            <form onSubmit={handleSave}>
              <input 
                placeholder="Project Title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="add-btn">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




// --- 2. THE MAIN APP COMPONENT ---
// (This handles the "Routing" logic)
function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      console.log("Projects received:", res.data);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
  const newStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
  try {
    // We send the specific newStatus to the backend
    await axios.put(`http://localhost:5000/api/projects/${id}`, { status: newStatus });
    fetchProjects(); 
  } catch (err) {
    console.error("Update failed", err);
  }
};

  useEffect(() => { fetchProjects(); }, []);

  const deleteProject = async (id) => {
    await axios.delete(`http://localhost:5000/api/projects/${id}`);
    fetchProjects();
  };

  return (
    <Routes>
      {/* Show Dashboard when URL is just "/" */}
      <Route path="/" element={
        <Dashboard 
          projects={projects} 
          fetchProjects={fetchProjects} 
          title={title} 
          setTitle={setTitle}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          deleteProject={deleteProject}
          toggleComplete={toggleComplete}
        />
      } />
      
      {/* Show Details when URL is "/project/SOME_ID" */}
      <Route path="/project/:id" element={<Details />} />
    </Routes>
  );
}

export default App;