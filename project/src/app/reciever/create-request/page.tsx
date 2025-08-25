"use client";
import { useState } from "react";

export default function CreateRequest() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    purpose: "",
    category: "",
    quantity: 1,
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/listed-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) setMessage("Request created!");
    else setMessage(data.error || "Error");
  }

  return (
    <div>
      <h2>Create Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          required
        />
        <input
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          required
        />
        <input
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) =>
            setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
          }
          required
        />
        <button type="submit">Create</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}
