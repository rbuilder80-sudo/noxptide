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
type HubSpotPipeline = {
  id: string;
  label: string;
  stages: Array<{ id: string; label: string }>;
};

const ORDER_PIPELINE_LABEL = "Noxptide Online Orders";
const statusStage: Record<OrderStatus, string> = {
  pending: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  dispatched: "Dispatched",
  completed: "Completed",
  cancelled: "Cancelled",
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

async function getOrderPipeline(status: OrderStatus) {
  const response = await hubSpotRequest<{ results: HubSpotPipeline[] }>(
    "/crm/pipelines/2026-03/order",
  );
  const pipeline = response.results.find((candidate) => candidate.label === ORDER_PIPELINE_LABEL);
  if (!pipeline) throw new Error(`HubSpot order pipeline not found: ${ORDER_PIPELINE_LABEL}`);

  const stageLabel = statusStage[status];
  const stage = pipeline.stages.find((candidate) => candidate.label === stageLabel);
  if (!stage) throw new Error(`HubSpot order stage not found: ${stageLabel}`);
  return { pipelineId: pipeline.id, stageId: stage.id, stageLabel };
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

async function findOrder(orderNumber: string) {
  const found = await hubSpotRequest<HubSpotSearch>("/crm/objects/2026-03/order/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: "hs_order_name", operator: "EQ", value: orderNumber }] },
      ],
      properties: ["hs_order_name"],
      limit: 1,
    }),
  });
  return found.results[0];
}

function orderProperties(
  order: EcommerceOrder,
  pipeline: { pipelineId: string; stageId: string; stageLabel: string },
) {
  return compact({
    hs_order_name: order.orderNumber,
    hs_currency_code: "GBP",
    hs_source_store: "noxptide.co.uk",
    hs_fulfillment_status: pipeline.stageLabel,
    hs_shipping_address_street: [order.addressLine1, order.addressLine2].filter(Boolean).join(", "),
    hs_shipping_address_city: order.city,
    hs_shipping_address_postal_code: order.postcode,
    hs_pipeline: pipeline.pipelineId,
    hs_pipeline_stage: pipeline.stageId,
  });
}

async function upsertOrder(
  order: EcommerceOrder,
  contactId: string,
  pipeline: { pipelineId: string; stageId: string; stageLabel: string },
) {
  const existing = await findOrder(order.orderNumber);
  const properties = orderProperties(order, pipeline);
  if (existing) {
    return hubSpotRequest<HubSpotRecord>(`/crm/objects/2026-03/order/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }

  return hubSpotRequest<HubSpotRecord>("/crm/objects/2026-03/order", {
    method: "POST",
    body: JSON.stringify({
      properties,
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 507 }],
        },
      ],
    }),
  });
}

function itemSku(orderNumber: string, item: EcommerceOrderItem) {
  return `${orderNumber}:${item.productSlug}:${item.sizeLabel}`;
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

  const pipeline = await getOrderPipeline(order.status);
  const contact = await upsertContact(order);
  const hubSpotOrder = await upsertOrder(order, contact.id, pipeline);

  for (const item of items) {
    const lineItem = await upsertLineItem(order.orderNumber, item);
    await hubSpotRequest<void>(
      `/crm/objects/2026-03/order/${hubSpotOrder.id}/associations/line_item/${lineItem.id}/513`,
      { method: "PUT" },
    );
  }

  return {
    status: "synced" as const,
    contactId: contact.id,
    orderId: hubSpotOrder.id,
  };
}
