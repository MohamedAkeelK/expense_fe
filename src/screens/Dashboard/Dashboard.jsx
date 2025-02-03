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

// Register the chart components
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

  // Process expenses and incomes for charts
  const expenseCategories = profile.expenses.reduce((acc, expense) => {
    const category = expense.categoryTags.join(", ");
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const expenseCategoryLabels = Object.keys(expenseCategories);
  const expenseCategoryData = Object.values(expenseCategories);

  // Expenses over time (monthly)
  const monthlyExpenses = profile.expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const expenseMonths = Object.keys(monthlyExpenses);
  const expenseAmounts = Object.values(monthlyExpenses);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Welcome, {profile.username}!
        </h1>

        {/* Top Section: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense Categories Pie Chart */}
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
                      "#FF6347", // Tomato
                      "#FFD700", // Gold
                      "#32CD32", // LimeGreen
                      "#1E90FF", // DodgerBlue
                      "#8A2BE2", // BlueViolet
                      "#FF1493", // DeepPink
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          {/* Expenses Over Time Bar Chart */}
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
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Expenses Over Time",
                  },
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Bottom Section: Recent Expenses, Incomes, and Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Recent Expenses */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Expenses
            </h2>
            {profile.expenses.length > 0 ? (
              <ul className="space-y-3">
                {profile.expenses.map((expense) => (
                  <li
                    key={expense._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {expense.description}
                      </span>
                      <span className="text-red-600">${expense.amount}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-500">No expenses recorded.</p>
            )}
          </div>

          {/* Recent Incomes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Incomes
            </h2>
            {profile.incomes.length > 0 ? (
              <ul className="space-y-3">
                {profile.incomes.map((income) => (
                  <li
                    key={income._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {income.description}
                      </span>
                      <span className="text-green-600">${income.amount}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(income.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-500">No incomes recorded.</p>
            )}
          </div>

          {/* Goals */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Goals</h2>
            {profile.goals.length > 0 ? (
              <ul className="space-y-3">
                {profile.goals.map((goal) => (
                  <li
                    key={goal._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <span className="text-lg font-semibold">{goal.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-500">No goals set.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
