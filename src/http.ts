import { resolveBearerToken, type TokenProvider } from "./auth.js";
import { VeoApiError } from "./errors.js";
import { DEFAULT_API_BASE_URL } from "./types.js";

export interface HttpRequestOptions {
  method?: string;
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  /** When true, return raw Response instead of parsed JSON. */
  raw?: boolean;
}

export interface HttpClientConfig {
  baseUrl?: string;
  token: TokenProvider;
  fetchImpl?: typeof fetch;
  defaultHeaders?: Record<string, string>;
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

function buildQuery(
  query?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}

export class HttpClient {
  readonly baseUrl: string;
  private readonly token: TokenProvider;
  private readonly fetchImpl: typeof fetch;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.baseUrl = (config.baseUrl ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
    this.token = config.token;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  async request<T = unknown>(
    options: HttpRequestOptions,
  ): Promise<{ data: T; response: Response }> {
    const accessToken = await resolveBearerToken(this.token);
    const url = joinUrl(this.baseUrl, options.path) + buildQuery(options.query);

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...this.defaultHeaders,
      ...options.headers,
    };

    const init: RequestInit = {
      method: options.method ?? "GET",
      headers,
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
      init.body =
        typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body);
    }

    const response = await this.fetchImpl(url, init);

    if (options.raw) {
      return { data: undefined as T, response };
    }

    const text = await response.text();
    const data = text ? (JSON.parse(text) as T) : (undefined as T);

    if (!response.ok) {
      throw new VeoApiError(
        `verinice.veo API request failed: ${options.method ?? "GET"} ${options.path} (HTTP ${response.status})`,
        response.status,
        data,
      );
    }

    return { data, response };
  }

  async get<T>(
    path: string,
    query?: HttpRequestOptions["query"],
  ): Promise<T> {
    const request: HttpRequestOptions = { method: "GET", path };
    if (query !== undefined) request.query = query;
    const { data } = await this.request<T>(request);
    return data;
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const request: HttpRequestOptions = { method: "POST", path };
    if (body !== undefined) request.body = body;
    const { data } = await this.request<T>(request);
    return data;
  }

  async put<T>(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const request: HttpRequestOptions = { method: "PUT", path, body };
    if (headers !== undefined) request.headers = headers;
    const { data } = await this.request<T>(request);
    return data;
  }

  async delete(path: string): Promise<void> {
    await this.request({ method: "DELETE", path });
  }
}
