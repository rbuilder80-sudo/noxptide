import { beforeEach, describe, expect, it, vi } from "vitest";
import { exchangeAuthCode } from "./auth";

vi.hoisted(() => {
  process.env.APP_ID = "app-id";
  process.env.APP_SECRET = "app-secret";
  process.env.KIMI_AUTH_URL = "https://www.kimi.com";
  delete process.env.KIMI_TOKEN_URL;
});

const tokenResponse = {
  access_token: "kimi-access-token",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "kimi-refresh-token",
  scope: "profile",
};

describe("exchangeAuthCode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retries without redirect_uri when Kimi rejects the redirect URI", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: "invalid_request",
            error_description: "Invalid redirect_uri",
          }),
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(tokenResponse), { status: 200 }),
      );

    await expect(
      exchangeAuthCode("auth-code", "https://www.noxptide.co.uk/api/oauth/callback"),
    ).resolves.toEqual(tokenResponse);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][1]?.body)).toContain("redirect_uri=");
    expect(String(fetchMock.mock.calls[1][1]?.body)).not.toContain("redirect_uri=");
  });

  it("falls back to auth.kimi.com when the configured token host rejects redirect_uri", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: "invalid_request",
            error_description: "Invalid redirect_uri",
          }),
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: "invalid_request",
            error_description: "The request is missing a required parameter",
          }),
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: "invalid_request",
            error_description: "Invalid redirect_uri",
          }),
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(tokenResponse), { status: 200 }),
      );

    await expect(
      exchangeAuthCode("auth-code", "https://www.noxptide.co.uk/api/oauth/callback"),
    ).resolves.toEqual(tokenResponse);

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[2][0]).toBe("https://auth.kimi.com/api/oauth/token");
    expect(String(fetchMock.mock.calls[2][1]?.body)).toContain("redirect_uri=");
  });

  it("does not retry non-redirect token exchange errors", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "Code expired",
        }),
        { status: 400 },
      ),
    );

    await expect(
      exchangeAuthCode("expired-code", "https://www.noxptide.co.uk/api/oauth/callback"),
    ).rejects.toThrow("Token exchange failed (400)");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
