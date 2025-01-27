import React, { useState } from "react";
import { register } from "../../services/users";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_digest: "", // Ensure the password field matches what your backend expects
    totalMoney: "", // Added totalMoney field
  });

  const handleChange = (e) => {
    const { name, value } = e.target; // Get the name and value from the input
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on input name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the register function and pass the form data
      const user = await register(formData);
      console.log("Registered user:", user);
      // Redirect or show a success message here
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
            value={formData.username} // Corrected value binding
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
            type="password_digest"
            id="password_digest"
            name="password_digest"
            value={formData.password}
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
