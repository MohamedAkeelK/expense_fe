import api from "./apiConfig";

// Get all expenses for a user
export const getExpensesByUser = async (userId) => {
  try {
    const resp = await api.get(`/expenses/${userId}`);
    return resp.data; // Return the data (expenses and user info)
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    throw error;
  }
};

// Add a new expense
export const addExpense = async (expenseData) => {
  try {
    const resp = await api.post("/expenses", expenseData);
    return resp.data; // Return the newly created expense data
  } catch (error) {
    console.error("Error adding expense:", error.message);
    throw error;
  }
};

// Update an existing expense
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const resp = await api.put(`/expenses/${expenseId}`, expenseData);
    return resp.data; // Return the updated expense data
  } catch (error) {
    console.error("Error updating expense:", error.message);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    const resp = await api.delete(`/expenses/${expenseId}`);
    return resp.data; // Return the deleted expense data (or a success message)
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    throw error;
  }
};
