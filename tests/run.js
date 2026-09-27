import assert from "node:assert";
import { reached, timedOut } from "../batch.js";
import { runCommit } from "../groupcommit.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("reached returns a flag", () => {
  assert.strictEqual(typeof reached(2, 1), "boolean");
});

check("timedOut returns a flag", () => {
  assert.strictEqual(typeof timedOut(2, 0, 1), "boolean");
});

check("runCommit returns batches", () => {
  assert.ok(Array.isArray(runCommit({ batch_max: 1, gap: 1, arrivals: [] }).batches));
});

check("render counts arrivals", () => {
  assert.strictEqual(typeof render({ batch_max: 1, gap: 1, arrivals: [] }).count, "number");
});

check("render exposes limit flag", () => {
  assert.strictEqual(typeof render({ batch_max: 1, gap: 1, arrivals: [] }).within_limit, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
