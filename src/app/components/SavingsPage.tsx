import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Target,
  Plus,
  TrendingUp,
  X,
  DollarSign,
  Trash2
} from "lucide-react";

// Import services
import { getSavingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } from "../../api/services";

export function SavingsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState<string | null>(null);
  
  // Forms
  const [contributeAmount, setContributeAmount] = useState('');
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");

  const loadGoals = async () => {
    try {
      setLoading(true);
      const res = await getSavingsGoals();
      setGoals(res.data);
    } catch (error) {
      console.error("Failed to load savings goals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);

  const handleContribute = async (goalId: string) => {
    const amount = parseFloat(contributeAmount);
    const goal = goals.find(g => (g._id || g.id) === goalId);

    if (amount > 0 && goal) {
      try {
        const newAmount = (Number(goal.currentAmount) || 0) + amount;
        await updateSavingsGoal(goalId, { currentAmount: newAmount });
        setContributeAmount('');
        setShowContributeModal(null);
        loadGoals(); 
      } catch (error) {
        alert("Failed to update savings goal");
      }
    }
  };

  const handleCreateGoal = async () => {
    if (!newName || !newTarget) return alert("Please fill in name and target");
    try {
      await addSavingsGoal({
        name: newName,
        targetAmount: Number(newTarget),
        currentAmount: 0,
        emoji: newEmoji
      });
      setNewName("");
      setNewTarget("");
      setNewEmoji("🎯");
      setShowAddModal(false);
      loadGoals();
    } catch (error) {
      alert("Failed to create goal");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteSavingsGoal(id);
        loadGoals();
      } catch (error) {
        console.error("Failed to delete goal");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Savings Overview */}
      <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white border-0 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm mb-2">Total Saved</p>
            <h2 className="text-4xl font-bold">
              {loading ? "..." : `₹${totalSaved.toLocaleString()}`}
            </h2>
            <p className="text-green-100 text-sm mt-2">
              of ₹{totalTarget.toLocaleString()} target
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Keep going! You're {totalTarget > 0 ? Math.round((totalSaved/totalTarget)*100) : 0}% there</span>
        </div>
      </Card>

      {/* Motivational Message */}
      <Card className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-800">
        <p className="text-center text-purple-900 dark:text-purple-200 font-medium">
          💪 Great job saving! Every rupee counts towards your dreams ✨
        </p>
      </Card>

      {/* Savings Goals Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
           <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">Loading goals...</p>
        ) : goals.map((goal) => {
          const current = Number(goal.currentAmount) || 0;
          const target = Number(goal.targetAmount) || 1; 
          const percentage = Math.min((current / target) * 100, 100);
          const remaining = Math.max(target - current, 0);
          
          return (
            // 🌙 Added Dark Mode classes here
            <Card key={goal._id || goal.id} className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all relative group dark:text-white">
              
              <button 
                onClick={() => handleDelete(goal._id || goal.id)}
                className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{goal.emoji || "🎯"}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{goal.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{current.toLocaleString()} saved
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {/* Progress Bar Background */}
                <Progress 
                  value={percentage} 
                  className="h-3 bg-gray-100 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-teal-500"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{Math.round(percentage)}% complete</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Goal: ₹{target.toLocaleString()}
                  </span>
                </div>
              </div>

              {percentage < 100 ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    ₹{remaining.toLocaleString()} more to reach your goal! 🎯
                  </p>
                  <Button 
                    onClick={() => setShowContributeModal(goal._id || goal.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </Button>
                </>
              ) : (
                <div className="text-center py-3">
                  <p className="text-green-600 dark:text-green-400 font-semibold text-lg">🎉 Goal Achieved!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Congratulations on reaching your target!</p>
                </div>
              )}
            </Card>
          );
        })}

        {/* Add New Goal Card */}
        <Card className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all cursor-pointer">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full h-full flex flex-col items-center justify-center gap-3 min-h-[200px]"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
              <Plus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white">Create New Goal</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Start saving for something special</p>
            </div>
          </button>
        </Card>
      </div>

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 dark:text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add Money to Goal</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowContributeModal(null)} className="dark:text-gray-400">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {(() => {
              const goal = goals.find(g => (g._id || g.id) === showContributeModal);
              if (!goal) return null;
              
              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{goal.emoji}</div>
                    <h4 className="font-semibold text-lg">{goal.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Current: ₹{(Number(goal.currentAmount)||0).toLocaleString()} / ₹{(Number(goal.targetAmount)||0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="dark:text-gray-300">Amount to Add (₹)</Label>
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        className="pl-10 text-xl h-14 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleContribute(goal._id || goal.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    >
                      Add to Goal
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowContributeModal(null)}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 dark:text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Create Savings Goal</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)} className="dark:text-gray-400">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Goal Name</Label>
                <Input 
                  placeholder="e.g., New Laptop" 
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">Target Amount (₹)</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">Select Emoji</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {['🎧', '💻', '📱', '🏖️', '🎮', '📚', '✈️', '🏠', '🚗', '⌚', '👟', '🎸'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewEmoji(emoji)}
                      className={`text-3xl p-2 rounded-lg transition-colors ${
                        newEmoji === emoji 
                          ? "bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleCreateGoal}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                Create Goal
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}