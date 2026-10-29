// src/pages/Doctors.jsx
import React, { useState, useEffect } from 'react';
import DoctorCard from '../components/DoctorCard';
import API from '../api';

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch(`${API}/doctors/get.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDoctors(data.doctors);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const activeDocs = doctors.filter(doc => doc.status === 'Active');

  return (
    <div className="doctors-page">
      <h2>Our Doctors</h2>
      {activeDocs.length ? (
        <div className="card-grid">
          {activeDocs.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      ) : (
        <p>No doctors available at the moment.</p>
      )}
    </div>
  );
}

export default Doctors;
