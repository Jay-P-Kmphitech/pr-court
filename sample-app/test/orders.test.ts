import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

const as = (tenant: string, user: string) => ({ "x-tenant-id": tenant, "x-user-id": user });

describe("GET /orders", () => {
  it("rejects requests without tenant/user", async () => {
    await request(app).get("/orders").expect(401);
  });

  it("returns only the caller's orders", async () => {
    const res = await request(app).get("/orders").set(as("acme", "u1")).expect(200);
    expect(res.body.map((o: { id: string }) => o.id)).toEqual(["o-1"]);
  });

  it("separates users within a tenant", async () => {
    const res = await request(app).get("/orders").set(as("acme", "u2")).expect(200);
    expect(res.body.map((o: { id: string }) => o.id)).toEqual(["o-2"]);
  });
});
