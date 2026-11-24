import { describe, expect, it } from "vitest";
import { buildMailto, contactSchema } from "@/lib/contact";

describe("contact form", () => {
  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ name: "A", email: "nope", message: "hi" }).success).toBe(false);
  });
  it("rejects an empty message", () => {
    expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: "   " }).success).toBe(false);
  });
  it("rejects messages over 1000 characters", () => {
    expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: "x".repeat(1001) }).success).toBe(false);
  });
  it("encodes the message into the mail link", () => {
    const url = buildMailto("k@x.com", { name: "Ravi & Co", email: "r@x.com", message: "Hello there" });
    expect(url.startsWith("mailto:k@x.com?subject=")).toBe(true);
    expect(url).toContain(encodeURIComponent("Ravi & Co"));
  });
});
