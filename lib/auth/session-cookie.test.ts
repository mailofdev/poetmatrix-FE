import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeNextPath } from "./session-cookie.ts";

describe("safeNextPath", () => {
  it("keeps same-origin paths", () => {
    assert.equal(safeNextPath("/library"), "/library");
    assert.equal(safeNextPath("/write/abc"), "/write/abc");
  });

  it("rejects open redirects", () => {
    assert.equal(safeNextPath("https://evil.example"), "/library");
    assert.equal(safeNextPath("//evil.example"), "/library");
    assert.equal(safeNextPath("/\\evil.example"), "/library");
    assert.equal(safeNextPath("library"), "/library");
  });
});
