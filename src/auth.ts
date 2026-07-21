import { VeoAuthError } from "./errors.js";
import { DEFAULT_CLIENT_ID, DEFAULT_TOKEN_URL } from "./types.js";

export interface PasswordGrantOptions {
  username: string;
  password: string;
  /** One-time password; use empty string when 2FA is not enabled. */
  otp?: string;
  clientId?: string;
  tokenUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type: string;
  "not-before-policy"?: number;
  session_state?: string;
  scope?: string;
}

/**
 * Obtain an OIDC access token via the Resource Owner Password Credentials grant.
 *
 * Prefer authorization-code or client-credentials flows in production where possible.
 * Password grant requires a confidential or specially configured public client.
 */
export async function getAccessToken(
  options: PasswordGrantOptions,
): Promise<TokenResponse> {
  const {
    username,
    password,
    otp = "",
    clientId = DEFAULT_CLIENT_ID,
    tokenUrl = DEFAULT_TOKEN_URL,
    fetchImpl = fetch,
  } = options;

  const body = new URLSearchParams({
    username,
    password,
    otp,
    grant_type: "password",
    client_id: clientId,
  });

  const response = await fetchImpl(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new VeoAuthError(
      `Failed to obtain access token (HTTP ${response.status})`,
      response.status,
      payload,
    );
  }

  return payload as TokenResponse;
}

export type TokenProvider =
  | string
  | (() => string | Promise<string>)
  | (() => TokenResponse | Promise<TokenResponse>);

export async function resolveBearerToken(
  provider: TokenProvider,
): Promise<string> {
  if (typeof provider === "string") {
    return provider.startsWith("Bearer ") ? provider.slice(7) : provider;
  }

  const value = await provider();
  if (typeof value === "string") {
    return value.startsWith("Bearer ") ? value.slice(7) : value;
  }
  return value.access_token;
}
