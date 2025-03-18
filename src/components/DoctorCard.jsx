import React from "react";
import "./DoctorCard.css";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the doctorDetails route and pass the doctor object in state
    navigate(`/doctorDetails/${doctor.id}`, { state: { doctor } });
  };

  const handleBookNow = (event) => {
    // Prevent the Card onClick from also firing
    event.stopPropagation();
    navigate(`/doctorDetails/${doctor.id}`, { state: { doctor } });
  };

  doctor.profilePicture = "http://bonex.runasp.net/" + doctor.profilePicture;
  return (
    <div className="doctor-card" onClick={handleCardClick}>
      <img
        src={doctor.profilePicture}
        alt={doctor.firstName + " " + doctor.lastName}
        className="doctor-image"
      />
      <div className="doctor-info">
        <h2>{doctor.firstName + " " + doctor.lastName}</h2>
        <p>{doctor.role}</p>
        <p>{doctor.email}</p>
        <button className="book-now-button" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
