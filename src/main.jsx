import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import PasswordProtect from './PasswordProtect.jsx';
import './index.css';

// Mount the app with password protection
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PasswordProtect>
      <App />
    </PasswordProtect>
  </StrictMode>
);
