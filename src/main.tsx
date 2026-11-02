import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against browser extension injection errors modifying window properties
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('fetch')) {
    event.preventDefault();
    return true;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && String(event.reason).includes('fetch')) {
    event.preventDefault();
    return true;
  }
});

createRoot(document.getElementById('root')!).render(<App />);
