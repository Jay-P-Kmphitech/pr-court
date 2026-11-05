import express from "express";
import { findOrders, findInvoices } from "./data";
import { invoiceCache } from "./invoiceCache";

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
  res.json(await findOrders(tenantId, userId));
});

app.get("/invoices", async (_req, res) => {
  const { tenantId, userId } = res.locals;
  const key = `invoices:${tenantId}:${userId}`;
  const hit = invoiceCache.get(key);
  if (hit) return res.json(hit);
  const rows = await findInvoices(tenantId, userId);
  invoiceCache.set(key, rows);
  res.json(rows);
});
