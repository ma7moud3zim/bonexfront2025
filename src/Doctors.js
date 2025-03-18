import React, { useState, useEffect } from 'react';
import "./Home.css";
import DoctorCard from './components/DoctorCard.jsx';
import TheImage from "../src/images/avatar-male.jpg"; 

function Doctors() {
  const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('userInfo')).token);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://bonex.runasp.net/me/doctors", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDoctors();
  }, [token]);

  return (
    <div className="Doctors">
      <div className="transparent-square">
        <h1>Doctors list</h1>
        <h2>Book your appointment now!</h2>
        {error && <p>Error: {error}</p>} {console.log(error)}
        
        {doctors.length > 0 ? (
          doctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <p>No doctors available.</p> 
        )}
      </div>
    </div>
  );
}

export default Doctors;