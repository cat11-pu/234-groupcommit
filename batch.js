// batch.js：两个触发条件（含等于）
export function reached(limit, pending) {
  return pending >= limit;
}

export function timedOut(gap, last, now) {
  return now - last >= gap;
}
