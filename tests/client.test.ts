import { afterEach, describe, expect, it, vi } from "vitest";
import { getAccessToken } from "../src/auth.js";
import { VeoClient } from "../src/client.js";
import { VeoApiError, VeoAuthError } from "../src/errors.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getAccessToken", () => {
  it("posts password-grant form data and returns the token payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "tok",
        expires_in: 300,
        token_type: "Bearer",
      }),
    });

    const result = await getAccessToken({
      username: "user",
      password: "secret",
      otp: "123456",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    expect(result.access_token).toBe("tok");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0]!;
    expect(init.method).toBe("POST");
    expect(String(init.body)).toContain("grant_type=password");
    expect(String(init.body)).toContain("client_id=veo-prod");
  });

  it("throws VeoAuthError on failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "invalid_grant" }),
    });

    await expect(
      getAccessToken({
        username: "user",
        password: "bad",
        fetchImpl: fetchMock as unknown as typeof fetch,
      }),
    ).rejects.toBeInstanceOf(VeoAuthError);
  });
});

describe("VeoClient", () => {
  it("lists units with Authorization bearer header", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () =>
        JSON.stringify([{ id: "u1", name: "Org" }]),
    });

    const client = new VeoClient({
      baseUrl: "https://example.test/veo",
      token: "abc",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const units = await client.units.list();
    expect(units).toEqual([{ id: "u1", name: "Org" }]);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://example.test/veo/units");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer abc",
    );
  });

  it("lists domain-scoped elements with query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () =>
        JSON.stringify({
          items: [{ id: "p1", name: "Proc" }],
          totalItemCount: 1,
          pageCount: 1,
          page: 0,
        }),
    });

    const client = new VeoClient({
      baseUrl: "https://example.test/veo/",
      token: async () => "tok",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const page = await client.processes.list("domain-1", {
      unit: "unit-1",
      name: "Proc",
      size: 5,
    });

    expect(page.items[0]?.id).toBe("p1");
    const [url] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain(
      "/domains/domain-1/processes?",
    );
    expect(String(url)).toContain("unit=unit-1");
    expect(String(url)).toContain("name=Proc");
    expect(String(url)).toContain("size=5");
  });

  it("sends If-Match without surrounding quotes on update", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ success: true }),
    });

    const client = new VeoClient({
      baseUrl: "https://example.test/veo",
      token: "tok",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.assets.update(
      "d1",
      "a1",
      { id: "a1", name: "Asset" },
      '"etag-value"',
    );

    const [, init] = fetchMock.mock.calls[0]!;
    expect((init.headers as Record<string, string>)["If-Match"]).toBe(
      "etag-value",
    );
    expect(init.method).toBe("PUT");
  });

  it("throws VeoApiError for non-2xx responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers(),
      text: async () => JSON.stringify({ message: "missing" }),
    });

    const client = new VeoClient({
      baseUrl: "https://example.test/veo",
      token: "tok",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.domains.list()).rejects.toBeInstanceOf(VeoApiError);
  });

  it("builds unit target URIs from the configured base URL", () => {
    const client = new VeoClient({
      baseUrl: "https://example.test/veo",
      token: "tok",
    });
    expect(client.units.targetUri("u-9")).toBe(
      "https://example.test/veo/units/u-9",
    );
  });
});
