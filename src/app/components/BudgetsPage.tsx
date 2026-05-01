import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Plus, Wallet, AlertCircle, Pencil, Trash2, X, Save, PieChart, LayoutDashboard, ArrowRight, Info
} from "lucide-react";

// ✅ Import API services
import { getBudgets, addBudget, updateBudget, deleteBudget, getTransactions, getUserProfile } from "../../api/services";

interface BudgetsPageProps {
  userMode?: string;
}

export function BudgetsPage({ userMode = 'student' }: BudgetsPageProps) {
  const isEmployee = userMode === 'employee';
  const gradient = isEmployee ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600';
  const accentText = isEmployee ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400';
  const accentBg = isEmployee ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30';
  const accentLight = isEmployee ? 'text-blue-100' : 'text-purple-100';
  const btnWhiteText = isEmployee ? 'text-blue-600' : 'text-purple-600';
  const progressBg = isEmployee ? 'bg-blue-800' : 'bg-purple-800';

  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetModel] = useState<'new'>('new');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState("General");
  const [limit, setLimit] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("80");

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetRes, transRes, profileRes] = await Promise.all([
        getBudgets(),
        getTransactions(),
        getUserProfile()
      ]);

      setBudgets(Array.isArray(budgetRes.data) ? budgetRes.data : []);
      setTransactions(Array.isArray(transRes.data) ? transRes.data : []);

    } catch (error) {
      console.error("Failed to load budgets", error);
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategorySpending = (catName: string) => {
    if (!transactions || transactions.length === 0) return 0;

    if (catName === "General") {
      const budgetedCategories = budgets
        .filter(b => b.category?.toLowerCase() !== "general")
        .map(b => b.category?.toLowerCase());

      return transactions
        .filter(t => t.type === 'expense' && (t.category?.toLowerCase() === "general" || !budgetedCategories.includes(t.category?.toLowerCase())))
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    }

    return transactions
      .filter(t => t.type === 'expense' && t.category?.toLowerCase() === catName.toLowerCase())
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  };

  const handleSaveBudget = async () => {
    if (!limit) return alert("Please enter a limit");
    try {
      const budgetData = {
        category: category.toLowerCase() === "general" ? "General" : category,
        amount: Number(limit),
        alertThreshold: Number(alertThreshold)
      };

      if (budgetModel === 'new' && category !== "General" && !editingId) {
        if (Number(limit) > unallocatedLimit) {
          return alert(`You only have ₹${unallocatedLimit.toLocaleString()} left in your unallocated pool.`);
        }
      }

      let finalEditingId = editingId;
      
      // Fail-safe for General budget: if no editingId but it exists in our list, use that ID
      if (category.toLowerCase() === "general" && !finalEditingId) {
        const existingGeneral = budgets.find(b => b.category?.toLowerCase() === "general");
        if (existingGeneral) {
          finalEditingId = existingGeneral._id;
        }
      }

      if (finalEditingId) {
        await updateBudget(finalEditingId, budgetData);
      } else {
        await addBudget(budgetData);
      }
      setShowAddModal(false);
      setEditingId(null);
      setCategory("General");
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

  // --- MODEL CALCULATIONS ---
  const globalBudgetEntry = budgets.find(b => b.category?.toLowerCase() === "general");
  const globalLimit = globalBudgetEntry ? Number(globalBudgetEntry.amount) : 0;
  
  const totalAllocated = budgets
    .filter(b => b.category?.toLowerCase() !== "general")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const unallocatedLimit = Math.max(0, globalLimit - totalAllocated);
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalBudgetLimit = budgetModel === 'new' 
    ? globalLimit 
    : budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);


  const renderNewModel = () => (
    <div className="space-y-8">
      {/* 1. Global Budget Card */}
      {!globalBudgetEntry ? (
        <Card className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
          <div className={`w-16 h-16 ${accentBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <LayoutDashboard className={`w-8 h-8 ${accentText}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Set Your Monthly Budget Pool</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">First, set a total amount for the month. Then you can split it into different categories.</p>
          <Button 
            onClick={() => {
              if (globalBudgetEntry) {
                openEdit(globalBudgetEntry);
              } else {
                setEditingId(null);
                setCategory("General");
                setLimit("");
                setShowAddModal(true);
              }
            }}
            className={`bg-gradient-to-r ${gradient} text-white px-8 h-12 rounded-xl`}
          >
            {globalBudgetEntry ? 'Edit Global Budget' : 'Set Global Budget'}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Unallocated / Pool Status */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`p-6 bg-white dark:bg-gray-800 border-0 shadow-lg`}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Unallocated Pool</p>
              <h4 className={`text-2xl font-bold ${unallocatedLimit > 0 ? accentText : 'text-orange-500'}`}>₹{unallocatedLimit.toLocaleString()}</h4>
              <p className="text-xs text-gray-400 mt-2">Available to split into categories</p>
            </Card>
            
            <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Allocated to Categories</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalAllocated.toLocaleString()}</h4>
              <div className="mt-2 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${gradient}`} 
                  style={{ width: `${Math.min((totalAllocated / globalLimit) * 100, 100)}%` }}
                />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Spending</p>
              <h4 className={`text-2xl font-bold ${totalSpent > globalLimit ? 'text-red-500' : 'text-green-500'}`}>₹{totalSpent.toLocaleString()}</h4>
              <p className="text-xs text-gray-400 mt-2">Out of ₹{globalLimit.toLocaleString()} total pool</p>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className={`w-5 h-5 ${accentText}`} />
              Budget Splits
            </h3>
            <Button 
              size="sm"
              disabled={unallocatedLimit <= 0}
              onClick={() => {
                setEditingId(null);
                setCategory("Food");
                setLimit("");
                setShowAddModal(true);
              }}
              className={`bg-gradient-to-r ${gradient} text-white`}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Split
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Catch-all General Card */}
            <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative group overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`} />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">General / Others</h4>
                  <p className="text-xs text-gray-500">Effective limit from unallocated pool</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEdit(globalBudgetEntry)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-blue-500 transition-colors"
                    title="Edit Global Budget"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {globalBudgetEntry && (
                    <button 
                      onClick={() => handleDelete(globalBudgetEntry._id)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete Global Budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Spent: ₹{getCategorySpending("General").toLocaleString()}</span>
                  <span className="font-semibold">Pool: ₹{unallocatedLimit.toLocaleString()}</span>
                </div>
                <Progress 
                  value={unallocatedLimit > 0 ? Math.min((getCategorySpending("General") / unallocatedLimit) * 100, 100) : 0} 
                  className="h-2 bg-gray-100 dark:bg-gray-700" 
                />
              </div>
            </Card>

            {/* Split Category Cards */}
            {budgets.filter(b => b.category?.toLowerCase() !== "general").map((budget) => {
              const spent = getCategorySpending(budget.category);
              const limit = Number(budget.amount) || 0;
              const percentage = Math.min((spent / limit) * 100, 100);
              
              return (
                <Card key={budget._id} className="p-6 border-0 shadow-lg bg-white dark:bg-gray-800 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{budget.category}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(budget)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(budget._id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}</span>
                      <span className="font-medium">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Card */}
      <Card className={`p-6 bg-gradient-to-r ${gradient} text-white border-0 shadow-xl overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold">Budgets</h2>
            </div>
            <p className={`${accentLight} mt-1`}>
              Total Spending: ₹{totalSpent.toLocaleString()} / ₹{totalBudgetLimit.toLocaleString()}
            </p>
          </div>
            <Button
              onClick={() => {
                if (globalBudgetEntry) {
                  openEdit(globalBudgetEntry);
                } else {
                  setEditingId(null);
                  setCategory("General");
                  setLimit("");
                  setShowAddModal(true);
                }
              }}
              className={`bg-white ${btnWhiteText} hover:bg-gray-100 border-0 shadow-md font-bold px-6 h-11`}
            >
              <Save className="w-4 h-4 mr-2" />
              {globalBudgetEntry ? 'Edit Global Pool' : 'Set Global Pool'}
            </Button>
        </div>

        <div className="mt-6 relative z-10">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Usage</span>
            <span>{totalBudgetLimit > 0 ? Math.round((totalSpent / totalBudgetLimit) * 100) : 0}%</span>
          </div>
          <Progress
            value={totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0}
            className={`h-3 ${progressBg}`}
          />
        </div>
      </Card>


      {/* Content Area */}
      {loading ? (
        <div className="text-center py-20">
          <div className={`w-10 h-10 border-4 border-t-transparent ${accentText} rounded-full animate-spin mx-auto mb-4`} />
          <p className="text-gray-500 dark:text-gray-400">Loading your budgets...</p>
        </div>
      ) : (
        renderNewModel()
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 dark:text-white shadow-2xl border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className={`w-5 h-5 ${accentText}`} />}
                {editingId ? (category.toLowerCase() === "general" ? "Edit Global Pool" : "Edit Split") : (category.toLowerCase() === "general" ? "Set Global Pool" : "Add Split")}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)} className="dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-5">
              <div>
                <Label className="dark:text-gray-300 font-semibold mb-2 block">Category</Label>
                {budgetModel === 'new' && category.toLowerCase() === "general" ? (
                   <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 text-sm">
                     Global Monthly Budget Pool
                   </div>
                ) : (
                  <select
                    className="w-full p-3 rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    value={category}
                    disabled={category.toLowerCase() === "general" && editingId !== null}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="General">General Pool</option>
                    {["Food", "Travel", "Entertainment", "Shopping", "Bills", "Health", "Education", "Transport", "Other"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <Label className="dark:text-gray-300 font-semibold mb-2 block">
                  {category.toLowerCase() === "general" ? "Total Monthly Amount" : "Split Amount"} (₹)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={category.toLowerCase() === "general" ? "e.g. 20000" : "e.g. 5000"}
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="pl-8 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                  />
                  <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {budgetModel === 'new' && category !== "General" && unallocatedLimit > 0 && (
                  <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Max available from pool: ₹{unallocatedLimit.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  onClick={handleSaveBudget} 
                  className={`flex-1 h-12 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update Budget" : "Save Budget"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}