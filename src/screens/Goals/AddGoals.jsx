import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addGoal } from "../../services/goals"; // Assuming you're using your services layer

const categories = [
  "Vacation",
  "Emergency Fund",
  "Education",
  "Car",
  "House/Apt",
  "Other",
];

export default function AddGoal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentProgress: 0,
    deadline: "",
    category: "Other",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "currentProgress" || name === "targetAmount"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };

      await addGoal(payload);
      setSuccess("Goal added successfully!");
      setError(null);

      // Reset form
      setFormData({
        title: "",
        targetAmount: "",
        currentProgress: 0,
        deadline: "",
        category: "Other",
      });

      // Optionally redirect to goals list
      setTimeout(() => navigate("/goals"), 1000);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to add goal";
      setError(message);
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add a New Goal</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="block font-semibold mb-1">Target Amount *</label>
          <input
            type="number"
            name="targetAmount"
            min={0}
            required
            value={formData.targetAmount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Current Progress */}
        <div>
          <label className="block font-semibold mb-1">Current Progress</label>
          <input
            type="number"
            name="currentProgress"
            min={0}
            max={formData.targetAmount || undefined}
            value={formData.currentProgress}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block font-semibold mb-1">
            Deadline (optional)
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Goal
        </button>
      </form>
    </div>
  );
}
