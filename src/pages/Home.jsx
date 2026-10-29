import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import API from "../api";



const specialties = [
  {
    name: "Cardiology",
    icon: "💗",
    description:
      "ECG findings, cardiac history, drug interactions — structured care for cardiologists.",
    category: "Cardiologist",
  },
  {
    name: "Neurology",
    icon: "🧠",
    description:
      "Brain health, stroke evaluation, seizures, and neurological consultations.",
    category: "Neurologist",
  },
  {
    name: "Nephrology",
    icon: "🩺",
    description:
      "Kidney health, dialysis care, and renal consultations.",
    category: "Nephrologist",
  },
  {
    name: "Endocrinology",
    icon: "🔬",
    description:
      "Diabetes, thyroid disorders, hormones, and metabolic health.",
    category: "Endocrinologist",
  },
  {
    name: "Paediatrics",
    icon: "👶",
    description:
      "Child health, vaccination, development, and growth monitoring.",
    category: "Pediatrician",
  },
  {
    name: "Dental",
    icon: "🦷",
    description:
      "Dental checkups, oral health, and teeth care.",
    category: "Dentist",
  },
  {
    name: "Gynaecology & Obs",
    icon: "🤰",
    description:
      "Women's health, pregnancy care, and consultations.",
    category: "Gynaecologist",
  },
  {
    name: "Ophthalmology",
    icon: "👁️",
    description:
      "Eye examinations, vision care, and eye health.",
    category: "Ophthalmologist",
  },
];

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    fetch(`${API}/doctors/get.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDoctors(
            data.doctors
              .filter((doctor) => doctor.status === "Active")
              .slice(0, 6)
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

  return (
    <main>

      <section className="hero">

        <div className="hero-container">

          <div className="hero-content">

            <span className="hero-badge">
              Trusted Healthcare Platform
            </span>

            <h1>
              Your Health,
              <span> Our Priority</span>
            </h1>

            <p>
              Find experienced doctors and book
              your medical appointments quickly
              and conveniently with CarePlus.
            </p>

            <div className="hero-buttons">

              <Link
                to="/doctors"
                className="primary-btn"
              >
                Booking Now
              </Link>

            </div>

            <div className="hero-stats">

              <div>
                <strong>50+</strong>
                <span>Doctors</span>
              </div>

              <div>
                <strong>10K+</strong>
                <span>Patients</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">
            <div className="hero-card">

              <div className="hero-doctor-icon">
                👨‍⚕️
              </div>

              <h3>Professional Healthcare</h3>

              <p>
                Connect with trusted healthcare
                professionals.
              </p>

              <div className="hero-check">
                ✓ Easy Appointment Booking
              </div>

              <div className="hero-check">
                ✓ Qualified Doctors
              </div>

              <div className="hero-check">
                ✓ Secure Patient Records
              </div>

            </div>
          </div>

        </div>

      </section>

      <section className="section">
        <section className="specialties-section">
          <div className="specialties-heading">
            <span>OUR SPECIALTIES</span>
            <h2>Explore Medical Specialties</h2>
            <p>Find the right specialist for your healthcare needs.</p>
          </div>

          <div className="specialties-grid">
            {specialties.map((specialty) => (
              <div className="specialty-card" key={specialty.name}>
                <div className="specialty-icon">{specialty.icon}</div>
                <h3>{specialty.name}</h3>
                <p>{specialty.description}</p>
                <span>{specialty.category}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Home;