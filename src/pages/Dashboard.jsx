import { useEffect, useState } from "react";
import { getTransactions } from "../api/services";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to load transactions ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div>
          {transactions.map((t) => (
            <div
              key={t._id}
              style={{
                border: "1px solid #ccc",
                marginBottom: 10,
                padding: 10,
                borderRadius: 8
              }}
            >
              <b>{t.category}</b> — ₹{t.amount} ({t.type})
              <br />
              <small>{new Date(t.date).toLocaleString()}</small>
              <br />
              <small>Payment: {t.paymentMethod}</small>
              {t.note && (
                <>
                  <br />
                  <small>Note: {t.note}</small>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
