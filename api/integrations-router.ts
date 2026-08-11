import { createRouter, staffQuery } from "./middleware";
import { checkHubSpotReadiness, syncOrderToHubSpot, type EcommerceOrder, type EcommerceOrderItem } from "./lib/hubspot";
import { checkWallidReadiness } from "./lib/wallid";

const requiredLiveVariables = [
  "HUBSPOT_ACCESS_TOKEN",
  "WALLID_API_KEY_ID",
  "WALLID_API_KEY_SECRET",
  "WALLID_WEBHOOK_SECRET",
  "PUBLIC_SITE_URL",
] as const;

function configured(name: string) {
  return Boolean(process.env[name]?.trim());
}

export const integrationsRouter = createRouter({
  /** Staff: safe readiness status for external ecommerce integrations. */
  status: staffQuery.query(async () => {
    const missing = requiredLiveVariables.filter((name) => !configured(name));
    const hubspot = await checkHubSpotReadiness();
    const wallid = checkWallidReadiness();

    return {
      ecommerceReady: hubspot.ready && wallid.ready && configured("PUBLIC_SITE_URL"),
      hubspot: {
        ready: hubspot.ready,
        tokenConfigured: hubspot.tokenConfigured,
        verified: hubspot.verified,
        checkedObjects: hubspot.checkedObjects,
        checkedProperties: hubspot.checkedProperties,
        dealMapping: hubspot.dealMapping,
        error: hubspot.error,
        syncs: ["contacts", "deals", "line_items", "products"],
      },
      wallid: {
        ready: wallid.ready,
        apiKeyIdConfigured: wallid.apiKeyIdConfigured,
        apiKeySecretConfigured: wallid.apiKeySecretConfigured,
        webhookSecretConfigured: wallid.webhookSecretConfigured,
        webhookVerified: wallid.webhookVerified,
        webhookUrl: wallid.webhookUrl,
        error: wallid.error,
      },
      site: {
        publicSiteUrlConfigured: configured("PUBLIC_SITE_URL"),
        publicSiteUrl: process.env.PUBLIC_SITE_URL?.trim() || "https://www.noxptide.co.uk",
      },
      missingVariables: missing,
    };
  }),

  /** Staff: create/update a clearly labelled HubSpot test ecommerce sync. */
  testHubSpotSync: staffQuery.mutation(async () => {
    const order: EcommerceOrder = {
      orderNumber: "NOX-HUBSPOT-TEST",
      customerName: "Noxptide HubSpot Test",
      email: "hubspot-test@noxptide.co.uk",
      phone: "+44 0000 000000",
      addressLine1: "Noxptide integration test",
      addressLine2: "Do not fulfil",
      city: "London",
      postcode: "TEST 1AA",
      country: "United Kingdom",
      status: "paid",
      totalPence: 3499,
      notes: [
        "Organisation: Noxptide Integration Test",
        "Delivery: standard",
        "This is a safe labelled test record created from the Noxptide admin dashboard to verify HubSpot ecommerce sync.",
        "Do not fulfil. Do not contact.",
      ].join("\n"),
    };
    const items: EcommerceOrderItem[] = [
      {
        productSlug: "bpc-157",
        productName: "BPC-157",
        sizeLabel: "5 mg",
        unitPricePence: 3499,
        qty: 1,
      },
    ];
    return syncOrderToHubSpot(order, items);
  }),
});
