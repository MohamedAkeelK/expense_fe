import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, verify } from "../../services/users";
import Papa from "papaparse";

export default function ViewIncomes() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");

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
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const matchesStatus = filterStatus ? item.status === filterStatus : true;
      const matchesPayment = filterPaymentMethod ? item.paymentMethod === filterPaymentMethod : true;
      return matchesStatus && matchesPayment;
    });
  };

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleDownloadCSV = () => {
    const filteredSorted = sortData(filterData(profile.incomes || []));
    const data = filteredSorted.map((income) => ({
      Date: new Date(income.date).toLocaleDateString(),
      Source: income.source,
      Description: income.description,
      PaymentMethod: income.paymentMethod,
      Status: income.status,
      Recurring: income.isRecurring ? income.recurringPeriod : "No",
      Notes: income.notes,
      Amount: income.amount.toFixed(2),
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "incomes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center">No profile found.</p>;

  const incomes = sortData(filterData(profile.incomes || []));
  const currentIncomes = paginate(incomes, currentPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Incomes</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={handleDownloadCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Export CSV
            </button>
            <button
              onClick={() => navigate("/incomes/add")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Income
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="recieved">Recieved</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filterPaymentMethod}
            onChange={(e) => setFilterPaymentMethod(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="bank transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-green-50 text-green-800 text-sm font-semibold uppercase">
              <tr>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Source</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Payment</th>
                <th className="py-3 px-6 text-left">Recurring</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Notes</th>
                <th className="py-3 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {currentIncomes.map((income, idx) => (
                <tr
                  key={income._id}
                  className={`hover:bg-green-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-6">
                    {new Date(income.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">{income.source}</td>
                  <td className="py-3 px-6">{income.description}</td>
                  <td className="py-3 px-6 capitalize">{income.paymentMethod}</td>
                  <td className="py-3 px-6">
                    {income.isRecurring ? income.recurringPeriod : "No"}
                  </td>
                  <td
                    className={`py-3 px-6 capitalize font-medium ${
                      income.status === "recieved"
                        ? "text-green-600"
                        : income.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {income.status}
                  </td>
                  <td className="py-3 px-6 text-gray-500 italic">
                    {income.notes || "-"}
                  </td>
                  <td className="py-3 px-6 text-right text-green-600 font-semibold">
                    ${income.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentIncomes.map((income) => (
            <div key={income._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{new Date(income.date).toLocaleDateString()}</span>
                <span className="text-green-600 font-bold">
                  ${income.amount}
                </span>
              </div>
              <p className="text-lg text-gray-800">{income.source}</p>
              <p className="text-sm text-gray-500">{income.description}</p>
              <p className="text-sm text-gray-500">{income.paymentMethod}</p>
              <p className="text-sm text-gray-500">
                Recurring: {income.isRecurring ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-500">Status: {income.status}</p>
              <p className="text-sm text-gray-500">
                {income.notes || "No notes"}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= incomes.length}
            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
