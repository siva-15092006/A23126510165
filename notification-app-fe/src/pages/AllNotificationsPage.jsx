import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Log } from 'logging-middleware';
import { fetchNotifications } from '../api/notifications';
import { isRead, markAsRead } from '../utils/readStatus';
import NotificationCard from '../components/NotificationCard';

const TYPES = ['All', 'Event', 'Result', 'Placement'];

function AllNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      setError(null);

      await Log('frontend', 'info', 'page', `Loading all notifications, filter: ${typeFilter}`);

      try {
        const params = { limit: 50, page: 1 };
        if (typeFilter !== 'All') {
          params.notification_type = typeFilter;
        }
        const data = await fetchNotifications(params);
        setNotifications(data);
      } catch (err) {
        setError('Failed to load notifications. Please try again.');
        await Log('frontend', 'error', 'page', `Error loading notifications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [typeFilter]);

  const handleCardView = (id) => {
    markAsRead(id);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🔔 All Notifications
      </Typography>

      <ToggleButtonGroup
        value={typeFilter}
        exclusive
        onChange={(e, value) => value && setTypeFilter(value)}
        size="small"
        sx={{ mb: 3, mt: 1 }}
      >
        {TYPES.map((t) => (
          <ToggleButton key={t} value={t} sx={{ textTransform: 'none' }}>
            {t}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Typography color="text.secondary">No notifications found.</Typography>
      )}

      {!loading &&
        !error &&
        notifications.map((n) => (
          <Box key={n.ID} onClick={() => handleCardView(n.ID)}>
            <NotificationCard notification={n} isUnread={!isRead(n.ID)} />
          </Box>
        ))}
    </Box>
  );
}

export default AllNotificationsPage;