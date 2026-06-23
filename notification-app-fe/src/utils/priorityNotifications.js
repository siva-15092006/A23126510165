import { Log } from 'logging-middleware';

// Weight: higher number = higher priority
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Computes a priority score for a notification.
 * Combines type weight with recency (newer = higher score).
 */
function computePriorityScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp.replace(' ', 'T')).getTime();
  // Normalize timestamp to a smaller scale so weight dominates ties,
  // but recency still breaks ties within the same type.
  return weight * 1e12 + timestamp;
}

/**
 * Returns the top N notifications by priority (weight + recency).
 * @param {Array} notifications
 * @param {number} n
 */
export function getTopNPriority(notifications, n = 10) {
  const sorted = [...notifications].sort(
    (a, b) => computePriorityScore(b) - computePriorityScore(a)
  );
  const top = sorted.slice(0, n);

  Log('frontend', 'debug', 'utils', `Computed top ${n} priority notifications from ${notifications.length} total`);

  return top;
}