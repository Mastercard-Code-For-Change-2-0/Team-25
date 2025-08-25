import { connectToDatabase } from "../src/lib/mongodb";

export async function fetchAllListedItems() {
  const { db } = await connectToDatabase();
  const items = await db.collection("listed_items").find({}).toArray();
  return items;
}

export async function addListedRequest({
  title,
  description,
  purpose,
}: {
  title: string;
  description: string;
  purpose: string;
}) {
  const { db } = await connectToDatabase();
  const result = await db
    .collection("listed_requests")
    .insertOne({ title, description, purpose, createdAt: new Date() });
  return result.insertedId;
}
