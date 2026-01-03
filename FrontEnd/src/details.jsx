// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function details() {
//   const { id } = useParams(); // Grabs the ID from the URL
//   const [project, setProject] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
//         setProject(res.data);
//       } catch (err) {
//         console.error("Error fetching project details", err);
//       }
//     };
//     fetchProject();
//   }, [id]);

//   if (!project) return <div className="App">Loading...</div>;

//   return (
//     <div className="App" style={{ textAlign: 'left' }}>
//       <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>← Back to Dashboard</button>
//       <h1>{project.title}</h1>
//       <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', color: '#333' }}>
//         <p><strong>Status:</strong> {project.status}</p>
//         <p><strong>Created On:</strong> {new Date(project.createdAt).toLocaleString()}</p>
//         <p><strong>Database ID:</strong> {project._id}</p>
//         {/* We can add a "Description" field here later! */}
//       </div>
//     </div>
//   );
// }

// export default details;




import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Details() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project", err);
      }
    };
    fetchProject();
  }, [id]);


  const updateStatus = async () => {
  if (!project) return;
  
  const newStatus = project.status === 'Completed' ? 'In Progress' : 'Completed';
  try {
    const res = await axios.put(`http://localhost:5000/api/projects/${id}`, { status: newStatus });
    // This updates the local 'project' state so the UI changes immediately
    setProject(res.data); 
  } catch (err) {
    console.error("Failed to update status", err);
  }
};


  if (!project) return <div className="App">Loading project details...</div>;

  return (
    <div className="App" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} className="back-btn">← Back to Dashboard</button>
      
      <div className="detail-card">
        <h1>{project.title}</h1>
        <hr />
        <p><strong>Status:</strong> <span className="status-badge">{project.status}</span></p>
        <p><strong>Description:</strong></p>
        <div className="description-box">
          {project.description || "No description provided for this project."}
        </div>
        <p className="timestamp">Created on: {new Date(project.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Details;