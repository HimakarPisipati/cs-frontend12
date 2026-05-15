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

// ==============================
// 📷 RECEIPT SCANNER (AI)
// ==============================
export const scanReceipt = (formData) => {
  if (isDemo()) {
    // Simulate AI processing delay and return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            data: {
              amount: 247,
              merchant: "Campus Café",
              date: new Date().toISOString().split("T")[0],
              category: "Food",
              paymentMethod: "upi",
              items: [
                { name: "Masala Dosa", price: 80 },
                { name: "Filter Coffee x2", price: 60 },
                { name: "Vada Pav", price: 45 },
                { name: "Mineral Water", price: 20 },
                { name: "Tax", price: 42 },
              ],
              confidence: 92,
            },
          },
        });
      }, 2500);
    });
  }
  return API.post("/receipts/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
};

export const categorizeExpense = (description, userMode) => {
  if (isDemo()) {
    return new Promise((resolve) => {
      const desc = (description || "").toLowerCase();
      let category = "Other";
      
      // Basic rule-based categorizer for demo mode
      if (desc.includes("food") || desc.includes("eat") || desc.includes("restaurant") || desc.includes("coffee") || desc.includes("pizza") || desc.includes("canteen")) category = "Food";
      else if (desc.includes("bus") || desc.includes("auto") || desc.includes("uber") || desc.includes("ola") || desc.includes("petrol") || desc.includes("fuel")) category = "Transport";
      else if (desc.includes("amazon") || desc.includes("shirt") || desc.includes("clothes") || desc.includes("zara") || desc.includes("myntra")) category = "Shopping";
      else if (desc.includes("rent") || desc.includes("room") || desc.includes("hostel") || desc.includes("emi")) category = "Rent";
      else if (desc.includes("book") || desc.includes("course") || desc.includes("exam") || desc.includes("fees") || desc.includes("tution")) category = "Education";
      else if (desc.includes("movie") || desc.includes("netflix") || desc.includes("game") || desc.includes("pvr")) category = "Entertainment";
      else if (desc.includes("medicine") || desc.includes("doctor") || desc.includes("hospital") || desc.includes("clinic")) category = "Healthcare";
      
      setTimeout(() => resolve({ category }), 600);
    });
  }
  return API.post("/receipts/categorize", { description, userMode }).then(res => res.data);
};

export const chatWithAI = (message, history = []) => {
  if (isDemo()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const msg = message.toLowerCase();
        let reply = "I'm your CampusSpend AI assistant. In Demo Mode, I can't see your real transactions, but in Live Mode, I can analyze your spending and answer any financial questions!";
        
        if (msg.includes("food")) reply = "Based on your mock data, you've spent about ₹1,200 on Food this month. That's within your ₹3,000 budget! 🍱";
        else if (msg.includes("can i afford") || msg.includes("phone")) reply = "Looking at your current savings and spending habits, buying a ₹20,000 phone might be tight this month. I suggest saving for 2 more months! 📱";
        else if (msg.includes("hello") || msg.includes("hi")) reply = "Hello! I'm your CampusSpend AI. How can I help you manage your finances today? 👋";
        
        resolve({ data: { message: reply } });
      }, 1500);
    });
  }
  return API.post("/ai/chat", { message, history });
};


