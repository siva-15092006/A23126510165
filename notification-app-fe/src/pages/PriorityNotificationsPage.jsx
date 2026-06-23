
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Log } from 'logging-middleware';
import { fetchNotifications } from '../api/notifications';
import { getTopNPriority } from '../utils/priorityNotifications';
import { isRead, markAsRead } from '../utils/readStatus';
import NotificationCard from '../components/NotificationCard';

const TYPES = ['All', 'Event', 'Result', 'Placement'];

function PriorityNotificationsPage() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);
      await Log('frontend', 'info', 'page', 'Loading notifications for priority view');

      try {
        const data = await fetchNotifications({ limit: 100, page: 1 });
        setAllNotifications(data);
      } catch (err) {
        setError('Failed to load notifications. Please try again.');
        await Log('frontend', 'error', 'page', `Error loading priority notifications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  const filtered =
    typeFilter === 'All'
      ? allNotifications
      : allNotifications.filter((n) => n.Type === typeFilter);

  const topNotifications = getTopNPriority(filtered, topN);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        ⭐ Priority Inbox
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Top notifications ranked by importance (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Show top"
          type="number"
          size="small"
          value={topN}
          onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value, 10) || 1))}
          sx={{ width: 120 }}
        />
        <ToggleButtonGroup
          value={typeFilter}
          exclusive
          onChange={(e, value) => value && setTypeFilter(value)}
          size="small"
        >
          {TYPES.map((t) => (
            <ToggleButton key={t} value={t} sx={{ textTransform: 'none' }}>
              {t}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && topNotifications.length === 0 && (
        <Typography color="text.secondary">No notifications found.</Typography>
      )}

      {!loading &&
        !error &&
        topNotifications.map((n) => (
          <Box key={n.ID} onClick={() => markAsRead(n.ID)}>
            <NotificationCard notification={n} isUnread={!isRead(n.ID)} />
          </Box>
        ))}
    </Box>
  );
}

export default PriorityNotificationsPage;