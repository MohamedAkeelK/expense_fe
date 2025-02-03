import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verify, getUserProfile } from "../../services/users";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verify the user
        const verifiedUser = await verify();
        if (!verifiedUser) {
          // If verification fails, redirect to login
          navigate("/login");
          return;
        }

        setUser(verifiedUser); // Set the verified user data

        // Fetch the user's profile only if it's not already loaded
        if (!profile) {
          console.log("Fetching user profile...");
          const userProfile = await getUserProfile(verifiedUser.id);
          setProfile(userProfile); // Set the profile data
          console.log(userProfile);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false when the request is complete
      }
    };

    if (loading) {
      fetchUserData(); // Only fetch data if it's loading
    }
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading || !profile) {
    return <p>Loading...</p>;
  }

  if (profile) {
    console.log(profile);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Welcome, {profile.username}!
        </h1>

        <div className="mt-6">
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Date of Birth:</span>{" "}
              {profile.dob}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Total Money:</span> $
              {profile.totalMoney}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Expenses</h2>
            {profile.expenses.length > 0 ? (
              <ul className="mt-4 space-y-3">
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

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Incomes</h2>
            {profile.incomes.length > 0 ? (
              <ul className="mt-4 space-y-3">
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

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Goals</h2>
            {profile.goals.length > 0 ? (
              <ul className="mt-4 space-y-3">
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
