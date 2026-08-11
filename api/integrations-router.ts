import { createRouter, staffQuery } from "./middleware";
import { checkHubSpotReadiness } from "./lib/hubspot";
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
});
