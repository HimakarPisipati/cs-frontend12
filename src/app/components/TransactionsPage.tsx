import { getCurrencySymbol } from "../../utils/currency";
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
  Pencil,
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  Upload,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ReceiptText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CategoryIcon } from "./CategoryIcon";
import { CustomModal } from "./ui/CustomModal";

import { categories, getCategoryIcon, getCategoryColor, getCategories } from "../data/mockData";

// ✅ Import backend services (Ensure deleteTransaction is exported from here)
import { addTransaction, getTransactions, getBudgets, deleteTransaction, updateTransaction, scanReceipt, categorizeExpense } from "../../api/services";
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

interface TransactionsPageProps {
  userMode?: string;
}

export function TransactionsPage({ userMode = 'student' }: TransactionsPageProps) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role === 'admin';
    } catch { return false; }
  });
  const activeCategories = getCategories(userMode);
  const isEmployee = userMode === 'employee';
  const gradient = isAdmin ? 'from-slate-700 to-slate-900' : (isEmployee ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600');
  const gradientHover = isAdmin ? 'hover:from-slate-800 hover:to-slate-950' : (isEmployee ? 'hover:from-blue-700 hover:to-cyan-700' : 'hover:from-purple-700 hover:to-blue-700');
  const paymentSelected = isAdmin ? 'border-slate-500 bg-slate-50 dark:bg-slate-900/30' : (isEmployee ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-purple-500 bg-purple-50 dark:bg-purple-900/30');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<BackendTransaction | null>(null);
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Backend data
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{name: string, email: string, _id: string} | null>(null);
  const [globalBudget, setGlobalBudget] = useState(0);

  // ✅ Modal State
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    type: "success" | "error" | "warning" | "info" | "question";
    onConfirm?: () => void;
    showConfirm?: boolean;
    confirmText?: string;
  }>({
    title: "",
    description: "",
    type: "info",
    showConfirm: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showAlert = (title: string, description: string, type: any = "success") => {
    setModalConfig({ title, description, type, showConfirm: false });
    setIsModalOpen(true);
  };

  const showConfirmation = (title: string, description: string, onConfirm: () => void, type: any = "warning") => {
    setModalConfig({ title, description, type, onConfirm, showConfirm: true, confirmText: "Delete" });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData(storedUser);
    
    // Fetch Global Budget
    const fetchBudget = async () => {
      try {
        const res = await getBudgets();
        const budgets = res.data || [];
        const global = budgets.find((b: any) => b.category === 'General' || b.category === 'Global' || b.category === 'Others');
        if (global) setGlobalBudget(Number(global.amount));
      } catch (err) {
        console.error("Failed to fetch budget for PDF", err);
      }
    };
    fetchBudget();
  }, []);

  // ==============================
  // 📷 RECEIPT SCANNER STATE
  // ==============================
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [lastCategorizedDesc, setLastCategorizedDesc] = useState("");
  const [scanError, setScanError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleScanFile = (file: File) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setScanError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setScanError("Image too large. Maximum size is 5 MB.");
      return;
    }
    setScanFile(file);
    setScanError("");
    const reader = new FileReader();
    reader.onload = (e) => setScanPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleScanFile(file);
  };

  const handleScanReceipt = async () => {
    if (!scanFile) return;

    // ✅ CHECK FOR DEMO MODE
    const isDemo = localStorage.getItem("isDemo") === "true";

    if (isDemo) {
      setScanState("scanning");
      setScanError("");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show the specific warning requested by the user
      showAlert(
        "Demo Mode Active",
        "You can't use this feature in the demo mode. Create an account to use this feature. It will show demo receipt details here.",
        "warning"
      );

      // Set demo results
      setScanResult({
        amount: 459,
        merchant: "Starbucks Coffee",
        date: new Date().toISOString().split("T")[0],
        category: "Food",
        confidence: 98,
        items: [
          { name: "Caramel Macchiato", price: 320 },
          { name: "Chocolate Muffin", price: 139 }
        ],
        paymentMethod: "card"
      });
      setScanState("done");
      return;
    }

    setScanState("scanning");
    setScanError("");
    try {
      const formData = new FormData();
      formData.append("receipt", scanFile);
      const res = await scanReceipt(formData);
      const data = res.data?.data || res.data;
      setScanResult(data);
      setScanState("done");
    } catch (err: any) {
      console.error("Scan error:", err);
      setScanError(err?.response?.data?.message || "Failed to scan receipt. Please try again.");
      setScanState("error");
    }
  };

  const handleUseScanResult = () => {
    if (!scanResult) return;
    // Pre-fill the transaction form
    if (scanResult.amount) setAmount(String(scanResult.amount));
    if (scanResult.category) setCategory(scanResult.category);
    if (scanResult.merchant) setDescription(scanResult.merchant);
    if (scanResult.paymentMethod) {
      const pmMap: Record<string, "Cash" | "UPI" | "Card"> = { cash: "Cash", upi: "UPI", card: "Card" };
      setPaymentMethod(pmMap[scanResult.paymentMethod] || "UPI");
    }
    if (scanResult.date) setDate(scanResult.date);
    setTransactionType("expense");
    // Close scanner, open add modal
    resetScanModal();
    setShowAddModal(true);
  };

  const resetScanModal = () => {
    setShowScanModal(false);
    setScanFile(null);
    setScanPreview(null);
    setScanState("idle");
    setScanResult(null);
    setScanError("");
    setIsDragging(false);
  };

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
      // ✅ Safety check: ensure we always have an array
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.log(err);
      showAlert("Error", err?.response?.data?.message || "Failed to load transactions ❌", "error");
      setTransactions([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ✅ New Delete Handler
  const handleDeleteTransaction = (id: string) => {
    showConfirmation(
      "Are you sure?",
      "This action will permanently delete this transaction from your history. This cannot be undone.",
      async () => {
        try {
          // Optimistically remove from UI first for speed
          setTransactions((prev) => prev.filter((t) => t._id !== id));
          // Call backend
          await deleteTransaction(id);
        } catch (err: any) {
          console.log(err);
          showAlert("Error", err?.response?.data?.message || "Failed to delete transaction ❌", "error");
          // Revert if failed
          loadTransactions();
        }
      },
      "error"
    );
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
        (t.category || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [transactions, filterType, selectedCategory, searchQuery]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const pm =
        paymentMethod === "Cash" ? "cash" : paymentMethod === "UPI" ? "upi" : "card";

      console.log("DEBUG: raw amount input:", amount);
      const numericAmount = Number(amount);
      console.log("DEBUG: numericAmount:", numericAmount);

      const payload = {
        type: transactionType,
        amount: numericAmount,
        category,
        note: description,
        paymentMethod: pm,
        date: new Date(date).toISOString(),
      };
      console.log("DEBUG: final payload:", payload);

      if (editingTransaction) {
        // UPDATE existing transaction
        await updateTransaction(editingTransaction._id, payload);
        showAlert("Updated!", "Transaction has been updated successfully ✅", "success");
      } else {
        // ADD new transaction
        await addTransaction(payload);
        showAlert("Added!", "New transaction has been added successfully ✅", "success");
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
      showAlert("Error", err?.response?.data?.message || "Failed to save transaction ❌", "error");
    }
  };

  // ✅ Smart Categorization Logic
  useEffect(() => {
    // Only categorize if it's a new transaction (not editing) and description is long enough
    if (editingTransaction || !showAddModal || description.length < 3 || description === lastCategorizedDesc) return;

    const timer = setTimeout(async () => {
      try {
        setIsCategorizing(true);
        const res = await categorizeExpense(description, isEmployee ? "employee" : "student");
        if (res.success && res.category) {
          setCategory(res.category);
          setLastCategorizedDesc(description);
        }
      } catch (err) {
        console.error("Auto-categorization failed:", err);
      } finally {
        setIsCategorizing(false);
      }
    }, 1200); // 1.2s debounce

    return () => clearTimeout(timer);
  }, [description, showAddModal, editingTransaction, isEmployee]);

  // PDF Export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const now = new Date();
      const primaryColor = isEmployee ? [23, 37, 84] : [102, 51, 153]; // Dark Blue for Employee, Purple for Student
      const accentColor = isEmployee ? [8, 145, 178] : [128, 90, 213]; // Cyan for Employee, Light Purple for Student
      const secondaryColor = isEmployee ? [240, 247, 255] : [245, 240, 255];

      // --- Header Branding ---
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(isEmployee ? "CampusSpend Pro" : "CampusSpend", 14, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(isEmployee ? "Professional Financial Management" : "Student Expense Management", 14, 32);

      doc.setFontSize(14);
      doc.text("FINANCIAL STATEMENT", 200, 25, { align: "right" });
      doc.setFontSize(10);
      doc.text(`${now.toLocaleDateString("en-IN")} | ${now.toLocaleTimeString("en-IN")}`, 200, 32, { align: "right" });

      // --- Summary Section ---
      const totalIncome = filteredTransactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
      const totalExpense = filteredTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(16);
      doc.text("Executive Summary", 14, 55);
      
      // Draw summary boxes (Rearranged to 3 boxes for cleaner look)
      const boxWidth = 58;
      const spacing = 4;
      
      // Box 1: Total Budget
      doc.setFillColor(232, 255, 232); // Pale Green bg
      doc.rect(14, 60, boxWidth, 25, 'F');
      doc.setTextColor(0, 100, 0); // Dark Green text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("TOTAL BUDGET", 18, 68);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${globalBudget.toLocaleString()}`, 18, 78);

      // Box 2: Total Expenses
      doc.setFillColor(255, 242, 242); // Pale Red bg
      doc.rect(14 + (boxWidth + spacing), 60, boxWidth, 25, 'F');
      doc.setTextColor(150, 0, 0); // Dark Red text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("TOTAL EXPENSES", 14 + (boxWidth + spacing) + 4, 68);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${totalExpense.toLocaleString()}`, 14 + (boxWidth + spacing) + 4, 78);

      // Box 3: Budget Remaining
      const remaining = globalBudget - totalExpense;
      
      doc.setFillColor(235, 245, 255); // Pale Blue bg
      doc.rect(14 + 2 * (boxWidth + spacing), 60, boxWidth, 25, 'F');
      doc.setTextColor(85, 45, 145); // Purple text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("BUDGET LEFT", 14 + 2 * (boxWidth + spacing) + 4, 68);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${globalBudget > 0 ? remaining.toLocaleString() : 'N/A'}`, 14 + 2 * (boxWidth + spacing) + 4, 78);

      // --- User & Filter Details ---
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ACCOUNT HOLDER DETAILS", 14, 100);
      
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${userData?.name || 'N/A'}`, 14, 107);
      doc.text(`Email: ${userData?.email || 'N/A'}`, 14, 113);
      doc.text(`User ID: ${userData?._id || 'N/A'}`, 14, 119);
      doc.text(`Account Type: ${isEmployee ? "Pro Professional" : "Standard Student"}`, 14, 125);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("REPORT SCOPE", 110, 100);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      doc.text(`Type: ${filterType === "all" ? "All Transactions" : filterType === "expense" ? "Expenses Only" : "Income Only"}`, 110, 107);
      doc.text(`Category: ${selectedCategory === "all" ? "All Categories" : selectedCategory}`, 110, 113);
      doc.text(`Period: Up to ${now.toLocaleDateString("en-IN")}`, 110, 119);
      doc.text(`Status: Certified Final`, 110, 125);

      // --- Table Section ---
      const tableData = filteredTransactions.map((t) => [
        new Date(t.date).toLocaleDateString("en-IN"),
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        t.category,
        t.note || "-",
        (t.paymentMethod || "cash").toUpperCase(),
        `Rs. ${Number(t.amount).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 135,
        head: [["Date", "Type", "Category", "Note", "Payment", "Amount"]],
        body: tableData,
        theme: "striped",
        headStyles: { 
          fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]], 
          textColor: 255, 
          fontStyle: "bold", 
          fontSize: 10,
        },
        columnStyles: {
          3: { halign: "left" },   // Note
          5: { halign: "right", fontStyle: "bold" } // Amount
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        styles: { 
          fontSize: 9, 
          cellPadding: 4,
          overflow: 'linebreak',
          halign: "center" // Global alignment (Head + Body)
        },
        margin: { left: 14, right: 14 },
      });

      // --- Verification Stamp ---
      const lastTable = (doc as any).lastAutoTable;
      const finalY = lastTable ? lastTable.finalY : 200;
      const stampY = Math.min(finalY + 20, 260);
      
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(14, stampY, 80, 15);
      
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`DIGITALLY VERIFIED ${isEmployee ? "PRO " : ""}STATEMENT`, 18, stampY + 6);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.text(`This statement is generated digitally by ${isEmployee ? "CampusSpend Pro" : "CampusSpend"}`, 18, stampY + 10);
      doc.text("and does not require a physical signature.", 18, stampY + 13);

      // --- Footer ---
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.2);
        doc.line(14, 282, 196, 282);

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `${isEmployee ? "CampusSpend Pro" : "CampusSpend"} Finance Report | Page ${i} of ${pageCount} | Generated for ${userData?.name || 'User'}`,
          105,
          288,
          { align: "center" }
        );
      }

      doc.save(`CampusSpend_Report_${now.toISOString().split("T")[0]}.pdf`);
    } catch (error: any) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className={filterType === "all" ? `bg-gradient-to-r ${gradient}` : ""}
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
            onClick={() => setShowScanModal(true)}
            variant="outline"
            className="border-amber-400 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/20"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Receipt
          </Button>
          <Button
            id="tutorial-transactions-add"
            onClick={() => setShowAddModal(true)}
            className={`bg-gradient-to-r ${gradient} ${gradientHover}`}
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
              {activeCategories.map((cat) => (
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
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
                className="flex items-center justify-between p-4 rounded-xl transition-all border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${getCategoryColor(
                      transaction.category
                    )} rounded-xl flex items-center justify-center shrink-0 shadow-inner`}
                  >
                    <CategoryIcon name={getCategoryIcon(transaction.category)} className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {transaction.note || "No description"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>{transaction.category || "General"}</span>
                      <span>•</span>
                      <span>
                        {transaction.date && !isNaN(new Date(transaction.date).getTime())
                          ? new Date(transaction.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Unknown Date"}
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
                      {transaction.type === "expense" ? "-" : "+"}{getCurrencySymbol()}
                      {Number(transaction.amount || 0).toLocaleString()}
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
              </motion.div>
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
                    className={`p-4 rounded-xl border-2 transition-all group ${transactionType === "expense"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <ArrowDownRight className={`w-8 h-8 mx-auto mb-2 transition-transform group-hover:scale-110 ${transactionType === "expense" ? "text-red-500" : "text-gray-400"}`} />
                    <div className="font-semibold">Expense</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType("income")}
                    className={`p-4 rounded-xl border-2 transition-all group ${transactionType === "income"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <ArrowUpRight className={`w-8 h-8 mx-auto mb-2 transition-transform group-hover:scale-110 ${transactionType === "income" ? "text-green-500" : "text-gray-400"}`} />
                    <div className="font-semibold">Income</div>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount ({getCurrencySymbol()})</Label>
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

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  {isCategorizing && (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-purple-600 dark:text-purple-400 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      AI Categorizing...
                    </div>
                  )}
                </div>
                <div className="relative mt-2">
                  <Input
                    id="description"
                    type="text"
                    placeholder="e.g., Lunch at canteen"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`pr-10 transition-all ${isCategorizing ? "border-purple-400 ring-1 ring-purple-400/20" : ""}`}
                    required
                  />
                  {description.length >= 3 && !isCategorizing && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Sparkles className="w-4 h-4 text-purple-400 opacity-50" />
                    </div>
                  )}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <Label className="mb-3 block">Category</Label>
                <div className="grid grid-cols-4 gap-3">
                  {activeCategories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${category === cat.name
                        ? paymentSelected
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                    >
                      <div className="mb-2">
                        <CategoryIcon name={cat.icon} className={category === cat.name ? "text-white" : "text-gray-500"} size={28} />
                      </div>
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
                      ? paymentSelected
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
                      ? paymentSelected
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
                      ? paymentSelected
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Card</div>
                  </button>
                </div>
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

      {/* ==============================
          📷 RECEIPT SCANNER MODAL
          ============================== */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="w-full max-w-lg bg-white dark:bg-gray-800 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative overflow-hidden p-6 pb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-500/10 to-red-500/10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Receipt Scanner</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Google Gemini Vision</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetScanModal}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 pt-2 space-y-4">
                {/* === IDLE STATE: Upload zone === */}
                {scanState === "idle" && !scanPreview && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                      ${isDragging
                        ? "border-amber-400 bg-amber-50/50 dark:bg-amber-900/20 scale-[1.02]"
                        : "border-gray-300 dark:border-gray-600 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-900/10"
                      }`}
                    onClick={() => document.getElementById("receipt-upload")?.click()}
                  >
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleScanFile(e.target.files[0]); }}
                    />
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {isDragging ? "Drop your receipt here" : "Upload Receipt Image"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drag & drop or click to browse • JPEG, PNG, WebP • Max 5 MB
                    </p>
                  </div>
                )}

                {/* === IDLE STATE: Image preview (ready to scan) === */}
                {scanState === "idle" && scanPreview && (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img src={scanPreview} alt="Receipt preview" className="w-full max-h-64 object-contain bg-gray-50 dark:bg-gray-900" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                        onClick={() => { setScanFile(null); setScanPreview(null); }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleScanReceipt}
                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25"
                    >
                      <ScanLine className="w-5 h-5 mr-2" />
                      Scan with AI
                    </Button>
                  </div>
                )}

                {/* === SCANNING STATE: Animated progress === */}
                {scanState === "scanning" && (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-amber-300 dark:border-amber-600">
                      <img src={scanPreview!} alt="Scanning..." className="w-full max-h-64 object-contain bg-gray-50 dark:bg-gray-900 opacity-70" />
                      {/* Animated scan line */}
                      <motion.div
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
                    </div>
                    <div className="flex items-center justify-center gap-3 py-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Analyzing receipt with AI...</p>
                    </div>
                  </div>
                )}

                {/* === DONE STATE: Results === */}
                {scanState === "done" && scanResult && (
                  <div className="space-y-4">
                    {/* Confidence bar */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Extraction Complete</span>
                      <div className="flex-1" />
                      <Badge variant="secondary" className={
                        scanResult.confidence >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        scanResult.confidence >= 50 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }>
                        {scanResult.confidence}% confidence
                      </Badge>
                    </div>

                    {/* ✅ DEMO NOTICE */}
                    {localStorage.getItem("isDemo") === "true" && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 animate-pulse">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <p className="text-[10px] leading-tight font-semibold text-amber-700 dark:text-amber-300">
                          This is demo receipt details, you can't use the actual feature in the demo mode
                        </p>
                      </div>
                    )}

                    {/* Extracted data card */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{scanResult.amount?.toLocaleString() || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{scanResult.date || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Merchant</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{scanResult.merchant || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                          <Badge variant="outline">{scanResult.category || "Other"}</Badge>
                        </div>
                      </div>

                      {/* Line items */}
                      {scanResult.items?.length > 0 && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                            <ReceiptText className="w-3 h-3" /> Items Found
                          </p>
                          <div className="space-y-1">
                            {scanResult.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">₹{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleUseScanResult}
                        className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/25"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Use This Data
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setScanState("idle"); setScanFile(null); setScanPreview(null); setScanResult(null); }}
                        className="h-12"
                      >
                        Rescan
                      </Button>
                    </div>
                  </div>
                )}

                {/* === ERROR STATE === */}
                {scanState === "error" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">{scanError}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => { setScanState("idle"); setScanError(""); }}
                      className="w-full h-10"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Inline upload error */}
                {scanError && scanState === "idle" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">{scanError}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* ✅ Premium Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        showConfirm={modalConfig.showConfirm}
        confirmText={modalConfig.confirmText}
      />
    </div>
  );
}