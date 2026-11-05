import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

const as = (tenant: string, user: string) => ({ "x-tenant-id": tenant, "x-user-id": user });

describe("GET /invoices", () => {
  it("returns only the caller's invoices", async () => {
    const res = await request(app).get("/invoices").set(as("acme", "u1")).expect(200);
    expect(res.body.map((i: { id: string }) => i.id)).toEqual(["i-1"]);
  });

  it("keeps tenants apart for the same user id", async () => {
    await request(app).get("/invoices").set(as("acme", "u1"));
    const res = await request(app).get("/invoices").set(as("globex", "u1")).expect(200);
    expect(res.body.map((i: { id: string }) => i.id)).toEqual(["i-2"]);
  });
});
