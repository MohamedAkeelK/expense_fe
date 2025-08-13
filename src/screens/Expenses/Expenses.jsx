import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, verify } from "../../services/users";

const ViewExpenses = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verified = await verify();
        if (!verified) {
          navigate("/login");
          return;
        }
        setUser(verified);

        const userProfile = await getUserProfile(verified.id);
        setProfile(userProfile);
      } catch (err) {
        console.error("Failed to fetch user or profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const matchesStatus = filterStatus ? item.status === filterStatus : true;
      const matchesCategory = filterCategory
        ? item.categoryTags?.includes(filterCategory)
        : true;
      return matchesStatus && matchesCategory;
    });
  };

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center">No profile found.</p>;

  const expenses = sortData(filterData(profile.expenses || []));
  const currentExpenses = paginate(expenses, currentPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <button
            onClick={() => navigate("/expenses/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Expense
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Bills">Bills</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Groceries">Groceries</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Table */}
        {/* Expense Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-50 text-blue-800 text-sm font-semibold uppercase">
              <tr>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Payment</th>
                <th className="py-3 px-6 text-left">Recurring</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Notes</th>
                <th className="py-3 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {paginate(expenses, currentPage).map((expense, idx) => (
                <tr
                  key={expense._id}
                  className={`hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-6">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">{expense.description}</td>
                  <td className="py-3 px-6">
                    {expense.categoryTags?.[0] || expense.category || "N/A"}
                  </td>
                  <td className="py-3 px-6 capitalize">
                    {expense.paymentMethod}
                  </td>
                  <td className="py-3 px-6">
                    {expense.isRecurring ? expense.recurringPeriod : "No"}
                  </td>
                  <td
                    className={`py-3 px-6 capitalize font-medium ${
                      expense.status === "paid"
                        ? "text-green-600"
                        : expense.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {expense.status}
                  </td>
                  <td className="py-3 px-6 text-gray-500 italic">
                    {expense.notes || "-"}
                  </td>
                  <td className="py-3 px-6 text-right text-red-500 font-semibold">
                    ${expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentExpenses.map((expense) => (
            <div key={expense._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{new Date(expense.date).toLocaleDateString()}</span>
                <span className="text-red-500 font-bold">
                  ${expense.amount}
                </span>
              </div>
              <p className="text-lg text-gray-800">{expense.description}</p>
              <p className="text-sm text-gray-500">
                {expense.categoryTags?.join(", ")}
              </p>
              <p className="text-sm text-gray-500">{expense.paymentMethod}</p>
              <p className="text-sm text-gray-500">
                Recurring: {expense.isRecurring ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-500">Status: {expense.status}</p>
              <p className="text-sm text-gray-500">{expense.notes}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= expenses.length}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExpenses;
