export function DashboardHome() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Dashboard Overview
      </h2>

      <p className="text-gray-600">
        Welcome back 👋  
        Track your expenses, budgets, and savings here.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-2xl font-bold text-green-600">₹0</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">₹0</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-2xl font-bold text-blue-600">₹0</p>
        </div>
      </div>
    </div>
  );
}
