import type { HttpClient } from "../http.js";
import type {
  ApiResponseBody,
  CreateElementInput,
  Element,
  ElementQuery,
  ElementType,
  EntityWithEtag,
  Page,
} from "../types.js";
import { ELEMENT_PLURALS } from "../types.js";

function normalizeQuery(
  query?: ElementQuery,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!query) return undefined;
  const { childElementIds, scopes, ...rest } = query;
  return {
    ...rest,
    childElementIds: Array.isArray(childElementIds)
      ? childElementIds.join(",")
      : childElementIds,
    scopes: Array.isArray(scopes) ? scopes.join(",") : scopes,
  };
}

function stripEtagQuotes(etag: string): string {
  return etag.replace(/^W\//, "").replace(/^"|"$/g, "");
}

/**
 * Domain-scoped CRUD helpers for one element type
 * (e.g. `/domains/{domainId}/assets`).
 */
export class ElementsResource {
  constructor(
    private readonly http: HttpClient,
    readonly elementType: ElementType,
  ) {}

  private plural(): string {
    return ELEMENT_PLURALS[this.elementType];
  }

  private collectionPath(domainId: string): string {
    return `/domains/${domainId}/${this.plural()}`;
  }

  private itemPath(domainId: string, elementId: string): string {
    return `${this.collectionPath(domainId)}/${elementId}`;
  }

  /** List / search elements in a domain (paginated). */
  list(domainId: string, query?: ElementQuery): Promise<Page<Element>> {
    return this.http.get<Page<Element>>(
      this.collectionPath(domainId),
      normalizeQuery(query),
    );
  }

  /** Load one element from the viewpoint of a domain. */
  async get(
    domainId: string,
    elementId: string,
  ): Promise<EntityWithEtag<Element>> {
    const { data, response } = await this.http.request<Element>({
      method: "GET",
      path: this.itemPath(domainId, elementId),
    });
    return { data, etag: response.headers.get("ETag") };
  }

  /** Create an element in a domain. */
  create(
    domainId: string,
    input: CreateElementInput,
  ): Promise<ApiResponseBody> {
    return this.http.post<ApiResponseBody>(
      this.collectionPath(domainId),
      input,
    );
  }

  /**
   * Update an element (optimistic concurrency via ETag / If-Match).
   * Pass the ETag returned from {@link get}.
   */
  update(
    domainId: string,
    elementId: string,
    element: Element,
    etag: string,
  ): Promise<ApiResponseBody> {
    return this.http.put<ApiResponseBody>(
      this.itemPath(domainId, elementId),
      element,
      { "If-Match": stripEtagQuotes(etag) },
    );
  }

  /**
   * Delete an element by its global type path (`/{plural}/{id}`).
   * Members/parts are unlinked, not cascaded.
   */
  delete(elementId: string): Promise<void> {
    return this.http.delete(`/${this.plural()}/${elementId}`);
  }

  targetUri(domainId: string, elementId: string): string {
    return `${this.http.baseUrl}${this.itemPath(domainId, elementId)}`;
  }
}
