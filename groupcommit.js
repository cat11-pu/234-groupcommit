// groupcommit.js：整批刷盘（基线：一律给空表）
import { reached, timedOut } from "./batch.js";

export function runCommit(spec) {
  return { batches: [], batch_count: 0, pending_end: 0, biggest: 0, biggest_at: 0, idle: 0 };
}
