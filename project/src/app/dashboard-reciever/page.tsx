"use client";

import { useEffect, useState } from "react";

export default function DashboardReciever() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", purpose: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch listed items
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const res = await fetch("/api/reciever");
        const data = await res.json();
        if (data.success) {
          setItems(data.items);
        } else {
          setError(data.error || "Failed to fetch items");
        }
      } catch (e) {
        setError("Error fetching items");
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  // Handle form input
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/reciever", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Request added!");
        setForm({ title: "", description: "", purpose: "" });
      } else {
        setError(data.error || "Failed to add request");
      }
    } catch (e) {
      setError("Error adding request");
    }
    setSubmitting(false);
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Listed Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <li key={item._id || idx}>
              <strong>{item.title || "Untitled"}</strong>
              {item.description && <div>{item.description}</div>}
              {item.purpose && (
                <div>
                  <em>{item.purpose}</em>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: 40 }}>Add a Request</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: 8,
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {submitting ? "Submitting..." : "Add Request"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </form>
    </div>
  );
}
