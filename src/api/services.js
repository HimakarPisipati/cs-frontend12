import API from "./api";

// ==============================
// 🔐 AUTHENTICATION
// ==============================
export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
export const resendOtp = (data) => API.post("/auth/resend-otp", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// ✅ NEW: Profile Management
export const changePassword = (data) => API.put("/auth/change-password", data);
export const deleteAccount = (data) => API.delete("/auth/delete-account", { data });
export const updateProfile = (data) => API.put("/auth/update-profile", data);
// Add this to your exports:
export const getUserProfile = () => API.get("/auth/me");
export const switchMode = (data) => API.post("/auth/switch-mode", data);
// Note: Axios requires body data for DELETE requests to be wrapped in { data: ... }

// ✅ ALIASES (Backwards Compatibility)
export const registerUser = signup;
export const loginUser = login;

// ==============================
// 💸 TRANSACTIONS
// ==============================
export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);

// ==============================
// 💰 BUDGETS
// ==============================
export const getBudgets = () => API.get("/budgets");
export const addBudget = (data) => API.post("/budgets", data);
export const updateBudget = (id, data) => API.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

// ✅ ALIASES (Backwards Compatibility)
export const getBudget = getBudgets;
export const saveBudget = addBudget;

// ==============================
// 🎯 SAVINGS GOALS
// ==============================
export const getSavingsGoals = () => API.get("/savings");
export const addSavingsGoal = (data) => API.post("/savings", data);
export const updateSavingsGoal = (id, data) => API.put(`/savings/${id}`, data);
export const deleteSavingsGoal = (id) => API.delete(`/savings/${id}`);

// ==============================
// 📋 DUES & DEBTS
// ==============================
export const getDues = () => API.get("/dues");
export const addDue = (data) => API.post("/dues", data);
export const updateDue = (id, data) => API.put(`/dues/${id}`, data);
export const deleteDue = (id) => API.delete(`/dues/${id}`);

// ==============================
// 💼 SALARY (Employee Mode)
// ==============================
export const getSalaries = () => API.get("/salary");
export const addSalary = (data) => API.post("/salary", data);
export const updateSalary = (id, data) => API.put(`/salary/${id}`, data);
export const deleteSalary = (id) => API.delete(`/salary/${id}`);

// ==============================
// 📅 REMINDERS
// ==============================
export const getReminders = () => API.get("/reminders");
export const addReminder = (data) => API.post("/reminders", data);
export const updateReminder = (id, data) => API.put(`/reminders/${id}`, data);
export const deleteReminder = (id) => API.delete(`/reminders/${id}`);