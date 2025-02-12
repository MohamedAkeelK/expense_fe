import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verify, getUserProfile } from "../../services/users";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPageExpenses, setCurrentPageExpenses] = useState(1);
  const [currentPageIncomes, setCurrentPageIncomes] = useState(1);
  const [currentPageGoals, setCurrentPageGoals] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const verifiedUser = await verify();
        if (!verifiedUser) {
          navigate("/login");
          return;
        }

        setUser(verifiedUser);

        if (!profile) {
          const userProfile = await getUserProfile(verifiedUser.id);
          setProfile(userProfile);
        }
      } catch (err) {
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchUserData();
    }
  }, [loading, profile, navigate]);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading || !profile) {
    return <p>Loading...</p>;
  }

  // Process expenses for charts
  const expenseCategories = profile.expenses.reduce((acc, expense) => {
    // Check if category exists and is a valid string/array
    let category =
      Array.isArray(expense.categoryTags) && expense.categoryTags.length > 0
        ? expense.categoryTags[0] // Use first category if it's an array
        : expense.category || "Other"; // Use category field if it's a string

    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  // Extract data for Pie Chart
  const expenseCategoryLabels = Object.keys(expenseCategories);
  const expenseCategoryData = Object.values(expenseCategories);

  const monthlyExpenses = profile.expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const expenseMonths = Object.keys(monthlyExpenses);
  const expenseAmounts = Object.values(monthlyExpenses);

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 pl-64">
      {" "}
      {/* Fix navbar overlap */}
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Welcome, {profile.username}!
        </h1>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart: Expense Categories */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Expense Categories
            </h2>
            <Pie
              data={{
                labels: expenseCategoryLabels,
                datasets: [
                  {
                    label: "Expense Categories",
                    data: expenseCategoryData,
                    backgroundColor: [
                      "#FF6347",
                      "#FFD700",
                      "#32CD32",
                      "#1E90FF",
                      "#8A2BE2",
                      "#FF1493",
                    ],
                  },
                ],
              }}
            />
          </div>

          {/* Bar Chart: Monthly Expenses */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Expenses Over Time
            </h2>
            <Bar
              data={{
                labels: expenseMonths,
                datasets: [
                  {
                    label: "Monthly Expenses",
                    data: expenseAmounts,
                    backgroundColor: "#FF6347",
                    borderColor: "#FF4500",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Recent Expenses, Incomes, and Goals Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {["expenses", "incomes", "goals"].map((type) => {
            const currentPage =
              type === "expenses"
                ? currentPageExpenses
                : type === "incomes"
                ? currentPageIncomes
                : currentPageGoals;
            const setCurrentPage =
              type === "expenses"
                ? setCurrentPageExpenses
                : type === "incomes"
                ? setCurrentPageIncomes
                : setCurrentPageGoals;

            return (
              <div key={type} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Recent {type.charAt(0).toUpperCase() + type.slice(1)}
                </h2>
                {profile[type].length > 0 ? (
                  <ul className="space-y-3">
                    {paginate(profile[type], currentPage).map((item) => (
                      <li
                        key={item._id}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {item.description || item.title}
                          </span>
                          <span
                            className={
                              type === "expenses"
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {type !== "goals" ? `$${item.amount}` : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : ""}
                        </p>
                        {/* New Details */}
                        {type !== "goals" && (
                          <p className="text-sm text-gray-500">
                            Category:{" "}
                            {item.categoryTags || item.source || "N/A"}
                          </p>
                        )}
                        {type === "goals" && (
                          <p className="text-sm text-gray-500">
                            Status: {item.status || "Ongoing"}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">No {type} recorded.</p>
                )}

                {profile[type].length > itemsPerPage && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={
                        currentPage * itemsPerPage >= profile[type].length
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
