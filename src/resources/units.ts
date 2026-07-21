import type { HttpClient } from "../http.js";
import type {
  ApiResponseBody,
  CreateUnitInput,
  EntityWithEtag,
  Unit,
} from "../types.js";

export class UnitsResource {
  constructor(private readonly http: HttpClient) {}

  /** List all units visible to the authenticated client. */
  list(): Promise<Unit[]> {
    return this.http.get<Unit[]>("/units");
  }

  /** Load a single unit by UUID. */
  async get(unitId: string): Promise<EntityWithEtag<Unit>> {
    const { data, response } = await this.http.request<Unit>({
      method: "GET",
      path: `/units/${unitId}`,
    });
    return { data, etag: response.headers.get("ETag") };
  }

  /** Create a unit. Returns the API create response (includes resourceId). */
  create(input: CreateUnitInput): Promise<ApiResponseBody> {
    return this.http.post<ApiResponseBody>("/units", input);
  }

  /** Update a unit. Requires the current ETag via If-Match. */
  update(
    unitId: string,
    unit: Unit,
    etag: string,
  ): Promise<ApiResponseBody> {
    return this.http.put<ApiResponseBody>(`/units/${unitId}`, unit, {
      "If-Match": stripEtagQuotes(etag),
    });
  }

  /** Delete a unit and all elements it owns. */
  delete(unitId: string): Promise<void> {
    return this.http.delete(`/units/${unitId}`);
  }

  /** Build an owner / target URI for a unit on the configured API host. */
  targetUri(unitId: string): string {
    return `${this.http.baseUrl}/units/${unitId}`;
  }
}

function stripEtagQuotes(etag: string): string {
  return etag.replace(/^W\//, "").replace(/^"|"$/g, "");
}
