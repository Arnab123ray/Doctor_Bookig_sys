import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API}/auth/login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        navigate("/");

        window.location.reload();

      } else {

        setError(
          data.message ||
          "Invalid email or password."
        );
      }

    } catch (error) {

      console.error("Login error:", error);

      setError(
        "Cannot connect to PHP server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-header">

          <div className="auth-icon">
            🔐
          </div>

          <h1>Welcome Back</h1>

          <p>
            Login to your CarePlus account
          </p>

        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

          </div>

          <button
            type="submit"
            className="book-btn full-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Don't have an account?
            {" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;