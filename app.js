// app.js：渲染结果
import { reached, timedOut } from "./batch.js";
import { runCommit } from "./groupcommit.js";

export function render(spec) {
  const arrivals = spec.arrivals || [];
  const limit = spec.batch_max || 0;
  const view = runCommit(spec);
  const batches = view.batches || [];
  return { batches: batches, batch_count: view.batch_count || 0,
           pending_end: view.pending_end || 0, biggest: view.biggest || 0,
           biggest_at: view.biggest_at || 0, idle: view.idle || 0, count: arrivals.length,
           within_limit: batches.every(function (size) { return size <= limit; }),
           tail: reached(3, 3) ? 1 : 0 };
}
