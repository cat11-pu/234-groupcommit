// batch.js：两个触发条件（基线：一律给假）
export function reached(limit, pending) {
  return false;
}

export function timedOut(gap, last, now) {
  return false;
}
