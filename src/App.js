import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    position: ""
  });
  const [storedData, setStoredData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false); // State to track if data is fetched

  useEffect(() => {
    // Fetch welcome message from the backend
    axios.get('http://127.0.0.1:5000/api')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error("Error fetching message:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendData = () => {
    if (editId) {
      // If editing, update the data
      updateData();
    } else {
      // Add new data
      axios.post('http://127.0.0.1:5000/api/data', formData)
        .then(res => {
          setResponse(res.data);
          getData(); // Refresh the data list
        })
        .catch(err => console.error("Error sending data:", err));
    }
  };

  const getData = () => {
    axios.get('http://127.0.0.1:5000/api/data')
      .then(res => {
        setStoredData(res.data);
        setIsDataFetched(true); // Mark data as fetched
      })
      .catch(err => console.error("Error fetching stored data:", err));
  };

  const deleteData = (id) => {
    axios.delete(`http://127.0.0.1:5000/api/data/${id}`)
      .then(res => {
        setResponse(res.data);
        getData(); // Refresh the data list after deletion
      })
      .catch(err => console.error("Error deleting data:", err));
  };

  const editData = (id) => {
    const dataToEdit = storedData.find(item => item.id === id);
    setFormData({
      name: dataToEdit.name,
      company: dataToEdit.company,
      email: dataToEdit.email,
      position: dataToEdit.position
    });
    setEditId(id);
  };

  const updateData = () => {
    axios.put(`http://127.0.0.1:5000/api/data/${editId}`, formData)
      .then(res => {
        setResponse(res.data);
        setEditId(null); // Clear edit ID after update
        getData(); // Refresh the data list after update
      })
      .catch(err => console.error("Error updating data:", err));
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
      <div className="navbar-brand">
       <img src="assets\favicon1.gif" alt="JavaFullStackGuru" className="navbar-logo" />
         </div>
        <ul className="navbar-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#aboutus">About Us</a></li>
          <li><a href="#contactus">Contact Us</a></li>
        </ul>
      </nav>

      <div className="content">
        <h3>Enter Your Details:</h3>
        <div className="form-container">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="company"
            placeholder="Enter Company"
            value={formData.company}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="position"
            placeholder="Enter Position"
            value={formData.position}
            onChange={handleChange}
            className="input-field"
          />
          <button onClick={sendData} className="send-button">{editId ? "Update Data" : "Send Data"}</button>
        </div>

        {response && (
          <div className="response-container">
            <h3>Response from Backend:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}

        <button onClick={getData} className="get-data-button">Get Data</button>

        {/* Conditionally Render Table Only After Fetching Data */}
        {isDataFetched && storedData.length > 0 && (
          <div className="stored-data-container">
            <h3>Stored Data:</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.company}</td>
                    <td>{item.email}</td>
                    <td>{item.position}</td>
                    <td>
                    <button onClick={() => editData(item.id)} className="edit-button">Edit</button>
                    <button onClick={() => deleteData(item.id)} className="delete-button">Delete</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer>
        <div className="footer-links">
          <a href="#aboutus">About Us</a> | <a href="#contactus">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
