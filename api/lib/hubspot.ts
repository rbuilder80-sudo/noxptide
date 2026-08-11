type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "dispatched"
  | "completed"
  | "cancelled";

export type EcommerceOrder = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postcode: string;
  country: string;
  status: OrderStatus;
  totalPence: number;
  notes?: string | null;
};

export type EcommerceOrderItem = {
  productSlug: string;
  productName: string;
  sizeLabel: string;
  unitPricePence: number;
  qty: number;
};

type HubSpotRecord = { id: string; properties?: Record<string, string> };
type HubSpotSearch = { results: HubSpotRecord[] };
type HubSpotReadinessObject = "contacts" | "deals" | "line_items" | "products";

const DEAL_PIPELINE_ID = process.env.HUBSPOT_DEAL_PIPELINE_ID?.trim() || "default";
const statusDealStage: Record<OrderStatus, string> = {
  pending: process.env.HUBSPOT_STAGE_PENDING?.trim() || "appointmentscheduled",
  paid: process.env.HUBSPOT_STAGE_PAID?.trim() || "closedwon",
  processing: process.env.HUBSPOT_STAGE_PROCESSING?.trim() || "closedwon",
  dispatched: process.env.HUBSPOT_STAGE_DISPATCHED?.trim() || "closedwon",
  completed: process.env.HUBSPOT_STAGE_COMPLETED?.trim() || "closedwon",
  cancelled: process.env.HUBSPOT_STAGE_CANCELLED?.trim() || "closedlost",
};

function hubSpotToken() {
  return process.env.HUBSPOT_ACCESS_TOKEN?.trim() ?? "";
}

async function hubSpotRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = hubSpotToken();
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not configured");

  const response = await fetch(`https://api.hubapi.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 800);
    throw new Error(`HubSpot ${response.status} ${path}: ${detail}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function verifyReadableObject(objectType: HubSpotReadinessObject) {
  await hubSpotRequest<HubSpotSearch>(`/crm/v3/objects/${objectType}/search`, {
    method: "POST",
    body: JSON.stringify({ properties: [], limit: 1 }),
  });
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstname: parts.shift() ?? fullName,
    lastname: parts.join(" "),
  };
}

function organisation(notes?: string | null) {
  const value = notes?.match(/(?:^|\n)Organisation:\s*(.+)/i)?.[1]?.trim();
  return value || undefined;
}

function compact(properties: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

async function upsertContact(order: EcommerceOrder) {
  const found = await hubSpotRequest<HubSpotSearch>("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: order.email }] }],
      properties: ["email"],
      limit: 1,
    }),
  });
  const properties = compact({
    email: order.email,
    ...splitName(order.customerName),
    phone: order.phone ?? undefined,
    company: organisation(order.notes),
    address: order.addressLine1,
    address2: order.addressLine2 ?? undefined,
    city: order.city,
    zip: order.postcode,
    country: order.country,
  });

  if (found.results[0]) {
    return hubSpotRequest<HubSpotRecord>(`/crm/v3/objects/contacts/${found.results[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }
  return hubSpotRequest<HubSpotRecord>("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

async function findDeal(orderNumber: string) {
  const found = await hubSpotRequest<HubSpotSearch>("/crm/v3/objects/deals/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: "dealname", operator: "EQ", value: `Noxptide order ${orderNumber}` }] },
      ],
      properties: ["dealname"],
      limit: 1,
    }),
  });
  return found.results[0];
}

function dealProperties(order: EcommerceOrder) {
  return compact({
    dealname: `Noxptide order ${order.orderNumber}`,
    amount: (order.totalPence / 100).toFixed(2),
    pipeline: DEAL_PIPELINE_ID,
    dealstage: statusDealStage[order.status],
    closedate: ["paid", "processing", "dispatched", "completed"].includes(order.status)
      ? new Date().toISOString()
      : undefined,
    description: [
      `Order: ${order.orderNumber}`,
      `Store: noxptide.co.uk`,
      `Status: ${order.status}`,
      `Customer: ${order.customerName} <${order.email}>`,
      `Phone: ${order.phone ?? ""}`,
      `Shipping: ${[order.addressLine1, order.addressLine2, order.city, order.postcode, order.country]
        .filter(Boolean)
        .join(", ")}`,
      order.notes ?? "",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

async function upsertDeal(order: EcommerceOrder) {
  const existing = await findDeal(order.orderNumber);
  const properties = dealProperties(order);
  if (existing) {
    return hubSpotRequest<HubSpotRecord>(`/crm/v3/objects/deals/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }

  return hubSpotRequest<HubSpotRecord>("/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

function itemSku(orderNumber: string, item: EcommerceOrderItem) {
  return `${orderNumber}:${item.productSlug}:${item.sizeLabel}`;
}

function productSku(item: EcommerceOrderItem) {
  return `noxptide:${item.productSlug}:${item.sizeLabel}`;
}

function publicSiteUrl() {
  return (process.env.PUBLIC_SITE_URL?.trim() || "https://www.noxptide.co.uk").replace(/\/$/, "");
}

function productImageUrl(item: EcommerceOrderItem) {
  const size = item.sizeLabel.replace(/\s+/g, "").toLowerCase();
  return `${publicSiteUrl()}/images/products/${item.productSlug}-${size}.webp`;
}

async function upsertProduct(item: EcommerceOrderItem) {
  const sku = productSku(item);
  const found = await hubSpotRequest<HubSpotSearch>("/crm/v3/objects/products/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "hs_sku", operator: "EQ", value: sku }] }],
      properties: ["hs_sku"],
      limit: 1,
    }),
  });
  const properties = {
    name: `${item.productName} ${item.sizeLabel}`,
    hs_sku: sku,
    price: (item.unitPricePence / 100).toFixed(2),
    description: `${item.productName} ${item.sizeLabel} research peptide sold by Noxptide.`,
    hs_url: `${publicSiteUrl()}/product/${item.productSlug}`,
    hs_images: productImageUrl(item),
  };
  if (found.results[0]) {
    return hubSpotRequest<HubSpotRecord>(`/crm/v3/objects/products/${found.results[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }
  return hubSpotRequest<HubSpotRecord>("/crm/v3/objects/products", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

async function upsertLineItem(orderNumber: string, item: EcommerceOrderItem) {
  const sku = itemSku(orderNumber, item);
  const found = await hubSpotRequest<HubSpotSearch>("/crm/v3/objects/line_items/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "hs_sku", operator: "EQ", value: sku }] }],
      properties: ["hs_sku"],
      limit: 1,
    }),
  });
  const properties = {
    name: `${item.productName} ${item.sizeLabel}`,
    hs_sku: sku,
    quantity: String(item.qty),
    price: (item.unitPricePence / 100).toFixed(2),
  };
  if (found.results[0]) {
    return hubSpotRequest<HubSpotRecord>(`/crm/v3/objects/line_items/${found.results[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }
  return hubSpotRequest<HubSpotRecord>("/crm/v3/objects/line_items", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

export async function syncOrderToHubSpot(
  order: EcommerceOrder,
  items: EcommerceOrderItem[],
) {
  if (!hubSpotToken()) return { status: "disabled" as const };

  const contact = await upsertContact(order);
  const deal = await upsertDeal(order);
  await hubSpotRequest<void>(
    `/crm/v4/objects/deals/${deal.id}/associations/default/contacts/${contact.id}`,
    { method: "PUT" },
  );

  for (const item of items) {
    await upsertProduct(item);
    const lineItem = await upsertLineItem(order.orderNumber, item);
    await hubSpotRequest<void>(
      `/crm/v4/objects/deals/${deal.id}/associations/default/line_items/${lineItem.id}`,
      { method: "PUT" },
    );
  }

  return {
    status: "synced" as const,
    contactId: contact.id,
    dealId: deal.id,
  };
}

export async function checkHubSpotReadiness() {
  if (!hubSpotToken()) {
    return {
      ready: false,
      tokenConfigured: false,
      verified: false,
      checkedObjects: [] as HubSpotReadinessObject[],
      error: undefined as string | undefined,
    };
  }

  const requiredObjects: HubSpotReadinessObject[] = ["contacts", "deals", "line_items", "products"];
  const checkedObjects: HubSpotReadinessObject[] = [];

  try {
    for (const objectType of requiredObjects) {
      await verifyReadableObject(objectType);
      checkedObjects.push(objectType);
    }
    return {
      ready: true,
      tokenConfigured: true,
      verified: true,
      checkedObjects,
      error: undefined as string | undefined,
    };
  } catch (error) {
    return {
      ready: false,
      tokenConfigured: true,
      verified: false,
      checkedObjects,
      error: error instanceof Error ? error.message.slice(0, 240) : "HubSpot verification failed",
    };
  }
}
