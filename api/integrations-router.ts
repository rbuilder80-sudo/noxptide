import { createRouter, staffQuery } from "./middleware";

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
  status: staffQuery.query(() => {
    const missing = requiredLiveVariables.filter((name) => !configured(name));
    const hubspotReady = configured("HUBSPOT_ACCESS_TOKEN");
    const wallidReady =
      configured("WALLID_API_KEY_ID") &&
      configured("WALLID_API_KEY_SECRET") &&
      configured("WALLID_WEBHOOK_SECRET");

    return {
      ecommerceReady: hubspotReady && wallidReady && configured("PUBLIC_SITE_URL"),
      hubspot: {
        ready: hubspotReady,
        tokenConfigured: hubspotReady,
        syncs: ["contacts", "deals", "line_items", "products"],
      },
      wallid: {
        ready: wallidReady,
        apiKeyIdConfigured: configured("WALLID_API_KEY_ID"),
        apiKeySecretConfigured: configured("WALLID_API_KEY_SECRET"),
        webhookSecretConfigured: configured("WALLID_WEBHOOK_SECRET"),
      },
      site: {
        publicSiteUrlConfigured: configured("PUBLIC_SITE_URL"),
        publicSiteUrl: process.env.PUBLIC_SITE_URL?.trim() || "https://www.noxptide.co.uk",
      },
      missingVariables: missing,
    };
  }),
});
