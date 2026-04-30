// 🏦 In-memory/Session storage for Demo Mode
// This ensures data is not sent to the database and is cleared when the session ends.

const STORAGE_KEY = "demo_db";

const getDB = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Initial sample data for the demo
    const initialData = {
      transactions: [
        { _id: 't1', title: 'Coffee', amount: 150, type: 'expense', category: 'Food', date: new Date().toISOString() },
        { _id: 't2', title: 'Freelance Work', amount: 5000, type: 'income', category: 'Work', date: new Date().toISOString() }
      ],
      budgets: [
        { _id: 'b1', category: 'Food', limit: 3000, spent: 150 },
        { _id: 'b2', category: 'Entertainment', limit: 2000, spent: 0 }
      ],
      savings: [
        { _id: 's1', title: 'New Laptop', targetAmount: 60000, savedAmount: 15000, category: 'Electronics' }
      ],
      dues: [
        { _id: 'd1', title: 'Hostel Rent', amount: 4500, type: 'debt', dueDate: new Date().toISOString() }
      ],
      salary: [
        { _id: 'sal1', month: 'April', basic: 50000, deductions: 5000, net: 45000 }
      ],
      reminders: [
        { _id: 'r1', title: 'Pay Electricity Bill', date: new Date().toISOString(), category: 'Bills' }
      ],
      reviews: []
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveDB = (db) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

const wrapResponse = (data) => Promise.resolve({ data });

export const demoStore = {
  // Generic CRUD
  get: (collection) => wrapResponse(getDB()[collection]),
  
  add: (collection, item) => {
    const db = getDB();
    const newItem = { ...item, _id: Math.random().toString(36).substr(2, 9), date: item.date || new Date().toISOString() };
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
