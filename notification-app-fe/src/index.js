import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setAuthToken } from 'logging-middleware';
import './index.css';

setAuthToken('your real long access_token here');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);