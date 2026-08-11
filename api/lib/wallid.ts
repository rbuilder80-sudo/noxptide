import { createHmac, timingSafeEqual } from "node:crypto";

const WALLID_API_URL = "https://payment-api.wallid.co/api/payment-gw/v1";

export type WallidPaymentStatus = "NEW" | "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

export type WallidItem = {
  name: string;
  category: string;
  price_minor: number;
  image_url: string;
  product_url: string;
};

export type CreateWallidPaymentInput = {
  order_id: string;
  amount: number;
  currency: "GBP";
  success_url: string;
  fail_url: string;
  items: WallidItem[];
  description?: string;
  customer_email?: string;
  customer_id?: string;
  metadata?: Record<string, string>;
  locale?: string;
  country?: string;
};

export type WallidPayment = {
  api_payment_id: string;
  order_id: string;
  status: WallidPaymentStatus;
  statusAt?: string;
  statusError?: string;
  payment_link?: string;
  amount: number;
  currency: string;
  expires_at?: string;
  created_at?: string;
};

export type WallidWebhookEvent = {
  event_id: string;
  api_payment_id: string;
  order_id: string;
  status: WallidPaymentStatus;
  status_error?: string;
  amount: number;
  currency: string;
  occurred_at: string;
};

function credentials() {
  const keyId = process.env.WALLID_API_KEY_ID;
  const secret = process.env.WALLID_API_KEY_SECRET;
  if (!keyId || !secret) {
    throw new Error("Wallid Pay-by-Bank is not configured");
  }
  return { keyId, secret };
}

async function wallidRequest<T>(path: string, init: RequestInit): Promise<T> {
  const { keyId, secret } = credentials();
  const response = await fetch(`${WALLID_API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const message = (await response.text()).trim();
    throw new Error(`Wallid request failed (${response.status})${message ? `: ${message}` : ""}`);
  }
  return (await response.json()) as T;
}

export function createWallidPayment(input: CreateWallidPaymentInput) {
  return wallidRequest<WallidPayment>("/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getWallidPaymentStatus(apiPaymentId: string) {
  return wallidRequest<WallidPayment>(
    `/status?apiPaymentId=${encodeURIComponent(apiPaymentId)}`,
    { method: "GET" },
  );
}

export function verifyWallidWebhook(
  rawBody: string,
  timestampHeader: string | undefined,
  signatureHeader: string | undefined,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  const secret = process.env.WALLID_WEBHOOK_SECRET;
  if (!secret || !timestampHeader || !signatureHeader) return false;

  const timestamp = Number.parseInt(timestampHeader, 10);
  if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > 300) return false;

  const expected = `sha256=${createHmac("sha256", secret)
    .update(`${timestampHeader}.${rawBody}`)
    .digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(signatureHeader);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export function parseWallidWebhook(rawBody: string): WallidWebhookEvent[] {
  const parsed = JSON.parse(rawBody) as unknown;
  const events = Array.isArray(parsed)
    ? parsed
    : typeof parsed === "object" && parsed !== null && "events" in parsed
      ? (parsed as { events: unknown }).events
      : null;
  if (!Array.isArray(events)) throw new Error("Invalid Wallid webhook body");
  return events as WallidWebhookEvent[];
}
