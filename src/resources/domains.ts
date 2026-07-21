import type { HttpClient } from "../http.js";
import type { Domain, EntityWithEtag } from "../types.js";

export class DomainsResource {
  constructor(private readonly http: HttpClient) {}

  /** List all domains available to the authenticated client. */
  list(): Promise<Domain[]> {
    return this.http.get<Domain[]>("/domains");
  }

  /** Load a single domain by UUID. */
  async get(domainId: string): Promise<EntityWithEtag<Domain>> {
    const { data, response } = await this.http.request<Domain>({
      method: "GET",
      path: `/domains/${domainId}`,
    });
    return { data, etag: response.headers.get("ETag") };
  }

  targetUri(domainId: string): string {
    return `${this.http.baseUrl}/domains/${domainId}`;
  }
}
