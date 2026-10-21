"use strict";

const { normalizeStderr } = require("../utils/test-utils");

const NETWORK_IPV6 = "<i> [webpack-dev-server] On Your Network (IPv6): ";

describe("normalizeStderr", () => {
  it("should replace a compressed IPv6 address, such as a unique local address", () => {
    expect(normalizeStderr(`${NETWORK_IPV6}http://[fdb2:2c26:f4e4::1]:8080/`)).toBe(
      `${NETWORK_IPV6}http://[x:x:x:x:x:x:x:x]:<port>/`,
    );
  });

  it("should replace a full IPv6 address with its brackets", () => {
    expect(normalizeStderr(`${NETWORK_IPV6}http://[2001:db8:0:0:0:0:0:1]:8080/`)).toBe(
      `${NETWORK_IPV6}http://[x:x:x:x:x:x:x:x]:<port>/`,
    );
  });

  it("should keep the IPv6 loopback", () => {
    expect(
      normalizeStderr(
        "<i> [webpack-dev-server] Loopback: http://localhost:8080/, http://[::1]:8080/",
      ),
    ).toBe("<i> [webpack-dev-server] Loopback: http://localhost:<port>/, http://[::1]:<port>/");
  });

  it("should leave bracketed text that is not an IPv6 address", () => {
    expect(normalizeStderr("[1:2] [dead:beef] [webpack-dev-server]")).toBe(
      "[1:2] [dead:beef] [webpack-dev-server]",
    );
  });
});
