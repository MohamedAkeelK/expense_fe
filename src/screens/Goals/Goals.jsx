import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, verify } from "../../services/users";

const categoryOptions = [
  "Vacation",
  "Emergency Fund",
  "Education",
  "Car",
  "House/Apt",
  "Other",
];

export default function Goals() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [sortField, setSortField] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
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

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      else return aVal < bVal ? 1 : -1;
    });
  };

  const filterData = (data) => {
    return data.filter((goal) => {
      return filterCategory ? goal.category === filterCategory : true;
    });
  };

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center">No profile found.</p>;

  const goals = sortData(filterData(profile.goals || []));
  const currentGoals = paginate(goals, currentPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Goals</h1>
          <button
            onClick={() => navigate("/goals/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Goal
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-50 text-blue-800 text-sm font-semibold uppercase">
              <tr>
                <th
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Title
                </th>
                <th
                  className="py-3 px-6 text-right cursor-pointer"
                  onClick={() => handleSort("targetAmount")}
                >
                  Target
                </th>
                <th
                  className="py-3 px-6 text-right cursor-pointer"
                  onClick={() => handleSort("currentProgress")}
                >
                  Progress
                </th>
                <th
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("deadline")}
                >
                  Deadline
                </th>
                <th
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {currentGoals.map((goal, idx) => (
                <tr
                  key={goal._id}
                  className={`hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-6">{goal.title}</td>
                  <td className="py-3 px-6 text-right">
                    ${goal.targetAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-6 text-right text-green-600 font-semibold">
                    ${goal.currentProgress.toFixed(2)}
                  </td>
                  <td className="py-3 px-6">
                    {goal.deadline
                      ? new Date(goal.deadline).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-6">{goal.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentGoals.map((goal) => (
            <div key={goal._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{goal.title}</span>
                <span className="text-green-600 font-bold">
                  ${goal.currentProgress} / ${goal.targetAmount}
                </span>
              </div>
              <p className="text-sm text-gray-500">Category: {goal.category}</p>
              <p className="text-sm text-gray-500">
                Deadline:{" "}
                {goal.deadline
                  ? new Date(goal.deadline).toLocaleDateString()
                  : "None"}
              </p>
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
            disabled={currentPage * itemsPerPage >= goals.length}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
