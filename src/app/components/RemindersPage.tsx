import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  CalendarDays, Plus, Trash2, Pencil, X, ChevronLeft, ChevronRight,
  RepeatIcon, BellRing, CheckCircle2, Clock, IndianRupee,
} from "lucide-react";
import { getReminders, addReminder, updateReminder, deleteReminder, addTransaction } from "../../api/services";

// ─── Types ──────────────────────────────────────────────────────────────────────
type Reminder = {
  _id: string;
  title: string;
  amount: number;
  description: string;
  reminderDate: string;
  isRecurring: boolean;
  isPaid: boolean;
  createdAt: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function datesEqual(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date() && !datesEqual(new Date(dateStr), new Date());
}

// ─── Component ──────────────────────────────────────────────────────────────────
export function RemindersPage({ userMode = 'student' }: { userMode?: string }) {
  const isEmployee = userMode === 'employee';

  // Theme — mirrors Dashboard pattern
  const theme = isEmployee
    ? {
        gradient: 'from-blue-500 to-cyan-500',
        gradientBtn: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
        statCard: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        dotUpcoming: 'bg-blue-500',
        dotLabel: 'text-blue-500',
        recurringBadge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        amountColor: 'text-blue-600 dark:text-blue-400',
        calSelected: 'from-blue-500 to-cyan-500',
        calToday: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
        legendDot: 'bg-blue-500',
        legendLabel: 'text-blue-500',
        filterText: 'text-blue-600 dark:text-blue-400',
        modalIcon: 'from-blue-500 to-cyan-500',
        modalBtn: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
        toggleActive: 'bg-blue-500',
        toggleBorder: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
        toggleText: 'text-blue-700 dark:text-blue-300',
        recurringIcon: 'text-blue-600',
        pageIcon: 'from-blue-500 to-cyan-500',
      }
    : {
        gradient: 'from-purple-500 to-blue-500',
        gradientBtn: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
        statCard: 'from-purple-500 to-blue-500',
        iconBg: 'bg-gradient-to-br from-purple-500 to-blue-500',
        dotUpcoming: 'bg-purple-500',
        dotLabel: 'text-purple-500',
        recurringBadge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        amountColor: 'text-purple-600 dark:text-purple-400',
        calSelected: 'from-purple-500 to-blue-500',
        calToday: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
        legendDot: 'bg-purple-500',
        legendLabel: 'text-purple-500',
        filterText: 'text-purple-600 dark:text-purple-400',
        modalIcon: 'from-purple-500 to-blue-500',
        modalBtn: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
        toggleActive: 'bg-purple-500',
        toggleBorder: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
        toggleText: 'text-purple-700 dark:text-purple-300',
        recurringIcon: 'text-purple-600',
        pageIcon: 'from-purple-500 to-blue-500',
      };

  const today = new Date();

  // Calendar state
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Data
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState(today.toISOString().split("T")[0]);
  const [formRecurring, setFormRecurring] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────────
  const loadReminders = async () => {
    try {
      setLoading(true);
      const res = await getReminders();
      setReminders(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("Failed to load reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReminders(); }, []);

  // ── Derived ───────────────────────────────────────────────────────────────────
  // Dates that have reminders — for calendar dots
  const reminderDates = useMemo(() => {
    const map: Record<string, "upcoming" | "overdue" | "paid"> = {};
    reminders.forEach((r) => {
      const d = new Date(r.reminderDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (r.isPaid) map[key] = "paid";
      else if (isOverdue(r.reminderDate)) map[key] = "overdue";
      else map[key] = "upcoming";
    });
    return map;
  }, [reminders]);

  // Reminders for selected date (or all upcoming if none selected)
  const displayedReminders = useMemo(() => {
    if (selectedDate) {
      return reminders.filter((r) => datesEqual(new Date(r.reminderDate), selectedDate));
    }
    return reminders.filter((r) => !r.isPaid).sort(
      (a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
    );
  }, [reminders, selectedDate]);

  const unpaidCount = reminders.filter((r) => !r.isPaid).length;
  const overdueCount = reminders.filter((r) => !r.isPaid && isOverdue(r.reminderDate)).length;

  // ── Calendar grid ─────────────────────────────────────────────────────────────
  const calDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [calYear, calMonth]);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  }

  function getDotColor(day: number) {
    const key = `${calYear}-${calMonth}-${day}`;
    const status = reminderDates[key];
    if (status === "overdue") return "bg-red-500";
    if (status === "upcoming") return theme.dotUpcoming;
    if (status === "paid") return "bg-green-500";
    return "";
  }

  // ── Form helpers ──────────────────────────────────────────────────────────────
  function openAddModal(date?: Date) {
    setEditingReminder(null);
    setFormTitle("");
    setFormAmount("");
    setFormDesc("");
    setFormDate(date ? date.toISOString().split("T")[0] : today.toISOString().split("T")[0]);
    setFormRecurring(false);
    setShowModal(true);
  }

  function openEditModal(r: Reminder) {
    setEditingReminder(r);
    setFormTitle(r.title);
    setFormAmount(String(r.amount));
    setFormDesc(r.description || "");
    setFormDate(new Date(r.reminderDate).toISOString().split("T")[0]);
    setFormRecurring(r.isRecurring);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingReminder(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle || !formAmount || !formDate) return;
    setSubmitting(true);
    try {
      const payload = {
        title: formTitle,
        amount: Number(formAmount),
        description: formDesc,
        reminderDate: new Date(formDate).toISOString(),
        isRecurring: formRecurring,
      };
      if (editingReminder) {
        await updateReminder(editingReminder._id, payload);
      } else {
        await addReminder(payload);
      }
      closeModal();
      await loadReminders();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save reminder ❌");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkPaid(r: Reminder) {
    if (!window.confirm(`Mark "${r.title}" as paid?\nThis will also record ₹${r.amount} as an expense transaction.`)) return;
    try {
      // Mark reminder as paid
      await updateReminder(r._id, { isPaid: true });
      // Auto-create a transaction for this expense
      await addTransaction({
        type: "expense",
        amount: r.amount,
        category: "Bills",
        note: r.title + (r.description ? ` — ${r.description}` : ""),
        paymentMethod: "cash",
        date: new Date().toISOString(),
      });
      await loadReminders();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to mark as paid ❌");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      setReminders((prev) => prev.filter((r) => r._id !== id));
      await deleteReminder(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete ❌");
      loadReminders();
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${theme.iconBg} rounded-xl flex items-center justify-center`}>
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reminders</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unpaidCount} upcoming · {overdueCount > 0 && <span className="text-red-500 font-semibold">{overdueCount} overdue</span>}
            </p>
          </div>
        </div>
        <Button
          onClick={() => openAddModal(selectedDate || undefined)}
          className={`${theme.gradientBtn} text-white shadow-lg`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className={`p-4 bg-gradient-to-br ${theme.statCard} border-0 text-white shadow-lg`}>
          <div className="flex items-center gap-2 mb-1">
            <BellRing className="w-4 h-4 opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Upcoming</p>
          </div>
          <p className="text-3xl font-bold">{reminders.filter(r => !r.isPaid && !isOverdue(r.reminderDate)).length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-orange-500 border-0 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Overdue</p>
          </div>
          <p className="text-3xl font-bold">{overdueCount}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500 to-teal-500 border-0 text-white shadow-lg col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Paid</p>
          </div>
          <p className="text-3xl font-bold">{reminders.filter(r => r.isPaid).length}</p>
        </Card>
      </div>

      {/* ── Main grid: Calendar + Cards ───────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Calendar */}
        <Card className="p-5 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {MONTHS[calMonth]} {calYear}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {calDays.map((day, idx) => {
              if (day === null) return <div key={`null-${idx}`} />;
              const thisDate = new Date(calYear, calMonth, day);
              const isToday = datesEqual(thisDate, today);
              const isSelected = selectedDate && datesEqual(thisDate, selectedDate);
              const dotColor = getDotColor(day);

              return (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDate(isSelected ? null : thisDate)
                  }
                  className={`relative flex flex-col items-center justify-center h-10 w-full rounded-xl text-sm font-medium transition-all
                    ${isSelected
                      ? `bg-gradient-to-br ${theme.calSelected} text-white shadow-md scale-105`
                      : isToday
                      ? `${theme.calToday} font-bold`
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  {day}
                  {dotColor && (
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor} absolute bottom-1`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className={`w-2 h-2 rounded-full ${theme.legendDot} inline-block`} /> Upcoming
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Overdue
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Paid
            </span>
          </div>

          {selectedDate && (
            <div className="mt-3 flex items-center justify-between">
              <p className={`text-sm ${theme.filterText} font-medium`}>
                Showing: {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              </p>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Clear filter
              </button>
            </div>
          )}
        </Card>

        {/* Reminder cards */}
        <div className="space-y-3">
          {loading ? (
            <Card className="p-8 bg-white/80 dark:bg-gray-800 border-0 shadow-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading reminders...</p>
            </Card>
          ) : displayedReminders.length === 0 ? (
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg text-center">
              <CalendarDays className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {selectedDate ? "No reminders on this day" : "No upcoming reminders"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {selectedDate
                  ? "Click the date on the calendar to deselect, or add one below."
                  : "Click '+ Add Reminder' to get started."}
              </p>
            </Card>
          ) : (
            displayedReminders.map((r) => {
              const overdue = !r.isPaid && isOverdue(r.reminderDate);
              return (
                <Card
                  key={r._id}
                  className={`p-4 bg-white/80 dark:bg-gray-800 border-0 shadow-lg transition-all
                    ${r.isPaid ? "opacity-60" : ""}
                    ${overdue ? "ring-2 ring-red-400 dark:ring-red-600" : ""}
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className={`font-semibold text-gray-900 dark:text-white text-base ${r.isPaid ? "line-through text-gray-400" : ""}`}>
                          {r.title}
                        </p>
                        {r.isRecurring && (
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${theme.recurringBadge} font-semibold`}>
                            <RepeatIcon className="w-3 h-3" /> Monthly
                          </span>
                        )}
                        {overdue && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold">
                            Overdue
                          </span>
                        )}
                        {r.isPaid && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold">
                            Paid
                          </span>
                        )}
                      </div>

                      {/* Amount */}
                      <p className={`text-2xl font-bold ${overdue ? "text-red-500" : r.isPaid ? "text-gray-400" : theme.amountColor}`}>
                        ₹{Number(r.amount).toLocaleString()}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(r.reminderDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                        {r.description && <span>· {r.description}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {!r.isPaid && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkPaid(r)}
                          className="h-8 px-3 text-xs bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* ── Add/Edit Modal ────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 bg-gradient-to-br ${theme.modalIcon} rounded-xl flex items-center justify-center`}>
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingReminder ? "Edit Reminder" : "New Reminder"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label className="dark:text-gray-300 text-sm font-semibold">Reminder Title *</Label>
                <Input
                  placeholder="e.g. Electricity Bill, Rent, Netflix"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <Label className="dark:text-gray-300 text-sm font-semibold">
                  <IndianRupee className="w-3.5 h-3.5 inline mr-1" />Amount *
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  min={1}
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:text-white text-lg"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label className="dark:text-gray-300 text-sm font-semibold">
                  Description <span className="font-normal text-gray-400">(optional)</span>
                </Label>
                <Input
                  placeholder="e.g. Monthly rent for hostel room"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Date */}
              <div>
                <Label className="dark:text-gray-300 text-sm font-semibold">
                  <CalendarDays className="w-3.5 h-3.5 inline mr-1" />Reminder Date *
                </Label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Recurring toggle */}
              <div
                onClick={() => setFormRecurring(!formRecurring)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${formRecurring
                    ? theme.toggleBorder
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <RepeatIcon className={`w-5 h-5 ${formRecurring ? theme.recurringIcon : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-semibold ${formRecurring ? theme.toggleText : 'text-gray-700 dark:text-gray-300'}`}>
                      Repeat Monthly
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Auto-renew reminder every month on this date
                    </p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors relative ${formRecurring ? theme.toggleActive : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${formRecurring ? "left-5" : "left-0.5"}`} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 h-11 ${theme.modalBtn} text-white`}
                >
                  {submitting ? "Saving..." : editingReminder ? "Save Changes" : "Create Reminder"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="h-11 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
