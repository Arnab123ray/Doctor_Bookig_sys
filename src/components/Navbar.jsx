import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const readStoredJson = (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Invalid JSON in localStorage key: ${key}`, error);
      localStorage.removeItem(key);
      return null;
    }
  };

  const user = readStoredJson("user");
  const admin = readStoredJson("admin");

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/");
    window.location.reload();
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("isAdminLoggedIn");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          <span className="logo-icon">+</span>
          Care<span>Plus</span>
        </Link>

        {/* NAVIGATION */}
        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/doctors">
            Doctors
          </Link>

          {user && (
            <Link to="/appointments">
              My Appointments
            </Link>
          )}

          {admin && (
            <Link to="/admin-dashboard">
              Admin Dashboard
            </Link>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {admin ? (

            <>
              <span className="welcome-text">
                Hi, {admin.username}
              </span>

              <button
                className="nav-logout"
                onClick={logoutAdmin}
              >
                Logout
              </button>
            </>

          ) : user ? (

            <>
              <span className="welcome-text">
                Hi, {user.name}
              </span>

              <button
                className="nav-logout"
                onClick={logoutUser}
              >
                Logout
              </button>
            </>

          ) : (

            <>
              <Link
                to="/admin-login"
                className="admin-login-link"
              >
                Admin Login
              </Link>

              <Link
                to="/login"
                className="nav-login"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-register"
              >
                Create Account
              </Link>
            </>

          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;