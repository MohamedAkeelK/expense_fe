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
    <div>
      <h1>Welcome, {profile.username}!</h1>
      <p>Email: {profile.email}</p>
      <p>Date of Birth: {profile.dob}</p>
      <p>Total Money: ${profile.totalMoney}</p>

      <h2>Expenses</h2>
      {profile.expenses.length > 0 ? (
        <ul>
          {profile.expenses.map((expense) => (
            <li key={expense._id}>
              {expense.description} - ${expense.amount} on{" "}
              {new Date(expense.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses recorded.</p>
      )}

      <h2>Incomes</h2>
      {profile.incomes.length > 0 ? (
        <ul>
          {profile.incomes.map((income) => (
            <li key={income._id}>
              {income.description} - ${income.amount} on{" "}
              {new Date(income.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No incomes recorded.</p>
      )}

      <h2>Goals</h2>
      {profile.goals.length > 0 ? (
        <ul>
          {profile.goals.map((goal) => (
            <li key={goal._id}>{goal.title}</li>
          ))}
        </ul>
      ) : (
        <p>No goals set.</p>
      )}
    </div>
  );
};

export default Dashboard;
