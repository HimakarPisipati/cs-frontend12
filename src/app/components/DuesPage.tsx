import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Pencil, Check, Trash2, CreditCard, Wallet as WalletIcon, Smartphone } from "lucide-react";
import { getDues, addDue, updateDue, deleteDue } from "../../api/services";

type Due = {
    _id: string;
    type: "pending" | "debt";
    personName: string;
    description: string;
    amount: number;
    date: string;
    settled: boolean;
    paymentMethod?: string;
};

export function DuesPage() {
    const [dues, setDues] = useState<Due[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"pending" | "debt">("pending");
    const [showModal, setShowModal] = useState(false);
    const [editingDue, setEditingDue] = useState<Due | null>(null);

    // Form state
    const [personName, setPersonName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    const loadDues = async () => {
        try {
            setLoading(true);
            const res = await getDues();
            setDues(res.data);
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || "Failed to load dues ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDues();
    }, []);

    const filteredDues = useMemo(() => {
        return dues.filter((d) => d.type === activeTab && !d.settled);
    }, [dues, activeTab]);

    const totalAmount = useMemo(() => {
        return filteredDues.reduce((sum, d) => sum + Number(d.amount), 0);
    }, [filteredDues]);

    const settledDues = useMemo(() => {
        return dues.filter((d) => d.type === activeTab && d.settled);
    }, [dues, activeTab]);

    const resetForm = () => {
        setPersonName("");
        setDescription("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setPaymentMethod("");
        setEditingDue(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                type: activeTab,
                personName,
                description,
                amount: Number(amount),
                date: new Date(date).toISOString(),
                paymentMethod: paymentMethod || null,
            };

            if (editingDue) {
                await updateDue(editingDue._id, payload);
                alert("Updated ✅");
            } else {
                await addDue(payload);
                alert("Added ✅");
            }

            setShowModal(false);
            resetForm();
            await loadDues();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to save ❌");
        }
    };

    const handleEdit = (d: Due) => {
        setEditingDue(d);
        setPersonName(d.personName);
        setDescription(d.description || "");
        setAmount(String(d.amount));
        setDate(d.date ? new Date(d.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
        setPaymentMethod(d.paymentMethod || "");
        setShowModal(true);
    };

    const handleSettle = async (d: Due) => {
        if (!window.confirm(`Mark ₹${d.amount} from ${d.personName} as settled?`)) return;
        try {
            await updateDue(d._id, { settled: true });
            await loadDues();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to settle ❌");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            setDues((prev) => prev.filter((d) => d._id !== id));
            await deleteDue(id);
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to delete ❌");
            loadDues();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dues & Debts</h2>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-3">
                <Button
                    onClick={() => setActiveTab("pending")}
                    className={`rounded-full px-6 ${activeTab === "pending"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    Pending (Get)
                </Button>
                <Button
                    onClick={() => setActiveTab("debt")}
                    className={`rounded-full px-6 ${activeTab === "debt"
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    Debts (Pay)
                </Button>
            </div>

            {/* Summary Card */}
            <Card
                className={`p-6 border-0 shadow-lg text-white ${activeTab === "pending"
                    ? "bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500"
                    : "bg-gradient-to-r from-red-600 via-red-500 to-orange-500"
                    }`}
            >
                <p className="text-sm font-medium opacity-90 uppercase tracking-wider">
                    {activeTab === "pending" ? "Total to Receive" : "Total to Pay"}
                </p>
                <p className="text-4xl font-bold mt-2">₹{totalAmount.toLocaleString()}</p>
                <p className="text-sm opacity-75 mt-1">{filteredDues.length} active entries</p>
            </Card>

            {/* Add Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className={`${activeTab === "pending"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        }`}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {activeTab === "pending" ? "Pending" : "Debt"}
                </Button>
            </div>

            {/* Active Dues List */}
            <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                        </div>
                    ) : filteredDues.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No {activeTab === "pending" ? "pending" : "debt"} entries</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add one to get started</p>
                        </div>
                    ) : (
                        filteredDues.map((d) => (
                            <div
                                key={d._id}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{d.personName}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {d.description && <span>{d.description}</span>}
                                        {d.description && <span>•</span>}
                                        <span>
                                            {new Date(d.date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    {d.paymentMethod && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase font-medium">
                                            {d.paymentMethod}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 ml-4">
                                    <span className={`text-xl font-bold ${activeTab === "pending" ? "text-green-600" : "text-red-600"}`}>
                                        ₹{Number(d.amount).toLocaleString()}
                                    </span>

                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600" onClick={() => handleEdit(d)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>

                                    <button
                                        onClick={() => handleSettle(d)}
                                        className={`text-sm font-semibold px-3 py-1 rounded-lg transition-colors ${activeTab === "pending"
                                            ? "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                            : "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            }`}
                                    >
                                        Settle
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Settled Dues */}
            {settledDues.length > 0 && (
                <>
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mt-6">Settled</h3>
                    <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg opacity-70">
                        <div className="space-y-2">
                            {settledDues.map((d) => (
                                <div
                                    key={d._id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-400 line-through">{d.personName}</p>
                                            <p className="text-xs text-gray-400">{d.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 line-through">₹{Number(d.amount).toLocaleString()}</span>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600" onClick={() => handleDelete(d._id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 shadow-2xl relative">
                        <button
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
                            {editingDue ? "Edit" : "Add"} {activeTab === "pending" ? "Pending" : "Debt"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className="dark:text-gray-300">Person Name</Label>
                                <Input
                                    placeholder="e.g., Abhay"
                                    value={personName}
                                    onChange={(e) => setPersonName(e.target.value)}
                                    className="mt-1 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="dark:text-gray-300">Description</Label>
                                <Input
                                    placeholder="e.g., Canteen lunch"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <Label className="dark:text-gray-300">Amount (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 text-xl dark:bg-gray-700 dark:text-white"
                                    required
                                    min={1}
                                />
                            </div>
                            <div>
                                <Label className="dark:text-gray-300">Date</Label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Payment Method (Optional) */}
                            <div>
                                <Label className="dark:text-gray-300">Payment Method <span className="text-gray-400 font-normal">(optional)</span></Label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    {[
                                        { value: "cash", label: "Cash", icon: WalletIcon },
                                        { value: "upi", label: "UPI", icon: Smartphone },
                                        { value: "card", label: "Card", icon: CreditCard },
                                    ].map((pm) => {
                                        const Icon = pm.icon;
                                        const isSelected = paymentMethod === pm.value;
                                        return (
                                            <button
                                                key={pm.value}
                                                type="button"
                                                onClick={() => setPaymentMethod(isSelected ? "" : pm.value)}
                                                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-sm font-medium ${isSelected
                                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                        : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {pm.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    className={`flex-1 h-12 ${activeTab === "pending"
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                        : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                                        }`}
                                >
                                    {editingDue ? "Save Changes" : "Add Entry"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
