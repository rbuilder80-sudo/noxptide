import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkHubSpotReadiness,
  importHubSpotProductCatalog,
  syncProductCatalogToHubSpot,
  syncOrderToHubSpot,
  type EcommerceOrder,
  type EcommerceOrderItem,
} from "./hubspot";

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
      .mockResolvedValueOnce(json({ id: "company-1" }))
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "deal-1" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
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
      companyId: "company-1",
    });
    expect(fetchMock).toHaveBeenCalledTimes(14);

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

    const companyCreate = fetchMock.mock.calls[3] as [string, RequestInit];
    expect(companyCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/companies");
    expect(JSON.parse(String(companyCreate[1].body)).properties).toMatchObject({
      name: "Analytical Lab",
      city: "London",
      zip: "SW1A 1AA",
      country: "United Kingdom",
    });

    const dealCreate = fetchMock.mock.calls[5] as [string, RequestInit];
    const dealBody = JSON.parse(String(dealCreate[1].body));
    expect(dealCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/deals");
    expect(dealBody.properties).toMatchObject({
      dealname: "Noxptide order NOX-TEST-1001",
      amount: "69.98",
      pipeline: "default",
      dealstage: "closedwon",
    });
    expect(fetchMock.mock.calls[6][0]).toBe(
      "https://api.hubapi.com/crm/v4/objects/deals/deal-1/associations/default/contacts/contact-1",
    );
    expect(fetchMock.mock.calls[7][0]).toBe(
      "https://api.hubapi.com/crm/v4/objects/contacts/contact-1/associations/default/companies/company-1",
    );
    expect(fetchMock.mock.calls[8][0]).toBe(
      "https://api.hubapi.com/crm/v4/objects/deals/deal-1/associations/default/companies/company-1",
    );

    const productCreate = fetchMock.mock.calls[10] as [string, RequestInit];
    expect(productCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/products");
    expect(JSON.parse(String(productCreate[1].body)).properties).toMatchObject({
      name: "BPC-157 5mg",
      hs_sku: "noxptide:bpc-157:5mg",
      price: "34.99",
      hs_url: "https://www.noxptide.co.uk/product/bpc-157",
    });

    const lineItemCreate = fetchMock.mock.calls[12] as [string, RequestInit];
    expect(JSON.parse(String(lineItemCreate[1].body)).properties).toEqual({
      name: "BPC-157 5mg",
      hs_sku: "NOX-TEST-1001:bpc-157:5mg",
      quantity: "2",
      price: "34.99",
    });
    expect(fetchMock.mock.calls[13][0]).toBe(
      "https://api.hubapi.com/crm/v4/objects/deals/deal-1/associations/default/line_items/line-1",
    );
  });
});

describe("syncProductCatalogToHubSpot", () => {
  afterEach(() => {
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    vi.unstubAllGlobals();
  });

  it("does not write products when the private app token is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(syncProductCatalogToHubSpot(items)).resolves.toEqual({ status: "disabled", synced: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("upserts each catalogue product variant", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "private-token";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "product-1" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(syncProductCatalogToHubSpot(items)).resolves.toEqual({ status: "synced", synced: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const productCreate = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(productCreate[0]).toBe("https://api.hubapi.com/crm/v3/objects/products");
    const properties = JSON.parse(String(productCreate[1].body)).properties;
    expect(properties).toMatchObject({
      name: "BPC-157 5mg",
      hs_sku: "noxptide:bpc-157:5mg",
      price: "34.99",
      hs_url: "https://www.noxptide.co.uk/product/bpc-157",
    });
    expect(properties.description).toContain("Noxptide stock: 0");
    expect(properties.description).toContain("Noxptide status: active");
  });
});

describe("importHubSpotProductCatalog", () => {
  afterEach(() => {
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    vi.unstubAllGlobals();
  });

  it("does not read products when the private app token is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(importHubSpotProductCatalog()).resolves.toEqual({ status: "disabled", imported: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reads Noxptide product price, stock and status from HubSpot Products", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "private-token";
    const fetchMock = vi.fn().mockResolvedValueOnce(
      json({
        results: [
          {
            id: "product-1",
            properties: {
              hs_sku: "noxptide:bpc-157:5mg",
              price: "41.50",
              description: "Noxptide stock: 12\nNoxptide status: hidden",
            },
          },
          {
            id: "product-2",
            properties: {
              hs_sku: "other:sku",
              price: "1.00",
              description: "Ignore me",
            },
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(importHubSpotProductCatalog()).resolves.toEqual({
      status: "synced",
      imported: [
        {
          productSlug: "bpc-157",
          sizeLabel: "5mg",
          pricePence: 4150,
          stock: 12,
          status: "hidden",
          hubspotProductId: "product-1",
        },
      ],
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("checkHubSpotReadiness", () => {
  afterEach(() => {
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    vi.unstubAllGlobals();
  });

  it("reports not ready when the token is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkHubSpotReadiness()).resolves.toEqual({
      ready: false,
      tokenConfigured: false,
      verified: false,
      checkedObjects: [],
      checkedProperties: [],
      dealMapping: undefined,
      error: undefined,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("verifies required ecommerce CRM objects without writing data", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "private-token";
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/crm/v3/pipelines/deals")) {
        return Promise.resolve(
          json({
            results: [
              {
                id: "default",
                label: "Default",
                stages: [
                  { id: "appointmentscheduled", label: "New Enquiry" },
                  { id: "closedwon", label: "Won" },
                  { id: "closedlost", label: "Lost" },
                ],
              },
            ],
          }),
        );
      }
      if (url.includes("/crm/v3/properties/")) {
        return Promise.resolve(json({ name: url.split("/").pop() }));
      }
      return Promise.resolve(json({ results: [] }));
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await checkHubSpotReadiness();
    expect(result).toEqual({
      ready: true,
      tokenConfigured: true,
      verified: true,
      checkedObjects: ["contacts", "companies", "deals", "line_items", "products"],
      checkedProperties: expect.arrayContaining([
        "contacts.email",
        "companies.name",
        "deals.pipeline",
        "deals.dealstage",
        "line_items.hs_sku",
        "products.hs_images",
      ]),
      dealMapping: {
        pipelineId: "default",
        dealStages: ["appointmentscheduled", "closedwon", "closedlost"],
      },
      error: undefined,
    });
    expect(result.checkedProperties).toHaveLength(27);
    expect(fetchMock).toHaveBeenCalledTimes(33);
    for (const [, init] of fetchMock.mock.calls as Array<[string, RequestInit]>) {
      expect(new Headers(init.headers).get("Authorization")).toBe("Bearer private-token");
    }
  });
});
