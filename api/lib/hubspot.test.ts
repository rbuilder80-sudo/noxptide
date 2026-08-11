import { afterEach, describe, expect, it, vi } from "vitest";
import { syncOrderToHubSpot, type EcommerceOrder, type EcommerceOrderItem } from "./hubspot";

const order: EcommerceOrder = {
  orderNumber: "NOX-TEST-1001",
  customerName: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+44 7700 900000",
  addressLine1: "1 Research Way",
  addressLine2: "Lab 2",
  city: "London",
  postcode: "SW1A 1AA",
  country: "United Kingdom",
  status: "paid",
  notes: "Organisation: Analytical Lab",
};

const items: EcommerceOrderItem[] = [
  {
    productSlug: "bpc-157",
    productName: "BPC-157",
    sizeLabel: "5mg",
    unitPricePence: 3499,
    qty: 2,
  },
];

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("syncOrderToHubSpot", () => {
  afterEach(() => {
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    vi.unstubAllGlobals();
  });

  it("is a no-op when the private app token is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(syncOrderToHubSpot(order, items)).resolves.toEqual({ status: "disabled" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("upserts the customer, order, and associated line items", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "private-token";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        json({
          results: [
            {
              id: "pipeline-1",
              label: "Noxptide Online Orders",
              stages: [
                { id: "stage-pending", label: "Pending payment" },
                { id: "stage-paid", label: "Paid" },
              ],
            },
          ],
        }),
      )
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "contact-1" }))
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "order-1" }))
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "line-1" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(syncOrderToHubSpot(order, items)).resolves.toEqual({
      status: "synced",
      contactId: "contact-1",
      orderId: "order-1",
    });
    expect(fetchMock).toHaveBeenCalledTimes(8);

    for (const [, init] of fetchMock.mock.calls as Array<[string, RequestInit]>) {
      expect(new Headers(init.headers).get("Authorization")).toBe("Bearer private-token");
    }

    const contactCreate = fetchMock.mock.calls[2] as [string, RequestInit];
    expect(contactCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/contacts");
    expect(JSON.parse(String(contactCreate[1].body)).properties).toMatchObject({
      email: "ada@example.com",
      firstname: "Ada",
      lastname: "Lovelace",
      company: "Analytical Lab",
      zip: "SW1A 1AA",
    });

    const orderCreate = fetchMock.mock.calls[4] as [string, RequestInit];
    const orderBody = JSON.parse(String(orderCreate[1].body));
    expect(orderCreate[0]).toBe("https://api.hubapi.com/crm/objects/2026-03/order");
    expect(orderBody.properties).toMatchObject({
      hs_order_name: "NOX-TEST-1001",
      hs_currency_code: "GBP",
      hs_source_store: "noxptide.co.uk",
      hs_pipeline: "pipeline-1",
      hs_pipeline_stage: "stage-paid",
    });
    expect(orderBody.associations[0].types[0].associationTypeId).toBe(507);

    const lineItemCreate = fetchMock.mock.calls[6] as [string, RequestInit];
    expect(JSON.parse(String(lineItemCreate[1].body)).properties).toEqual({
      name: "BPC-157 5mg",
      hs_sku: "NOX-TEST-1001:bpc-157:5mg",
      quantity: "2",
      price: "34.99",
    });
    expect(fetchMock.mock.calls[7][0]).toBe(
      "https://api.hubapi.com/crm/objects/2026-03/order/order-1/associations/line_item/line-1/513",
    );
  });
});
