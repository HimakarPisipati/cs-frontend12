import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Plus, Wallet, AlertCircle, Pencil, Trash2, X, Save
} from "lucide-react";

// ✅ Import API services
import { getBudgets, addBudget, updateBudget, deleteBudget, getTransactions } from "../../api/services";

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  // ✅ Initialize as empty array
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("80");

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetRes, transRes] = await Promise.all([
        getBudgets(),
        getTransactions()
      ]);
      
      // ✅ FIX: Strict type checking to prevent crashes
      setBudgets(Array.isArray(budgetRes.data) ? budgetRes.data : []);
      setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
      
    } catch (error) {
      console.error("Failed to load budgets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ CALCULATE SPENDING MANUALLY (Fixes Ghost Data)
  const getCategorySpending = (catName: string) => {
    if (!transactions || transactions.length === 0) return 0;
    
    return transactions
      .filter(t => t.type === 'expense' && t.category === catName)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  };

  const handleSaveBudget = async () => {
    if (!limit) return alert("Please enter a limit");
    try {
      const budgetData = {
        category,
        amount: Number(limit),
        alertThreshold: Number(alertThreshold)
      };

      if (editingId) {
        await updateBudget(editingId, budgetData);
      } else {
        await addBudget(budgetData);
      }
      setShowAddModal(false);
      setEditingId(null);
      setCategory("Food");
      setLimit("");
      loadData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save budget");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await deleteBudget(id);
      loadData();
    } catch (error) {
      console.error("Failed to delete budget", error);
    }
  };

  const openEdit = (budget: any) => {
    setCategory(budget.category);
    setLimit(budget.amount || budget.limit);
    setAlertThreshold(budget.alertThreshold || "80");
    setEditingId(budget._id);
    setShowAddModal(true);
  };

  // Calculate Totals locally
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getCategorySpending(b.category), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Monthly Budgets</h2>
            <p className="text-purple-100 mt-1">
              Total: ₹{totalSpent.toLocaleString()} / ₹{totalBudgetLimit.toLocaleString()}
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingId(null);
              setCategory("Food");
              setLimit("");
              setShowAddModal(true);
            }}
            className="bg-white text-purple-600 hover:bg-gray-100 border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Set New Budget
          </Button>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Total Usage</span>
            <span>{totalBudgetLimit > 0 ? Math.round((totalSpent / totalBudgetLimit) * 100) : 0}%</span>
          </div>
          <Progress 
            value={totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0} 
            className="h-3 bg-purple-800" 
          />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-center col-span-2 text-gray-500 dark:text-gray-400">Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No budgets set yet. Click "Set New Budget" to start.</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = getCategorySpending(budget.category);
            const limit = Number(budget.amount) || Number(budget.limit) || 0;
            const percentage = Math.min((spent / limit) * 100, 100);
            const isOver = spent > limit;
            const isNear = percentage >= (budget.alertThreshold || 80);

            return (
              <Card key={budget._id} className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg dark:text-white relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(budget)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-full">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(budget._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
                    <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{budget.category}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ₹{spent.toLocaleString()} spent of ₹{limit.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${isOver ? "bg-red-100" : "bg-gray-100"} dark:bg-gray-700`}
                  />
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className={isOver ? "text-red-500" : isNear ? "text-orange-500" : "text-green-500"}>
                      {isOver ? "Over Budget!" : isNear ? "Near Limit" : "On Track"}
                    </span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 dark:text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingId ? "Edit Budget" : "New Budget"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)} className="dark:text-gray-400">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Category</Label>
                <select 
                  className="w-full mt-1 p-3 rounded-md border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {["Food", "Travel", "Entertainment", "Shopping", "Bills", "Health", "Education", "Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="dark:text-gray-300">Budget Limit (₹)</Label>
                <Input 
                  type="number" 
                  placeholder="e.g. 5000"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button onClick={handleSaveBudget} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Budget
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}