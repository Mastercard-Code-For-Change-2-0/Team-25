"use client";
import { useState } from "react";

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    available: 1,
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/listed-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) setMessage("Listing created!");
    else setMessage(data.error || "Error");
  }

  return (
    <div>
      <h2>Create Listing</h2>
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
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          required
        />
        <input
          name="available"
          type="number"
          min={1}
          value={form.available}
          onChange={(e) =>
            setForm((f) => ({ ...f, available: Number(e.target.value) }))
          }
          required
        />
        <button type="submit">Create</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}
