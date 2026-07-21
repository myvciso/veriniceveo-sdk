/**
 * @myvciso/veriniceveo-sdk — unofficial TypeScript client for verinice.veo.
 *
 * LEGAL NOTICE: This package is not affiliated with SerNet GmbH.
 * "verinice" and "SerNet" are trademarks of SerNet GmbH.
 * See NOTICE and DISCLAIMER.md for full legal notices.
 */

export { VeoClient, type VeoClientOptions } from "./client.js";
export {
  getAccessToken,
  resolveBearerToken,
  type PasswordGrantOptions,
  type TokenProvider,
  type TokenResponse,
} from "./auth.js";
export { VeoError, VeoAuthError, VeoApiError } from "./errors.js";
export { HttpClient, type HttpClientConfig, type HttpRequestOptions } from "./http.js";
export { UnitsResource } from "./resources/units.js";
export { DomainsResource } from "./resources/domains.js";
export { ElementsResource } from "./resources/elements.js";
export {
  ELEMENT_PLURALS,
  DEFAULT_API_BASE_URL,
  DEFAULT_TOKEN_URL,
  DEFAULT_CLIENT_ID,
  type ElementType,
  type IdRef,
  type Unit,
  type Domain,
  type Element,
  type Page,
  type CreateElementInput,
  type CreateUnitInput,
  type ElementQuery,
  type ApiResponseBody,
  type EntityWithEtag,
} from "./types.js";
