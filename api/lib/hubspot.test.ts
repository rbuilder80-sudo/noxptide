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
  totalPence: 6998,
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

  it("upserts the customer, deal, and associated line items", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "private-token";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "contact-1" }))
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "deal-1" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "product-1" }))
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "line-1" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(syncOrderToHubSpot(order, items)).resolves.toEqual({
      status: "synced",
      contactId: "contact-1",
      dealId: "deal-1",
    });
    expect(fetchMock).toHaveBeenCalledTimes(10);

    for (const [, init] of fetchMock.mock.calls as Array<[string, RequestInit]>) {
      expect(new Headers(init.headers).get("Authorization")).toBe("Bearer private-token");
    }

    const contactCreate = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(contactCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/contacts");
    expect(JSON.parse(String(contactCreate[1].body)).properties).toMatchObject({
      email: "ada@example.com",
      firstname: "Ada",
      lastname: "Lovelace",
      company: "Analytical Lab",
      zip: "SW1A 1AA",
    });

    const dealCreate = fetchMock.mock.calls[3] as [string, RequestInit];
    const dealBody = JSON.parse(String(dealCreate[1].body));
    expect(dealCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/deals");
    expect(dealBody.properties).toMatchObject({
      dealname: "Noxptide order NOX-TEST-1001",
      amount: "69.98",
      pipeline: "default",
      dealstage: "closedwon",
    });
    expect(fetchMock.mock.calls[4][0]).toBe(
      "https://api.hubapi.com/crm/v4/objects/deals/deal-1/associations/default/contacts/contact-1",
    );

    const productCreate = fetchMock.mock.calls[6] as [string, RequestInit];
    expect(productCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/products");
    expect(JSON.parse(String(productCreate[1].body)).properties).toMatchObject({
      name: "BPC-157 5mg",
      hs_sku: "noxptide:bpc-157:5mg",
      price: "34.99",
      hs_url: "https://www.noxptide.co.uk/product/bpc-157",
    });

    const lineItemCreate = fetchMock.mock.calls[8] as [string, RequestInit];
    expect(JSON.parse(String(lineItemCreate[1].body)).properties).toEqual({
      name: "BPC-157 5mg",
      hs_sku: "NOX-TEST-1001:bpc-157:5mg",
      quantity: "2",
      price: "34.99",
    });
    expect(fetchMock.mock.calls[9][0]).toBe(
      "https://api.hubapi.com/crm/v4/objects/deals/deal-1/associations/default/line_items/line-1",
    );
  });
});
