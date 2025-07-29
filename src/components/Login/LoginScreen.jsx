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
    <div className="flex w-full max-w max-h-screen  items-center justify-center bg-gray-100 border-0 p-6">
      <div className="w-full max-w bg-white p-6 ro unded-2xl shadow-lg">
        <h1 className="text-red-500 text-2xl font-bold text-center">Login</h1>

        {error && (
          <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password_digest"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password_digest"
              name="password_digest"
              value={formData.password_digest}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
