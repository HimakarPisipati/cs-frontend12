// 🏦 In-memory/Session storage for Demo Mode
// This ensures data is not sent to the database and is cleared when the session ends.

const STORAGE_KEY = "demo_db";

const getDB = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Initial sample data for the demo
    const initialData = {
      transactions: [
        { _id: 't1', note: 'Coffee', amount: 150, type: 'expense', category: 'Food', date: new Date().toISOString(), paymentMethod: 'upi' },
        { _id: 't2', note: 'Freelance Work', amount: 5000, type: 'income', category: 'Work', date: new Date().toISOString(), paymentMethod: 'bank' }
      ],
      budgets: [
        { _id: 'b0', category: 'General', amount: 5000, spent: 150 },
        { _id: 'b1', category: 'Food', amount: 3000, spent: 150 },
        { _id: 'b2', category: 'Entertainment', amount: 2000, spent: 0 }
      ],
      savings: [
        { _id: 's1', name: 'New Laptop', targetAmount: 60000, currentAmount: 15000, emoji: '💻' }
      ],
      dues: [
        { _id: 'd1', personName: 'Hostel Rent', amount: 4500, type: 'debt', date: new Date().toISOString(), settled: false }
      ],
      salary: [
        { _id: 'sal1', month: new Date().toISOString().slice(0, 7), grossSalary: 50000, pf: 5000, tax: 2000, insurance: 1000, otherDeductions: 0, netSalary: 42000 }
      ],
      reminders: [
        { _id: 'r1', title: 'Pay Electricity Bill', amount: 1200, reminderDate: new Date().toISOString(), isPaid: false, isRecurring: false }
      ],
      reviews: []
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  const db = JSON.parse(data);
  // Ensure all collections exist
  const collections = ['transactions', 'budgets', 'savings', 'dues', 'salary', 'reminders', 'reviews'];
  collections.forEach(c => { if (!db[c]) db[c] = []; });
  return db;
};

const saveDB = (db) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

const wrapResponse = (data) => Promise.resolve({ data });

export const demoStore = {
  // Generic CRUD
  get: (collection) => wrapResponse(getDB()[collection] || []),
  
  add: (collection, item) => {
    const db = getDB();
    const newItem = { ...item, _id: Math.random().toString(36).substr(2, 9), date: item.date || new Date().toISOString() };
    if (!db[collection]) db[collection] = [];
    db[collection].push(newItem);
    saveDB(db);
    return wrapResponse(newItem);
  },
  
  update: (collection, id, updates) => {
    const db = getDB();
    db[collection] = db[collection].map(item => 
      item._id === id ? { ...item, ...updates } : item
    );
    saveDB(db);
    return wrapResponse(db[collection].find(item => item._id === id));
  },
  
  delete: (collection, id) => {
    const db = getDB();
    db[collection] = db[collection].filter(item => item._id !== id);
    saveDB(db);
    return wrapResponse({ success: true });
  }
};
