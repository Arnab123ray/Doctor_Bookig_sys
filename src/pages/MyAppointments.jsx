import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function MyAppointments() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user) {
      navigate("/login");
      return;
    }

    fetch(
      `${API}/appointments/get.php?user_id=${user.id}`
    )
      .then((response) => response.json())
      .then((data) => {

        if (data.success) {
          setAppointments(
            data.appointments || []
          );
        }

      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <main className="page-content">

      <div className="page-heading">

        <span>MY APPOINTMENTS</span>

        <h1>Your Appointments</h1>

        <p>
          View and track your appointment status.
        </p>

      </div>

      {loading ? (

        <div className="loading">
          Loading appointments...
        </div>

      ) : appointments.length === 0 ? (

        <div className="empty-state">

          <div>📅</div>

          <h3>No appointments yet</h3>

          <p>
            You haven't booked an appointment.
          </p>

          <Link
            to="/doctors"
            className="book-btn"
          >
            Find a Doctor
          </Link>

        </div>

      ) : (

        <div className="appointments-grid">

          {appointments.map((appointment) => (

            <div
              className="appointment-card"
              key={appointment.id}
            >

              <div className="appointment-top">

                <div className="appointment-icon">
                  👨‍⚕️
                </div>

                <span
                  className={`status-badge ${getStatusClass(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>

              </div>

              <h3>
                {appointment.doctor_name}
              </h3>

              <p className="specialization">
                {appointment.specialization}
              </p>

              <div className="appointment-details">

                <p>
                  📅{" "}
                  {appointment.appointment_date}
                </p>

                <p>
                  🕐{" "}
                  {appointment.appointment_time}
                </p>

                <p>
                  💰 ₹{appointment.fee}
                </p>

                <p>
                  📝{" "}
                  {appointment.reason ||
                    "No reason provided"}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default MyAppointments;