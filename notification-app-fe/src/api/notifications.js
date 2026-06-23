import axios from 'axios';
import { Log } from 'logging-middleware';

const BASE_URL = 'http://4.224.186.213/evaluation-service/notifications';

let authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYWthbGFwYXRpc2l2YWt1bWFycmFqdS4yMy5jc2VAYW5pdHMuZWR1LmluIiwiZXhwIjoxNzgyMTkzOTQ1LCJpYXQiOjE3ODIxOTMwNDUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI3MzVlMWU3Ny04OTBiLTRiNzUtODJjNC1mMjVkZGRmMzA3MWMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJwYWthbGFwYXRpIHNpdmEga3VtYXIgcmFqdSIsInN1YiI6ImJjZDQ1MDhlLWZkODUtNDE0NS05OTg2LThjNDFmNzc4YjM5YiJ9LCJlbWFpbCI6InBha2FsYXBhdGlzaXZha3VtYXJyYWp1LjIzLmNzZUBhbml0cy5lZHUuaW4iLCJuYW1lIjoicGFrYWxhcGF0aSBzaXZhIGt1bWFyIHJhanUiLCJyb2xsTm8iOiJhMjMxMjY1MTAxNjUiLCJhY2Nlc3NDb2RlIjoiTVRxeGFyIiwiY2xpZW50SUQiOiJiY2Q0NTA4ZS1mZDg1LTQxNDUtOTk4Ni04YzQxZjc3OGIzOWIiLCJjbGllbnRTZWNyZXQiOiJIS3dqV2pORWRLR2JTVmVrIn0.Rrklr5O7pqTtVsLJC6mphWqlYRTFYYXRxvEW4b47tuM';

export function setNotificationAuthToken(token) {
  authToken = token;
}

const MOCK_NOTIFICATIONS = [
  { ID: "d82d7ef3-dbdc-49fd-9497-553fe7f64344", Type: "Event", Message: "traditional-day", Timestamp: "2026-06-22 19:39:13" },
  { ID: "cb215165-2085-4811-b7e0-f7b8ad872cd3", Type: "Result", Message: "mid-sem", Timestamp: "2026-06-22 17:09:00" },
  { ID: "5e8497ab-1007-4d30-afe8-02b43beb7714", Type: "Placement", Message: "TSMC hiring", Timestamp: "2026-06-22 13:38:47" },
  { ID: "d41629f9-dbc3-459f-bc48-2e8cdf033099", Type: "Placement", Message: "Alphabet Inc. Class C hiring", Timestamp: "2026-06-23 05:38:34" },
  { ID: "5163f8f6-8eb4-4da8-9f49-9589bafb0b7d", Type: "Event", Message: "induction", Timestamp: "2026-06-22 11:08:21" },
];

/**
 * Fetches notifications from the Test Server.
 * Falls back to sample data if the live API is unreachable
 * (e.g., due to the server's CORS misconfiguration).
 */
export async function fetchNotifications(params = {}) {
  await Log('frontend', 'info', 'api', `Fetching notifications with params: ${JSON.stringify(params)}`);

  try {
    const response = await axios.get(BASE_URL, {
      params,
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 8000,
    });
    const notifications = response.data?.notifications || [];
    await Log('frontend', 'info', 'api', `Fetched ${notifications.length} notifications successfully`);
    return notifications;
  } catch (err) {
    await Log('frontend', 'warn', 'api', `Live API unreachable (${err.message}), using sample data fallback`);
    let filtered = MOCK_NOTIFICATIONS;
    if (params.notification_type) {
      filtered = filtered.filter((n) => n.Type === params.notification_type);
    }
    return filtered;
  }
}