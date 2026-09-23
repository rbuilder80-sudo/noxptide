import "dotenv/config";

export function requireEnv(name: string): string {
  const value = process.env[name] ?? "";
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function requireEnvGroup(names: string[]) {
  for (const name of names) {
    requireEnv(name);
  }
}

export const env = {
  appId: process.env.APP_ID ?? "",
  appSecret: process.env.APP_SECRET ?? "",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  kimiAuthUrl: process.env.KIMI_AUTH_URL ?? "",
  kimiOpenUrl: process.env.KIMI_OPEN_URL ?? "",
  kimiRedirectUri: process.env.KIMI_REDIRECT_URI ?? "",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
