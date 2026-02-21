import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  X,
  Plus,
  Download,
  Search,
  CreditCard,
  Wallet as WalletIcon,
  Smartphone,
  Trash2,
  Pencil
} from "lucide-react";

import { categories, getCategoryIcon, getCategoryColor } from "../data/mockData";

// ✅ Import backend services (Ensure deleteTransaction is exported from here)
import { addTransaction, getTransactions, deleteTransaction, updateTransaction } from "../../api/services";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type BackendTransaction = {
  _id: string;
  userId: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  note?: string;
  paymentMethod?: "cash" | "upi" | "card";
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export function TransactionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<BackendTransaction | null>(null);
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Backend data
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Add transaction form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI" | "Card">("UPI");
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to load transactions ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ✅ New Delete Handler
  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      // Optimistically remove from UI first for speed
      setTransactions((prev) => prev.filter((t) => t._id !== id));

      // Call backend
      await deleteTransaction(id);

    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to delete transaction ❌");
      // Revert if failed
      loadTransactions();
    }
  };

  // Edit handler — pre-fills form and opens modal
  const handleEditTransaction = (t: BackendTransaction) => {
    setEditingTransaction(t);
    setAmount(String(t.amount));
    setCategory(t.category);
    setDescription(t.note || "");
    setTransactionType(t.type);
    setPaymentMethod(
      t.paymentMethod === "cash" ? "Cash" : t.paymentMethod === "upi" ? "UPI" : "Card"
    );
    setDate(t.date ? new Date(t.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setShowAddModal(true);
  };

  // Convert backend paymentMethod -> UI label
  const paymentLabel = (m?: "cash" | "upi" | "card") => {
    if (!m) return "UPI";
    if (m === "cash") return "Cash";
    if (m === "upi") return "UPI";
    return "Card";
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchesSearch =
        (t.note || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [transactions, filterType, selectedCategory, searchQuery]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const pm =
        paymentMethod === "Cash" ? "cash" : paymentMethod === "UPI" ? "upi" : "card";

      const payload = {
        type: transactionType,
        amount: Number(amount),
        category,
        note: description,
        paymentMethod: pm,
        date: new Date(date).toISOString(),
      };

      if (editingTransaction) {
        // UPDATE existing transaction
        await updateTransaction(editingTransaction._id, payload);
        alert("Transaction updated ✅");
      } else {
        // ADD new transaction
        await addTransaction(payload);
        alert("Transaction added ✅");
      }

      setShowAddModal(false);
      setEditingTransaction(null);

      // Reset form
      setAmount("");
      setDescription("");
      setCategory("Food");
      setPaymentMethod("UPI");
      setTransactionType("expense");
      setDate(new Date().toISOString().split("T")[0]);

      // Reload from backend
      await loadTransactions();
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to save transaction ❌");
    }
  };

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(102, 51, 153);
    doc.text("CampusSpend", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Expense Report", 14, 28);
    doc.setFontSize(10);
    doc.text(`Generated: ${now.toLocaleDateString("en-IN")} at ${now.toLocaleTimeString("en-IN")}`, 14, 35);

    // Summary
    const totalIncome = filteredTransactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = filteredTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Filter: ${filterType === "all" ? "All Transactions" : filterType === "expense" ? "Expenses Only" : "Income Only"}`, 14, 45);
    doc.text(`Total Income: \u20B9${totalIncome.toLocaleString()}`, 14, 52);
    doc.text(`Total Expenses: \u20B9${totalExpense.toLocaleString()}`, 14, 58);
    doc.text(`Net: \u20B9${(totalIncome - totalExpense).toLocaleString()}`, 14, 64);
    doc.text(`Transactions: ${filteredTransactions.length}`, 14, 70);

    // Table
    const tableData = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      t.category,
      t.note || "-",
      (t.paymentMethod || "cash").toUpperCase(),
      `\u20B9${Number(t.amount).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 78,
      head: [["Date", "Type", "Category", "Note", "Payment", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [102, 51, 153], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 240, 255] },
      styles: { fontSize: 9 },
    });

    doc.save(`CampusSpend_Report_${now.toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className={filterType === "all" ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
          >
            All
          </Button>
          <Button
            variant={filterType === "expense" ? "default" : "outline"}
            onClick={() => setFilterType("expense")}
            className={filterType === "expense" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Expenses
          </Button>
          <Button
            variant={filterType === "income" ? "default" : "outline"}
            onClick={() => setFilterType("income")}
            className={filterType === "income" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Income
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label>Search</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full mt-2 h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${getCategoryColor(
                      transaction.category
                    )} rounded-xl flex items-center justify-center text-2xl shrink-0`}
                  >
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {transaction.note || "No description"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>
                        {new Date(transaction.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Badge variant="outline" className="ml-1">
                        {paymentLabel(transaction.paymentMethod)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* ✅ Updated Right Side: Amount + Delete Button */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className={`text-lg font-semibold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"
                        }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}₹
                      {transaction.amount.toLocaleString()}
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        transaction.type === "expense"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteTransaction(transaction._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => { setShowAddModal(false); setEditingTransaction(null); }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-6">
              {/* Transaction Type Toggle */}
              <div>
                <Label className="mb-3 block">Transaction Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTransactionType("expense")}
                    className={`p-4 rounded-xl border-2 transition-all ${transactionType === "expense"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <div className="text-2xl mb-2">💸</div>
                    <div className="font-semibold">Expense</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType("income")}
                    className={`p-4 rounded-xl border-2 transition-all ${transactionType === "income"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-semibold">Income</div>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl h-14 mt-2"
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <Label className="mb-3 block">Category</Label>
                <div className="grid grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${category === cat.name
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="text-xs font-medium">{cat.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label className="mb-3 block">Payment Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "Cash"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <WalletIcon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Cash</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "UPI"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">UPI</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Card")}
                    className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "Card"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Card</div>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="e.g., Lunch at canteen"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className={`flex-1 h-12 ${transactionType === "expense"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                  Save {editingTransaction ? "Changes" : (transactionType === "expense" ? "Expense" : "Income")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowAddModal(false); setEditingTransaction(null); }}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}