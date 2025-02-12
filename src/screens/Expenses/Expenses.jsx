import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../services/users";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Change this for different page sizes
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const profile = await getUserProfile();
        if (!profile) {
          navigate("/login"); // If no profile found, redirect to login
          return;
        }
        setExpenses(profile.expenses); // Assuming `expenses` field exists in user profile
      } catch (err) {
        setError("Failed to fetch expenses. Please try again later.");
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = expenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Your Expenses
        </h1>

        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b bg-gray-50">
              <th className="px-4 py-3 text-gray-700 font-semibold">
                Description
              </th>
              <th className="px-4 py-3 text-gray-700 font-semibold">Amount</th>
              <th className="px-4 py-3 text-gray-700 font-semibold">
                Category
              </th>
              <th className="px-4 py-3 text-gray-700 font-semibold">
                Payment Method
              </th>
              <th className="px-4 py-3 text-gray-700 font-semibold">
                Recurring
              </th>
              <th className="px-4 py-3 text-gray-700 font-semibold">Status</th>
              <th className="px-4 py-3 text-gray-700 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.length > 0 ? (
              currentExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">
                    {expense.description || "No description"}
                  </td>
                  <td className="px-4 py-3 text-red-600">${expense.amount}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {expense.categoryTags
                      ? expense.categoryTags.join(", ")
                      : "Uncategorized"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {expense.paymentMethod
                      ? expense.paymentMethod.charAt(0).toUpperCase() +
                        expense.paymentMethod.slice(1)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {expense.isRecurring ? (
                      <span className="text-green-600">
                        Yes ({expense.recurringPeriod})
                      </span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span
                      className={`${
                        expense.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : expense.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      } py-1 px-2 rounded-full text-sm font-semibold`}
                    >
                      {expense.status.charAt(0).toUpperCase() +
                        expense.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
