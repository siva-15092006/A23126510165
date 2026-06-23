import { Card, CardContent, Typography, Chip, Box } from '@mui/material';

const TYPE_COLORS = {
  Placement: 'success',
  Result: 'warning',
  Event: 'info',
};

function NotificationCard({ notification, isUnread }) {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        borderRadius: 3,
        borderLeft: isUnread ? '4px solid #1976d2' : '4px solid transparent',
        bgcolor: isUnread ? '#f5f9ff' : '#fff',
      }}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Chip
            label={notification.Type}
            color={TYPE_COLORS[notification.Type] || 'default'}
            size="small"
          />
          {isUnread && <Chip label="● New" size="small" color="primary" variant="outlined" />}
        </Box>
        <Typography variant="body1" fontWeight={isUnread ? 600 : 400}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NotificationCard;