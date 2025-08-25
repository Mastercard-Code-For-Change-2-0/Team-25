import mongoose from "mongoose";
import ListedItem, {
  IListedItem,
} from "../src/lib/schemas/listed_items.mongoose";
import {
  ListedRequest,
  IListedRequest,
} from "../src/lib/schemas/listed_items.mongoose";
import Transaction, {
  ITransaction,
} from "../src/lib/schemas/transaction.mongoose";

export async function matchRequestToListings(
  requestId: mongoose.Types.ObjectId
) {
  const request = await ListedRequest.findById(requestId);
  if (!request || request.status === "completed")
    throw new Error("Request not found or already completed");

  let needed = request.quantity;
  const listings = await ListedItem.find({
    category: request.category,
    status: "active",
    available: { $gt: 0 },
  }).sort({ createdAt: 1 });

  const usedListings: { id: mongoose.Types.ObjectId; used: number }[] = [];
  for (const listing of listings) {
    if (needed <= 0) break;
    const useQty = Math.min(listing.available, needed);
    usedListings.push({ id: listing._id, used: useQty });
    needed -= useQty;
  }

  if (needed > 0)
    throw new Error("Not enough items available to fulfill request");

  for (const { id, used } of usedListings) {
    await ListedItem.findByIdAndUpdate(id, {
      $inc: { available: -used, claimed: used },
    });
  }
  await ListedRequest.findByIdAndUpdate(requestId, {
    $inc: { quantity: -request.quantity },
    status: "pending",
  });

  const transaction = await Transaction.create({
    requestId,
    listingIds: usedListings.map((l) => l.id),
    quantity: request.quantity,
    category: request.category,
    status: "pending",
  });

  await ListedRequest.findByIdAndUpdate(requestId, {
    $push: { transactions: transaction._id },
  });
  for (const { id } of usedListings) {
    await ListedItem.findByIdAndUpdate(id, {
      $push: { transactions: transaction._id },
    });
  }
  return transaction;
}

export async function approveTransaction(
  transactionId: mongoose.Types.ObjectId,
  adminId: mongoose.Types.ObjectId
) {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.status !== "pending")
    throw new Error("Transaction not found or not pending");

  transaction.status = "approved";
  transaction.adminId = adminId;
  transaction.completionTime = new Date();
  await transaction.save();

  for (const listingId of transaction.listingIds) {
    const listing = await ListedItem.findById(listingId);
    if (listing && listing.available === 0) {
      listing.status = "completed";
      await listing.save();
    }
  }
  const request = await ListedRequest.findById(transaction.requestId);
  if (request && request.quantity === 0) {
    request.status = "completed";
    await request.save();
  }
  return transaction;
}

export async function declineTransaction(
  transactionId: mongoose.Types.ObjectId,
  adminId: mongoose.Types.ObjectId
) {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.status !== "pending")
    throw new Error("Transaction not found or not pending");

  const request = await ListedRequest.findById(transaction.requestId);
  if (request) {
    request.quantity += transaction.quantity;
    request.status = "active";
    await request.save();
  }
  for (const listingId of transaction.listingIds) {
    const listing = await ListedItem.findById(listingId);
    if (listing) {
      listing.available += transaction.quantity;
      listing.claimed -= transaction.quantity;
      listing.status = "active";
      await listing.save();
    }
  }

  transaction.status = "declined";
  transaction.adminId = adminId;
  await transaction.save();
  return transaction;
}
