"use strict";

function uuid() {
  // Try native crypto.randomUUID first (browser)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fall through
    }
  }

  // Node.js crypto module
  try {
    const nodeCrypto = require('crypto');
    if (nodeCrypto && typeof nodeCrypto.randomUUID === 'function') {
      return nodeCrypto.randomUUID();
    }
    if (nodeCrypto && typeof nodeCrypto.randomBytes === 'function') {
      const bytes = nodeCrypto.randomBytes(16);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant

      // Hex table (avoids Array.from/padStart)
      const hex = new Array(256);
      for (let i = 0; i < 256; i++) hex[i] = (i < 16 ? "0" : "") + i.toString(16);

      return (
        hex[bytes[0]] + hex[bytes[1]] + hex[bytes[2]] + hex[bytes[3]] + "-" +
        hex[bytes[4]] + hex[bytes[5]] + "-" +
        hex[bytes[6]] + hex[bytes[7]] + "-" +
        hex[bytes[8]] + hex[bytes[9]] + "-" +
        hex[bytes[10]] + hex[bytes[11]] + hex[bytes[12]] + hex[bytes[13]] + hex[bytes[14]] + hex[bytes[15]]
      );
    }
  } catch (e) {
    // Node crypto not available
  }

  // Browser Web Crypto API
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = new Array(256);
    for (let i = 0; i < 256; i++) hex[i] = (i < 16 ? "0" : "") + i.toString(16);

    return (
      hex[bytes[0]] + hex[bytes[1]] + hex[bytes[2]] + hex[bytes[3]] + "-" +
      hex[bytes[4]] + hex[bytes[5]] + "-" +
      hex[bytes[6]] + hex[bytes[7]] + "-" +
      hex[bytes[8]] + hex[bytes[9]] + "-" +
      hex[bytes[10]] + hex[bytes[11]] + hex[bytes[12]] + hex[bytes[13]] + hex[bytes[14]] + hex[bytes[15]]
    );
  }

  throw new Error('No secure random source available');
}

module.exports = uuid;