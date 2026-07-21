import { HttpClient, type HttpClientConfig } from "./http.js";
import { DomainsResource } from "./resources/domains.js";
import { ElementsResource } from "./resources/elements.js";
import { UnitsResource } from "./resources/units.js";
import type { ElementType } from "./types.js";

export type VeoClientOptions = HttpClientConfig;

/**
 * High-level client for the verinice.veo core REST API.
 *
 * This is an unofficial client. See DISCLAIMER.md and NOTICE.
 */
export class VeoClient {
  readonly http: HttpClient;
  readonly units: UnitsResource;
  readonly domains: DomainsResource;

  readonly assets: ElementsResource;
  readonly controls: ElementsResource;
  readonly documents: ElementsResource;
  readonly incidents: ElementsResource;
  readonly persons: ElementsResource;
  readonly processes: ElementsResource;
  readonly scenarios: ElementsResource;
  readonly scopes: ElementsResource;

  constructor(options: VeoClientOptions) {
    this.http = new HttpClient(options);
    this.units = new UnitsResource(this.http);
    this.domains = new DomainsResource(this.http);

    this.assets = new ElementsResource(this.http, "asset");
    this.controls = new ElementsResource(this.http, "control");
    this.documents = new ElementsResource(this.http, "document");
    this.incidents = new ElementsResource(this.http, "incident");
    this.persons = new ElementsResource(this.http, "person");
    this.processes = new ElementsResource(this.http, "process");
    this.scenarios = new ElementsResource(this.http, "scenario");
    this.scopes = new ElementsResource(this.http, "scope");
  }

  /** Access a typed element resource by element type name. */
  elements(type: ElementType): ElementsResource {
    switch (type) {
      case "asset":
        return this.assets;
      case "control":
        return this.controls;
      case "document":
        return this.documents;
      case "incident":
        return this.incidents;
      case "person":
        return this.persons;
      case "process":
        return this.processes;
      case "scenario":
        return this.scenarios;
      case "scope":
        return this.scopes;
      default: {
        const _exhaustive: never = type;
        throw new Error(`Unknown element type: ${String(_exhaustive)}`);
      }
    }
  }
}
