import api from "./apiConfig";

// Get all goals for the logged-in user
export const getGoalsByUser = async () => {
  try {
    const resp = await api.get("/goals"); // Assumes auth middleware sets userId in backend
    return resp.data;
  } catch (error) {
    console.error("Error fetching goals:", error.message);
    throw error;
  }
};

// Add a new goal
export const addGoal = async (goalData) => {
  try {
    const resp = await api.post("/goals", goalData);
    return resp.data;
  } catch (error) {
    console.error("Error adding goal:", error.message);
    throw error;
  }
};

// Update an existing goal by ID
export const updateGoal = async (goalId, goalData) => {
  try {
    const resp = await api.put(`/goals/${goalId}`, goalData);
    return resp.data;
  } catch (error) {
    console.error("Error updating goal:", error.message);
    throw error;
  }
};

// Delete a goal by ID
export const deleteGoal = async (goalId) => {
  try {
    const resp = await api.delete(`/goals/${goalId}`);
    return resp.data;
  } catch (error) {
    console.error("Error deleting goal:", error.message);
    throw error;
  }
};
