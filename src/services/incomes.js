import api from "./apiConfig";

// Get all incomes for a user
export const getIncomesByUser = async (userId) => {
  try {
    const resp = await api.get(`/incomes/${userId}`);
    return resp.data;
  } catch (error) {
    console.error("Error fetching incomes:", error.message);
    throw error;
  }
};

// Add a new income
export const addIncome = async (incomeData) => {
  try {
    const resp = await api.post("/incomes", incomeData);
    return resp.data;
  } catch (error) {
    console.error("Error adding income:", error.message);
    throw error;
  }
};

// Update income
export const updateIncome = async (incomeId, incomeData) => {
  try {
    const resp = await api.put(`/incomes/${incomeId}`, incomeData);
    return resp.data;
  } catch (error) {
    console.error("Error updating income:", error.message);
    throw error;
  }
};

// Delete income
export const deleteIncome = async (incomeId) => {
  try {
    const resp = await api.delete(`/incomes/${incomeId}`);
    return resp.data;
  } catch (error) {
    console.error("Error deleting income:", error.message);
    throw error;
  }
};
