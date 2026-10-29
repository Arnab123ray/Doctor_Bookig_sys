import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">

      <div className="doctor-image">
        <span>👨‍⚕️</span>
      </div>

      <div className="doctor-info">

        <div className="doctor-status">
          <span className="active-dot"></span>
          {doctor.status}
        </div>

        <h3>{doctor.name}</h3>

        <p className="specialization">
          {doctor.specialization}
        </p>

        <div className="doctor-details">

          <p>
            <strong>Experience</strong>
            <span>{doctor.experience} years</span>
          </p>

          <p>
            <strong>Consultation Fee</strong>
            <span>₹{doctor.fee}</span>
          </p>

        </div>

        <Link
          to={`/book/${doctor.id}`}
          className="book-btn"
        >
          Book Appointment
        </Link>

      </div>
    </div>
  );
}

export default DoctorCard;