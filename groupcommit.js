// groupcommit.js：整批刷盘（基线：一律给空表）
import { reached, timedOut } from "./batch.js";

export function runCommit(spec) {
  const input = spec || {};
  if (!Number.isInteger(input.batch_max) || input.batch_max <= 0) {
    throw Object.assign(new Error("batch_max must be a positive integer"), { code: "E_BAD_BATCH" });
  }
  if (!Number.isInteger(input.gap) || input.gap <= 0) {
    throw Object.assign(new Error("gap must be a positive integer"), { code: "E_BAD_GAP" });
  }
  const limit = input.batch_max;
  const gap = input.gap;
  const arrivals = Array.isArray(input.arrivals) ? input.arrivals : [];

  const batches = [];
  let pending = 0;
  let last = 0;
  let idle = 0;
  let biggest = 0;
  let biggest_at = 0;
  let prev = null;

  function flush(now) {
    const size = pending;
    batches.push(size);
    pending = 0;
    last = now;
    if (size > biggest) {
      biggest = size;
      biggest_at = batches.length;
    }
  }

  for (let i = 0; i < arrivals.length; i += 1) {
    const now = arrivals[i];
    if (prev !== null && now < prev) {
      throw Object.assign(new Error("arrival time went backwards"), { code: "E_TIME_BACK" });
    }
    prev = now;

    if (timedOut(gap, last, now)) {
      if (pending > 0) {
        flush(now);
      } else {
        idle += 1;
      }
      last = now;
    }

    pending += 1;
    if (reached(limit, pending)) {
      flush(now);
    }
  }

  return {
    batches: batches,
    batch_count: batches.length,
    pending_end: pending,
    biggest: biggest,
    biggest_at: biggest_at,
    idle: idle
  };
}
