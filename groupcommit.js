// groupcommit.js：整批刷盘（一次扫描，每次到达只判一次）
import { reached, timedOut } from "./batch.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function runCommit(spec) {
  const limit = spec.batch_max;
  const gap = spec.gap;
  if (!isPositiveInteger(limit)) throw fail("E_BAD_BATCH", "batch_max 必须是正整数");
  if (!isPositiveInteger(gap)) throw fail("E_BAD_GAP", "gap 必须是正整数");

  const arrivals = spec.arrivals || [];
  const batches = [];
  let pending = 0;
  let idle = 0;
  let last = 0;
  let previous = null;

  for (const now of arrivals) {
    if (previous !== null && now < previous) throw fail("E_TIME_BACK", "到达时刻不得回落");
    previous = now;

    if (timedOut(gap, last, now)) {
      if (pending > 0) {
        batches.push(pending);
        pending = 0;
      } else {
        idle += 1;
      }
      last = now;
    }

    pending += 1;
    if (reached(limit, pending)) {
      batches.push(pending);
      pending = 0;
      last = now;
    }
  }

  let biggest = 0;
  let biggest_at = 0;
  batches.forEach(function (size, index) {
    if (size > biggest) {
      biggest = size;
      biggest_at = index + 1;
    }
  });

  return {
    batches: batches,
    batch_count: batches.length,
    pending_end: pending,
    biggest: biggest,
    biggest_at: biggest_at,
    idle: idle
  };
}
