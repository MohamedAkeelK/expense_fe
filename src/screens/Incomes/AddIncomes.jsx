import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addIncome } from "../../services/incomes";

export default function AddIncomes() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    paymentMethod: "",
    isRecurring: false,
    recurringPeriod: "",
    notes: "",
    status: "recieved",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.amount || !formData.source) {
      return setError("Amount and source are required.");
    }

    if (formData.isRecurring && !formData.recurringPeriod) {
      return setError("Please select a recurring period.");
    }

    try {
      await addIncome({
        ...formData,
        recurringPeriod: formData.isRecurring ? formData.recurringPeriod : null,
      });
      navigate("/incomes");
    } catch (err) {
      console.error("Failed to add income:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-6">
        <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">
          Add New Income
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount in USD"
              className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Source */}
          <div>
            <label className="text-sm font-medium text-gray-700">Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select source</option>
              <option value="Salary">Salary</option>
              <option value="Investments">Investments</option>
              <option value="Freelance">Freelance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
              className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="bank transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Recurring */}
          <div className="col-span-1 md:col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Is this recurring?
              </span>
            </label>
          </div>

          {/* Recurring Period */}
          {formData.isRecurring && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Recurring Period
              </label>
              <select
                name="recurringPeriod"
                value={formData.recurringPeriod}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Period</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="recieved">Received</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Notes */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes"
              rows={3}
              className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2 text-center mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
