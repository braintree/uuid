const uuid = require("../");
const isUuid = require("is-uuid");

describe("uuid", () => {
  let originalCrypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    global.crypto = originalCrypto;
  });

  it("returns valid v4 UUIDs", () => {
    for (let i = 0; i < 10; i++) {
      expect(isUuid.v4(uuid())).toBe(true);
    }
  });

  it("returns unique UUIDs on each call", () => {
    const results = new Set();

    for (let i = 0; i < 20; i++) {
      results.add(uuid());
    }

    expect(results.size).toBe(20);
  });

  it("falls back to crypto.getRandomValues when crypto.randomUUID is not available", () => {
    global.crypto = {
      getRandomValues: (buf) => {
        for (let i = 0; i < buf.length; i++) buf[i] = 0x00;
        return buf;
      },
    };

    expect(uuid()).toBe("00000000-0000-4000-8000-000000000000");
  });

  it("falls back to crypto.getRandomValues when crypto.randomUUID throws", () => {
    global.crypto = {
      randomUUID: () => {
        throw new Error("Not allowed");
      },
      getRandomValues: (buf) => {
        for (let i = 0; i < buf.length; i++) buf[i] = 0xff;
        return buf;
      },
    };

    expect(uuid()).toBe("ffffffff-ffff-4fff-bfff-ffffffffffff");
  });

  it("throws when no secure random source is available", () => {
    delete global.crypto;

    expect(() => uuid()).toThrow(
      "@braintree/uuid: No secure random source available",
    );
  });
});
