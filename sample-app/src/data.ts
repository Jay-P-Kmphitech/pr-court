export type Row = { id: string; tenantId: string; userId: string; item: string; total: number };

// User ids are only unique within a tenant: acme/u1 and globex/u1 are different people.
const orders: Row[] = [
  { id: "o-1", tenantId: "acme", userId: "u1", item: "Laptop", total: 1200 },
  { id: "o-2", tenantId: "acme", userId: "u2", item: "Mouse", total: 25 },
  { id: "o-3", tenantId: "globex", userId: "u1", item: "Server rack", total: 8000 },
];

const invoices: Row[] = [
  { id: "i-1", tenantId: "acme", userId: "u1", item: "INV Laptop", total: 1200 },
  { id: "i-2", tenantId: "globex", userId: "u1", item: "INV Server rack", total: 8000 },
];

// Simulates a slow database round-trip.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function findOrders(tenantId: string, userId: string) {
  await sleep(50);
  return orders.filter((o) => o.tenantId === tenantId && o.userId === userId);
}

export async function findInvoices(tenantId: string, userId: string) {
  await sleep(50);
  return invoices.filter((i) => i.tenantId === tenantId && i.userId === userId);
}
