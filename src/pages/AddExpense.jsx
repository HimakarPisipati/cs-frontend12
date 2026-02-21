import { useState } from "react";
import { addTransaction } from "../api/services";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [note, setNote] = useState("");

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const res = await addTransaction({
        type: "expense",
        amount: Number(amount),
        category,
        note,
        paymentMethod
      });

      alert("Expense Added ✅");
      console.log(res.data);

      // reset form
      setAmount("");
      setCategory("Food");
      setPaymentMethod("upi");
      setNote("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to add expense ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Expense</h2>

      <form onSubmit={handleAddExpense}>
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br /><br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Rent</option>
          <option>Education</option>
          <option>Entertainment</option>
        </select>
        <br /><br />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">cash</option>
          <option value="upi">upi</option>
          <option value="card">card</option>
        </select>
        <br /><br />

        <input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <br /><br />

        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
}
