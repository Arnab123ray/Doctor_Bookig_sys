import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="logo footer-logo">
            <span className="logo-icon">+</span>
            Care<span>Plus</span>
          </Link>

          <p>
            Your trusted platform for convenient
            and reliable healthcare appointments.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📧 support@careplus.com</p>
          <p>📞 +91 8918126989</p>
          <p>📍 Kolkata, West Bengal</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} CarePlus.
          All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;