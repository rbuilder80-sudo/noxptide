import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createWallidPayment,
  parseWallidWebhook,
  verifyWallidWebhook,
} from "./wallid";

afterEach(() => {
  delete process.env.WALLID_API_KEY_ID;
  delete process.env.WALLID_API_KEY_SECRET;
  delete process.env.WALLID_WEBHOOK_SECRET;
  vi.unstubAllGlobals();
});

describe("Wallid Pay-by-Bank", () => {
  it("creates a hosted payment using server-side Basic authentication", async () => {
    process.env.WALLID_API_KEY_ID = "key-id";
    process.env.WALLID_API_KEY_SECRET = "key-secret";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          api_payment_id: "pay-123",
          order_id: "NOX-123",
          status: "NEW",
          payment_link: "https://pay.wallid.io/example",
          amount: 4999,
          currency: "GBP",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await createWallidPayment({
      order_id: "NOX-123",
      amount: 4999,
      currency: "GBP",
      success_url: "https://www.noxptide.co.uk/checkout?payment=success",
      fail_url: "https://www.noxptide.co.uk/checkout?payment=failed",
      items: [
        {
          name: "BPC-157 5 mg × 1",
          category: "Research Peptides",
          price_minor: 4999,
          image_url: "https://www.noxptide.co.uk/images/products/bpc-157-5mg.webp",
          product_url: "https://www.noxptide.co.uk/product/bpc-157",
        },
      ],
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://payment-api.wallid.co/api/payment-gw/v1/create");
    expect(new Headers(init.headers).get("Authorization")).toBe(
      `Basic ${Buffer.from("key-id:key-secret").toString("base64")}`,
    );
    expect(JSON.parse(String(init.body))).toMatchObject({ amount: 4999, currency: "GBP" });
  });

  it("accepts only a current, correctly signed webhook", () => {
    process.env.WALLID_WEBHOOK_SECRET = "webhook-secret";
    const rawBody = JSON.stringify({ events: [{ event_id: "evt-1", status: "SUCCESS" }] });
    const timestamp = "1723300000";
    const signature = `sha256=${createHmac("sha256", "webhook-secret")
      .update(`${timestamp}.${rawBody}`)
      .digest("hex")}`;

    expect(verifyWallidWebhook(rawBody, timestamp, signature, 1723300000)).toBe(true);
    expect(verifyWallidWebhook(`${rawBody} `, timestamp, signature, 1723300000)).toBe(false);
    expect(verifyWallidWebhook(rawBody, timestamp, signature, 1723300301)).toBe(false);
  });

  it("parses both documented webhook envelope shapes", () => {
    const event = {
      event_id: "evt-1",
      api_payment_id: "pay-123",
      order_id: "NOX-123",
      status: "SUCCESS" as const,
      amount: 4999,
      currency: "GBP",
      occurred_at: "2026-08-10T12:00:00Z",
    };
    expect(parseWallidWebhook(JSON.stringify({ events: [event] }))).toEqual([event]);
    expect(parseWallidWebhook(JSON.stringify([event]))).toEqual([event]);
  });
});
