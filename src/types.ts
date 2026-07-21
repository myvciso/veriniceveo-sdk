/** Element types exposed by the verinice.veo core API. */
export type ElementType =
  | "asset"
  | "control"
  | "document"
  | "incident"
  | "person"
  | "process"
  | "scenario"
  | "scope";

/** Plural path segments used in REST URLs. */
export const ELEMENT_PLURALS: Record<ElementType, string> = {
  asset: "assets",
  control: "controls",
  document: "documents",
  incident: "incidents",
  person: "persons",
  process: "processes",
  scenario: "scenarios",
  scope: "scopes",
};

export interface IdRef {
  displayName?: string;
  targetUri: string;
  searchesUri?: string;
  resourcesUri?: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation?: string;
  description?: string;
  domains?: IdRef[];
  parent?: IdRef | null;
  units?: IdRef[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  _self?: string;
  [key: string]: unknown;
}

export interface Domain {
  id: string;
  name: string;
  abbreviation?: string;
  description?: string;
  active?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  _self?: string;
  [key: string]: unknown;
}

export interface Element {
  id: string;
  name: string;
  type?: ElementType | string;
  designator?: string;
  description?: string;
  abbreviation?: string;
  subType?: string;
  status?: string;
  owner?: IdRef;
  links?: Record<string, unknown>;
  customAspects?: Record<string, unknown>;
  parts?: IdRef[];
  members?: IdRef[];
  domains?: IdRef[];
  decisionResults?: Record<string, unknown>;
  riskValues?: Record<string, unknown>;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  _self?: string;
  [key: string]: unknown;
}

export interface Page<T> {
  items: T[];
  totalItemCount: number;
  pageCount: number;
  page: number;
}

export interface CreateElementInput {
  name: string;
  subType: string;
  status: string;
  owner: { targetUri: string };
  description?: string;
  abbreviation?: string;
  links?: Record<string, unknown>;
  customAspects?: Record<string, unknown>;
  parts?: Array<{ targetUri: string }>;
  members?: Array<{ targetUri: string }>;
  [key: string]: unknown;
}

export interface CreateUnitInput {
  name: string;
  abbreviation?: string;
  description?: string;
  domains?: Array<{ targetUri: string }>;
  parent?: { targetUri: string } | null;
  [key: string]: unknown;
}

export interface ElementQuery {
  unit?: string;
  name?: string;
  subType?: string;
  status?: string;
  description?: string;
  designator?: string;
  abbreviation?: string;
  displayName?: string;
  updatedBy?: string;
  childElementIds?: string | string[];
  hasChildElements?: boolean;
  hasParentElements?: boolean;
  scopes?: string | string[];
  size?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | "ASC" | "DESC";
}

export interface ApiResponseBody {
  success?: boolean;
  resourceId?: string;
  message?: string;
  [key: string]: unknown;
}

export interface EntityWithEtag<T> {
  data: T;
  etag: string | null;
}

/** Default public EU cloud endpoints (may change; override in config). */
export const DEFAULT_API_BASE_URL = "https://api.eu.verinice.cloud/veo";
export const DEFAULT_TOKEN_URL =
  "https://auth.eu.verinice.cloud/auth/realms/verinice-veo/protocol/openid-connect/token";
export const DEFAULT_CLIENT_ID = "veo-prod";
