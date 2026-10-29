import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link
} from "react-router-dom";
import API from "../api";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    appointment_date: "",
    appointment_time: "",
    reason: ""
  });

  useEffect(() => {

    fetch(`${API}/doctors/get.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {

        if (data.success && data.doctors.length > 0) {
          setDoctor(data.doctors[0]);
        } else {
          setError("Doctor not found.");
        }

      })
      .catch(() => {
        setError("Unable to load doctor.");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (
      !form.appointment_date ||
      !form.appointment_time
    ) {
      setError(
        "Please select date and time."
      );
      return;
    }

    setBooking(true);
    setError("");
    setSuccess("");

    try {

      const response = await fetch(
        `${API}/appointments/book.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user.id,
            doctor_id: doctor.id,
            appointment_date:
              form.appointment_date,
            appointment_time:
              form.appointment_time,
            reason: form.reason
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        setSuccess(data.message);

        setTimeout(() => {
          navigate("/appointments");
        }, 1200);

      } else {
        setError(data.message);
      }

    } catch (error) {

      console.error(error);

      setError(
        "Cannot connect to PHP server."
      );

    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="loading page-content">
        Loading doctor...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="empty-state page-content">
        <h2>Doctor not found</h2>
        <Link to="/doctors">
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <main className="page-content">

      <div className="booking-layout">

        <div className="booking-doctor">

          <div className="large-doctor-icon">
            👨‍⚕️
          </div>

          <h2>{doctor.name}</h2>

          <p className="specialization">
            {doctor.specialization}
          </p>

          <p>
            <strong>
              Experience:
            </strong>{" "}
            {doctor.experience} years
          </p>

          <p>
            <strong>
              Consultation Fee:
            </strong>{" "}
            ₹{doctor.fee}
          </p>

          <span className="status-badge approved">
            {doctor.status}
          </span>

        </div>

        <div className="booking-form-card">

          <h1>Book Appointment</h1>

          <p>
            Select your preferred date and time.
          </p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Appointment Date
              </label>

              <input
                type="date"
                name="appointment_date"
                value={form.appointment_date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Appointment Time
              </label>

              <input
                type="time"
                name="appointment_time"
                value={form.appointment_time}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Reason for Visit
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Describe your reason for consultation..."
                rows="5"
              />

            </div>

            <button
              type="submit"
              className="book-btn full-btn"
              disabled={booking}
            >
              {booking
                ? "Booking..."
                : "Confirm Appointment"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}

export default BookAppointment;