import React, { useState } from "react";
import { Calendar, Award, Phone, Mail, MapPin } from "lucide-react";
import "./doctorDetails.css";
import { useParams, useLocation } from "react-router-dom";
import MaleAvatar from "./images/avatar-male.jpg";

function DoctorDetails() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 AM", available: false },
    { time: "1:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "05:00 PM", available: true },
  ];

  const AppointType = [
    { time: "Online", available: true },
    { time: "Offline", available: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointment = {
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
    };
    console.log(appointment);
    alert("Appointment request submitted successfully!");
  };

  const { id } = useParams();
  const location = useLocation();

  // Get the doctor from state
  const doctor = location.state?.doctor;

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="doctor-details-container">
      <div className="doctor-details-wrapper">
        <div className="doctor-details-card">
          <div className="doctor-info">
            <img
              className="DoctorImage-az"
              src={doctor.profilePicture || MaleAvatar}
              alt={doctor.firstName + " " + doctor.lastName}
            />
            <div className="doctor-details">
              <h2>{doctor.firstName + " " + doctor.lastName}</h2>
              <p>{doctor.role}</p>
              <div>
                <span>{doctor.email}</span>
              </div>
              <br />
              <div>
                <div className="specializations"></div>
              </div>
              <br />
            </div>
          </div>
        </div>

        <div className="booking-form">
          <h3>Book an Appointment</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="pdLabel">Select Date</label>
              <div className="relative">
                <Calendar />
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="pdLabel">Available Times</label>
              <div className="time-slot-container">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`time-slot-button ${
                      selectedTime === slot.time
                        ? "selected"
                        : slot.available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            <br />

            <label className="pdLabel">Appointment Type</label>

            <div className="appn-slot-container">
              {AppointType.map((slot2) => (
                <button
                  key={slot2.time}
                  type="button"
                  disabled={!slot2.available}
                  onClick={() => setSelectedType(slot2.time)}
                  className={`appn-slot-button ${
                    selectedType === slot2.time
                      ? "selected"
                      : slot2.available
                      ? "available"
                      : "unavailable"
                  }`}
                >
                  {slot2.time}
                </button>
              ))}
            </div>

            <button type="submit" className="booking-form-button">
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
