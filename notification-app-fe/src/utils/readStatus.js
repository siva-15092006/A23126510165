import { Log } from 'logging-middleware';

const READ_KEY = 'notification_read_ids';

export function getReadIds() {
  const raw = localStorage.getItem(READ_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function markAsRead(id) {
  const readIds = getReadIds();
  if (!readIds.includes(id)) {
    readIds.push(id);
    localStorage.setItem(READ_KEY, JSON.stringify(readIds));
    Log('frontend', 'debug', 'utils', `Marked notification ${id} as read`);
  }
}

export function isRead(id) {
  return getReadIds().includes(id);
}