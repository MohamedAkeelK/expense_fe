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

  if (error) return <p>{error}</p>;
  if (loading || !profile) return <p>Loading...</p>;

  // Process expenses for charts
  const expenseCategories = profile.expenses.reduce((acc, expense) => {
    let category =
      Array.isArray(expense.categoryTags) && expense.categoryTags.length > 0
        ? expense.categoryTags[0]
        : expense.category || "Other";

    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

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
    <div className="min-h-screen bg-gray-100 px-4 py-2 flex flex-col space-y-2">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        {/* User Widget */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <img
            alt="Profile"
            src={profile.profielPicture}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.username}
            </h2>
            <p className="text-xs text-gray-500">username</p>
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Total Balance:
          </p>
          <p className="text-2xl font-bold text-green-600">
            ${profile.totalMoney || 0}
          </p>
        </div>

        {/* Latest Expense */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Latest Expense
          </h3>
          {profile.expenses?.length > 0 ? (
            <>
              <p className="text-xl text-red-600 font-bold">
                ${profile.expenses[0].amount}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(profile.expenses[0].date).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-gray-400">No expense recorded</p>
          )}
        </div>

        {/* Latest Income */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Latest Income
          </h3>
          {profile.incomes?.length > 0 ? (
            <>
              <p className="text-xl text-green-600 font-bold">
                ${profile.incomes[0].amount}
              </p>
              <p className="text-sm text-gray-600">
                Source: {profile.incomes[0].source}
              </p>
            </>
          ) : (
            <p className="text-gray-400">No income recorded</p>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Expense Categories
          </h2>
          <div className="flex-1">
            <div className="w-full h-70">
              <Pie
                data={{
                  labels: expenseCategoryLabels,
                  datasets: [
                    {
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
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    title: {
                      display: false,
                      text: "Expense Categories",
                    },
                  },
                  layout: {
                    padding: 0,
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Monthly Expenses
          </h2>
          <div className="flex-1">
            <div className="w-full h-70">
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
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
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
            <div
              key={type}
              className="bg-white rounded-lg shadow p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Recent {type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              {profile[type].length > 0 ? (
                <ul className="space-y-2 flex-1 overflow-auto">
                  {paginate(profile[type], currentPage).map((item) => (
                    <li key={item._id} className="border-b pb-2">
                      <div className="flex justify-between">
                        <span>{item.description || item.title}</span>
                        {type !== "goals" && (
                          <span
                            className={
                              type === "expenses"
                                ? "text-red-500"
                                : "text-green-500"
                            }
                          >
                            ${item.amount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.date && new Date(item.date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No {type} recorded.</p>
              )}

              {/* Pagination */}
              {profile[type].length > itemsPerPage && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      currentPage * itemsPerPage >= profile[type].length
                    }
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
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
  );
};

export default Dashboard;
