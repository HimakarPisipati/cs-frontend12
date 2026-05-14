import API from "./api";
import { demoStore } from "./demoStore";

const isDemo = () => localStorage.getItem("isDemo") === "true";

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
export const changePassword = (data) => {
  if (isDemo()) {
    return Promise.reject({ response: { data: { message: "Action Restricted: You cannot change credentials while in Demo Mode. Please exit demo mode to manage your real account." } } });
  }
  return API.put("/auth/change-password", data);
};

export const deleteAccount = (data) => {
  if (isDemo()) {
    return Promise.reject({ response: { data: { message: "Action Restricted: Account deletion is disabled in Demo Mode." } } });
  }
  return API.delete("/auth/delete-account", { data });
};
export const updateProfile = (data) => {
  if (isDemo()) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = { ...user, ...data };
    localStorage.setItem("user", JSON.stringify(updated));
    return Promise.resolve({ data: updated });
  }
  return API.put("/auth/update-profile", data);
};
export const getUserProfile = () => {
  if (isDemo()) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return Promise.resolve({ data: user });
  }
  return API.get("/auth/me");
};
export const switchMode = (data) => {
  if (isDemo()) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.mode = data.mode;
    localStorage.setItem("user", JSON.stringify(user));
    return Promise.resolve({ data: user });
  }
  return API.post("/auth/switch-mode", data);
};
export const requestEmailChange = (data) => {
  if (isDemo()) {
    return Promise.reject({ response: { data: { message: "Action Restricted: Email changes are disabled in Demo Mode." } } });
  }
  return API.post("/auth/request-email-change", data);
};

export const verifyEmailChange = (data) => {
  if (isDemo()) {
    return Promise.reject({ response: { data: { message: "Action Restricted: Email verification is disabled in Demo Mode." } } });
  }
  return API.post("/auth/verify-email-change", data);
};
// Note: Axios requires body data for DELETE requests to be wrapped in { data: ... }

// ✅ ALIASES (Backwards Compatibility)
export const registerUser = signup;
export const loginUser = login;

// ==============================
// 💸 TRANSACTIONS
// ==============================
export const getTransactions = () => isDemo() ? demoStore.get('transactions') : API.get("/transactions");
export const addTransaction = (data) => isDemo() ? demoStore.add('transactions', data) : API.post("/transactions", data);
export const deleteTransaction = (id) => isDemo() ? demoStore.delete('transactions', id) : API.delete(`/transactions/${id}`);
export const updateTransaction = (id, data) => isDemo() ? demoStore.update('transactions', id, data) : API.put(`/transactions/${id}`, data);

// ==============================
// 💰 BUDGETS
// ==============================
export const getBudgets = () => isDemo() ? demoStore.get('budgets') : API.get("/budgets");
export const addBudget = (data) => isDemo() ? demoStore.add('budgets', data) : API.post("/budgets", data);
export const updateBudget = (id, data) => isDemo() ? demoStore.update('budgets', id, data) : API.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => isDemo() ? demoStore.delete('budgets', id) : API.delete(`/budgets/${id}`);

// ✅ ALIASES (Backwards Compatibility)
export const getBudget = getBudgets;
export const saveBudget = addBudget;

// ==============================
// 🎯 SAVINGS GOALS
// ==============================
export const getSavingsGoals = () => isDemo() ? demoStore.get('savings') : API.get("/savings");
export const addSavingsGoal = (data) => isDemo() ? demoStore.add('savings', data) : API.post("/savings", data);
export const updateSavingsGoal = (id, data) => isDemo() ? demoStore.update('savings', id, data) : API.put(`/savings/${id}`, data);
export const deleteSavingsGoal = (id) => isDemo() ? demoStore.delete('savings', id) : API.delete(`/savings/${id}`);

// ==============================
// 📋 DUES & DEBTS
// ==============================
export const getDues = () => isDemo() ? demoStore.get('dues') : API.get("/dues");
export const addDue = (data) => isDemo() ? demoStore.add('dues', data) : API.post("/dues", data);
export const updateDue = (id, data) => isDemo() ? demoStore.update('dues', id, data) : API.put(`/dues/${id}`, data);
export const deleteDue = (id) => isDemo() ? demoStore.delete('dues', id) : API.delete(`/dues/${id}`);

// ==============================
// 💼 SALARY (Employee Mode)
// ==============================
export const getSalaries = () => isDemo() ? demoStore.get('salary') : API.get("/salary");
export const addSalary = (data) => isDemo() ? demoStore.add('salary', data) : API.post("/salary", data);
export const updateSalary = (id, data) => isDemo() ? demoStore.update('salary', id, data) : API.put(`/salary/${id}`, data);
export const deleteSalary = (id) => isDemo() ? demoStore.delete('salary', id) : API.delete(`/salary/${id}`);

// ==============================
// 📅 REMINDERS
// ==============================
export const getReminders = () => isDemo() ? demoStore.get('reminders') : API.get("/reminders");
export const addReminder = (data) => isDemo() ? demoStore.add('reminders', data) : API.post("/reminders", data);
export const updateReminder = (id, data) => isDemo() ? demoStore.update('reminders', id, data) : API.put(`/reminders/${id}`, data);
export const deleteReminder = (id) => isDemo() ? demoStore.delete('reminders', id) : API.delete(`/reminders/${id}`);

// ==============================
// ⭐ REVIEWS
// ==============================
export const getReviews = () => API.get("/reviews");
export const getMyReviews = () => isDemo() ? demoStore.get('reviews') : API.get("/reviews/me");
export const addReview = (data) => isDemo() ? demoStore.add('reviews', data) : API.post("/reviews", data);

export const updateReview = (id, data) => isDemo() ? demoStore.update('reviews', id, data) : API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => isDemo() ? demoStore.delete('reviews', id) : API.delete(`/reviews/${id}`);

// ==============================
// 🔔 NOTIFICATIONS
// ==============================
export const getNotifications = () => isDemo() ? Promise.resolve({ data: [] }) : API.get("/notifications");
export const markNotificationAsRead = (id) => isDemo() ? Promise.resolve() : API.put(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => isDemo() ? Promise.resolve() : API.put("/notifications/read-all");


