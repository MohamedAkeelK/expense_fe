import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addExpense } from "../../services/expenses";

export default function AddExpenses() {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    categoryTags: [],
    paymentMethod: "",
    isRecurring: false,
    recurringPeriod: "", // Ensure it's empty initially
    status: "pending", // Default status is "pending"
    notes: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "categoryTags") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((tag) => tag.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.description || !formData.amount || !formData.paymentMethod) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await addExpense(formData); // Send the formData to backend
      navigate("/expenses"); // Navigate after success
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Add New Expense
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. Grocery shopping"
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Amount in USD"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              name="categoryTags"
              value={formData.categoryTags}
              onChange={handleChange}
              multiple
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Bills">Bills</option>
              <option value="Rent">Rent</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Groceries">Groceries</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>

          {/* Recurring */}
          <div className="mb-4">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="mr-2"
              />
              Is this a recurring expense?
            </label>

            {formData.isRecurring && (
              <div className="mt-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Recurring Period
                </label>
                <select
                  name="recurringPeriod"
                  value={formData.recurringPeriod}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Period</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Add any additional notes"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
