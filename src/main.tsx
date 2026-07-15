import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global Fetch Interceptor to attach Authorization Bearer Header automatically for /api requests
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input && typeof input === 'object' && 'url' in input) {
    url = (input as any).url;
  }

  const isApi = url.startsWith('/api') || url.startsWith('api') || url.includes('/api/');
  if (isApi) {
    const token = localStorage.getItem('clean24_access_token');
    if (token) {
      if (typeof input === 'string') {
        init = init || {};
        const headers = new Headers(init.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        init.headers = headers;
      } else if (input instanceof Request) {
        if (!input.headers.has('Authorization')) {
          input.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    }
  }

  const response = await originalFetch.call(this, input, init);

  if (response.status === 401 && isApi && !url.includes('/api/auth/login')) {
    const hasToken = !!localStorage.getItem('clean24_access_token');
    if (hasToken) {
      localStorage.removeItem('clean24_access_token');
      localStorage.removeItem('clean24_refresh_token');
      localStorage.removeItem('clean24_user_session');
      window.dispatchEvent(new Event('unauthorized-session-expired'));
    }
  }

  return response;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

