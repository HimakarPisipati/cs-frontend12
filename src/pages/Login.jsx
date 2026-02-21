import { useState } from "react";
import { login } from "../api/services";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password });

      // ✅ Save token in browser
      localStorage.setItem("token", res.data.token);

      alert("Login successful ✅");
      console.log("Logged user:", res.data.user);

      // ✅ Redirect after login (optional)
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
