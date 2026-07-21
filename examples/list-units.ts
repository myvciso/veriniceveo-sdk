/**
 * Example: authenticate and list units / domains / processes.
 *
 * Usage:
 *   VEO_USER=... VEO_PASSWORD=... VEO_OTP= npm run build
 *   node --experimental-strip-types examples/list-units.ts
 *   # or after build:
 *   node --import tsx examples/list-units.ts
 *
 * LEGAL: Unofficial client — not affiliated with SerNet GmbH.
 * See DISCLAIMER.md.
 */

import { VeoClient, getAccessToken } from "../src/index.js";

async function main(): Promise<void> {
  const username = process.env.VEO_USER;
  const password = process.env.VEO_PASSWORD;
  if (!username || !password) {
    console.error("Set VEO_USER and VEO_PASSWORD (optional VEO_OTP, VEO_API_URL, VEO_TOKEN_URL).");
    process.exit(1);
  }

  const token = await getAccessToken({
    username,
    password,
    otp: process.env.VEO_OTP ?? "",
    ...(process.env.VEO_TOKEN_URL
      ? { tokenUrl: process.env.VEO_TOKEN_URL }
      : {}),
  });

  const client = new VeoClient({
    ...(process.env.VEO_API_URL ? { baseUrl: process.env.VEO_API_URL } : {}),
    token: token.access_token,
  });

  const [units, domains] = await Promise.all([
    client.units.list(),
    client.domains.list(),
  ]);

  console.log(
    JSON.stringify(
      {
        units: units.map((u) => ({ id: u.id, name: u.name })),
        domains: domains.map((d) => ({ id: d.id, name: d.name })),
      },
      null,
      2,
    ),
  );

  if (units[0] && domains[0]) {
    const page = await client.processes.list(domains[0].id, {
      unit: units[0].id,
      size: 5,
    });
    console.log(`First ${page.items.length} of ${page.totalItemCount} processes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
