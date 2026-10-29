import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Admin login attempt:", {
        username: form.username,
      });

      const response = await fetch(
        `${API}/auth/admin_login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
          }),
        }
      );

      console.log("HTTP Status:", response.status);

      const text = await response.text();

      console.log("PHP Response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error(
          "PHP returned invalid JSON:",
          text
        );

        setError(
          "PHP returned an invalid response. Check admin_login.php."
        );

        return;
      }

      console.log("Admin login response:", data);

      if (data.success) {
        if (!data.admin || typeof data.admin !== "object") {
          console.error(
            "Admin login response missing admin payload:",
            data
          );

          setError(
            "Admin login response was missing account details."
          );
          return;
        }

        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

        localStorage.setItem(
          "isAdminLoggedIn",
          "true"
        );

        navigate("/admin-dashboard");
      } else {
        setError(
          data.message ||
            "Admin login failed."
        );
      }
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        "Cannot connect to PHP server. Check XAMPP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">

          <div className="admin-login-icon">
            🛡️
          </div>

          <h1>Admin Login</h1>

          <p>
            Login to manage your CarePlus
            Doctor Booking System.
          </p>

        </div>

        {error && (
          <div className="admin-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-group">

            <label htmlFor="admin-username">
              Username
            </label>

            <div className="admin-input-wrapper">

              <span className="input-icon">
                👤
              </span>

              <input
                id="admin-username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                autoComplete="username"
              />

            </div>

          </div>

          <div className="admin-form-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                id="admin-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />

            </div>

          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner" aria-hidden="true"></span>
                {" "}Logging in...
              </>
            ) : (
              <>
                {"Login to Admin Panel "}
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>

        </form>

        <div className="admin-login-footer">

          <Link to="/">
            ← Back to Home
          </Link>

          <span>•</span>

          <Link to="/login">
            User Login
          </Link>

        </div>

      </div>

    </main>
  );
}

export default AdminLogin;