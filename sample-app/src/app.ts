import express from "express";
import { findOrders, findInvoices } from "./data";
import { cache } from "./cache";

export const app = express();

app.use((req, res, next) => {
  const tenantId = req.header("x-tenant-id");
  const userId = req.header("x-user-id");
  if (!tenantId || !userId) return res.status(401).json({ error: "missing tenant or user" });
  res.locals.tenantId = tenantId;
  res.locals.userId = userId;
  next();
});

app.get("/orders", async (_req, res) => {
  const { tenantId, userId } = res.locals;
  const key = `orders:${userId}`;
  const hit = cache.get(key);
  if (hit) return res.json(hit);
  const rows = await findOrders(tenantId, userId);
  cache.set(key, rows);
  res.json(rows);
});

app.get("/invoices", async (_req, res) => {
  const { tenantId, userId } = res.locals;
  res.json(await findInvoices(tenantId, userId));
});
