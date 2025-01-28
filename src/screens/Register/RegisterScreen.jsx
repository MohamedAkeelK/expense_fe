import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../services/users";

const RegisterScreen = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_digest: "",
    profilePicture: "",
    dob: "",
    totalMoney: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on input name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the register function
      const user = await register(formData);
      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="password_digest">Password</label>
          <input
            type="password"
            id="password_digest"
            name="password_digest"
            value={formData.password_digest}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="profilePicture">Profile Picture URL</label>
          <input
            type="url"
            id="profilePicture"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="totalMoney">Total Money</label>
          <input
            type="number"
            id="totalMoney"
            name="totalMoney"
            value={formData.totalMoney}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterScreen;
