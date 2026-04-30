import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
    X, Plus, Trash2, Pencil, Briefcase, TrendingUp, TrendingDown, DollarSign
} from "lucide-react";
import { getSalaries, addSalary, updateSalary, deleteSalary } from "../../api/services";

type SalaryEntry = {
    _id: string;
    user: string;
    month: string;
    grossSalary: number;
    pf: number;
    tax: number;
    insurance: number;
    otherDeductions: number;
    netSalary: number;
    createdAt: string;
};

export function SalaryPage() {
    const [salaries, setSalaries] = useState<SalaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<SalaryEntry | null>(null);

    // Form state
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [grossSalary, setGrossSalary] = useState("");
    const [pf, setPf] = useState("");
    const [tax, setTax] = useState("");
    const [insurance, setInsurance] = useState("");
    const [otherDeductions, setOtherDeductions] = useState("");

    const loadSalaries = async () => {
        try {
            setLoading(true);
            const res = await getSalaries();
            setSalaries(Array.isArray(res.data) ? res.data : []);
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || "Failed to load salary entries ❌");
            setSalaries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSalaries();
    }, []);

    const resetForm = () => {
        const now = new Date();
        setMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
        setGrossSalary("");
        setPf("");
        setTax("");
        setInsurance("");
        setOtherDeductions("");
        setEditingEntry(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                month,
                grossSalary: Number(grossSalary),
                pf: Number(pf) || 0,
                tax: Number(tax) || 0,
                insurance: Number(insurance) || 0,
                otherDeductions: Number(otherDeductions) || 0,
            };

            if (editingEntry) {
                await updateSalary(editingEntry._id, payload);
                alert("Salary entry updated ✅");
            } else {
                await addSalary(payload);
                alert("Salary entry added ✅");
            }

            setShowModal(false);
            resetForm();
            await loadSalaries();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to save salary entry ❌");
        }
    };

    const handleEdit = (entry: SalaryEntry) => {
        setEditingEntry(entry);
        setMonth(entry.month);
        setGrossSalary(String(entry.grossSalary));
        setPf(String(entry.pf));
        setTax(String(entry.tax));
        setInsurance(String(entry.insurance));
        setOtherDeductions(String(entry.otherDeductions));
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this salary entry?")) return;
        try {
            setSalaries((prev) => prev.filter((s) => s._id !== id));
            await deleteSalary(id);
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to delete ❌");
            loadSalaries();
        }
    };

    // Summary calculations
    const latestEntry = salaries.length > 0 ? salaries[0] : null;
    const totalDeductions = latestEntry
        ? latestEntry.pf + latestEntry.tax + latestEntry.insurance + latestEntry.otherDeductions
        : 0;

    const formatMonth = (m: string) => {
        const [year, mon] = m.split("-");
        const date = new Date(Number(year), Number(mon) - 1);
        return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                        Salary Tracker
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your monthly salary and deductions</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Salary Entry
                </Button>
            </div>

            {/* Summary Cards */}
            {latestEntry && (
                <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-5 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-xl">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-blue-100 text-sm">Gross Salary</p>
                                <h3 className="text-2xl font-bold mt-1">₹{latestEntry.grossSalary.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-blue-100">{formatMonth(latestEntry.month)}</p>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-red-500 to-orange-500 text-white border-0 shadow-xl">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-red-100 text-sm">Total Deductions</p>
                                <h3 className="text-2xl font-bold mt-1">₹{totalDeductions.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-red-100">PF + Tax + Insurance + Other</p>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-green-100 text-sm">Net Salary</p>
                                <h3 className="text-2xl font-bold mt-1">₹{latestEntry.netSalary.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-green-100">Take home pay</p>
                    </Card>
                </div>
            )}

            {/* Salary Entries List */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Entries</h3>
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Loading salary entries...</p>
                    ) : salaries.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-blue-500" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">No salary entries yet</p>
                            <p className="text-sm text-gray-500 mt-1">Add your first salary entry to get started</p>
                        </div>
                    ) : (
                        salaries.map((entry) => (
                            <div
                                key={entry._id}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                        {entry.month.split("-")[1]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{formatMonth(entry.month)}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">PF: ₹{entry.pf.toLocaleString()}</Badge>
                                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">Tax: ₹{entry.tax.toLocaleString()}</Badge>
                                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">Ins: ₹{entry.insurance.toLocaleString()}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{entry.netSalary.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">of ₹{entry.grossSalary.toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600" onClick={() => handleEdit(entry)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600" onClick={() => handleDelete(entry._id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingEntry ? "Edit Salary Entry" : "Add Salary Entry"}
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => { setShowModal(false); resetForm(); }}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <Label htmlFor="month" className="dark:text-gray-300">Month</Label>
                                <Input
                                    id="month"
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="grossSalary" className="dark:text-gray-300">Gross Salary (₹)</Label>
                                <Input
                                    id="grossSalary"
                                    type="number"
                                    placeholder="50000"
                                    value={grossSalary}
                                    onChange={(e) => setGrossSalary(e.target.value)}
                                    className="mt-2 text-lg h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="pf" className="dark:text-gray-300">Provident Fund (₹)</Label>
                                    <Input id="pf" type="number" placeholder="0" value={pf} onChange={(e) => setPf(e.target.value)} className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="tax" className="dark:text-gray-300">Income Tax / TDS (₹)</Label>
                                    <Input id="tax" type="number" placeholder="0" value={tax} onChange={(e) => setTax(e.target.value)} className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="insurance" className="dark:text-gray-300">Insurance (₹)</Label>
                                    <Input id="insurance" type="number" placeholder="0" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="otherDeductions" className="dark:text-gray-300">Other Deductions (₹)</Label>
                                    <Input id="otherDeductions" type="number" placeholder="0" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                </div>
                            </div>

                            {/* Net Salary Preview */}
                            {grossSalary && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Net Salary</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        ₹{(Number(grossSalary) - (Number(pf) || 0) - (Number(tax) || 0) - (Number(insurance) || 0) - (Number(otherDeductions) || 0)).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                                    {editingEntry ? "Save Changes" : "Add Entry"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm(); }} className="h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600">
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
