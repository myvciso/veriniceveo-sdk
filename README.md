# veriniceveo-sdk

Unofficial TypeScript/JavaScript client for the [verinice.veo](https://github.com/SerNet/verinice-veo) REST API.

> **Not affiliated with SerNet.**  
> This is an independent open-source client. **verinice**, **verinice.veo**, and **SerNet** are trademarks of SerNet GmbH. See [DISCLAIMER.md](./DISCLAIMER.md) and [NOTICE](./NOTICE).

## Install

```bash
npm install @myvciso/veriniceveo-sdk
```

## Quick start

```ts
import { VeoClient, getAccessToken } from "@myvciso/veriniceveo-sdk";

const token = await getAccessToken({
  username: process.env.VEO_USER!,
  password: process.env.VEO_PASSWORD!,
  otp: process.env.VEO_OTP ?? "",
});

const client = new VeoClient({
  // Defaults to https://api.eu.verinice.cloud/veo
  baseUrl: process.env.VEO_API_URL,
  token: token.access_token,
});

const units = await client.units.list();
const domains = await client.domains.list();

const processes = await client.processes.list(domains[0]!.id, {
  unit: units[0]!.id,
  size: 20,
  page: 0,
});
```

### Create an element

```ts
const created = await client.assets.create(domainId, {
  name: "Mail Server",
  subType: "AST_IT-System",
  status: "RELEASED",
  owner: { targetUri: client.units.targetUri(unitId) },
});

console.log(created.resourceId);
```

### Update with ETag (optimistic locking)

```ts
const { data, etag } = await client.scopes.get(domainId, scopeId);
data.description = "Updated description";
await client.scopes.update(domainId, scopeId, data, etag!);
```

### Custom token provider

```ts
const client = new VeoClient({
  token: async () => refreshMyToken(), // string or TokenResponse
});
```

## API coverage

| Resource | Methods |
| --- | --- |
| Units | `list`, `get`, `create`, `update`, `delete` |
| Domains | `list`, `get` |
| Elements (assets, controls, documents, incidents, persons, processes, scenarios, scopes) | `list` (search/filter/page), `get`, `create`, `update`, `delete` |

Low-level access: `client.http.request(...)`.

Official API intro: [Getting Started with the verinice API](https://veo-docs.verinice.com/en/developers/getting-started-with-the-verinice-api.html).  
Swagger UI (public): <https://api.verinice.com/veo/swagger-ui/index.html>

## Configuration defaults

| Option | Default |
| --- | --- |
| `baseUrl` | `https://api.eu.verinice.cloud/veo` |
| Token URL (password grant) | `https://auth.eu.verinice.cloud/auth/realms/verinice-veo/protocol/openid-connect/token` |
| `clientId` | `veo-prod` |

Override these for self-hosted / on-prem deployments.

## Legal

- **License (this SDK):** [Apache License 2.0](./LICENSE)
- **Upstream server:** [SerNet/verinice-veo](https://github.com/SerNet/verinice-veo) (AGPL-3.0)
- **Disclaimers & trademarks:** [DISCLAIMER.md](./DISCLAIMER.md) · [NOTICE](./NOTICE)

This SDK does **not** grant any rights to SerNet trademarks or to the AGPL-licensed server source. You are responsible for complying with your verinice.veo subscription or self-hosting terms and with applicable law when calling the API.

## Development

```bash
npm install
npm run build
npm test
```

## License

Copyright 2026 myvCISO contributors. Licensed under the Apache License, Version 2.0.
