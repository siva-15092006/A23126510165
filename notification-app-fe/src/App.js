import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityNotificationsPage from './pages/PriorityNotificationsPage';

function NavBar() {
  const location = useLocation();

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          📢 Campus Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            sx={{ textTransform: 'none', fontWeight: location.pathname === '/' ? 700 : 400 }}
          >
            All Notifications
          </Button>
          <Button
            component={Link}
            to="/priority"
            sx={{ textTransform: 'none', fontWeight: location.pathname === '/priority' ? 700 : 400 }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<AllNotificationsPage />} />
        <Route path="/priority" element={<PriorityNotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;