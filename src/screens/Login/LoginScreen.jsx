import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/users";

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password_digest: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for handling loading
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      const user = await login(formData); // Call login function
      console.log("Logged in user:", user);

      // Store token in localStorage (if returned by the backend)
      if (user.token) {
        localStorage.setItem("token", user.token); // Store the token
      }

      // Redirect to the dashboard on successful login
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false); // Reset loading state once request is complete
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password_digest"
            name="password_digest"
            value={formData.password_digest}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginScreen;
