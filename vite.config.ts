/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import {
  handlePaymentProposalRequest,
  handleAccommodationRequest,
  handleSaveIntentRequest,
  handleOutboxListRequest,
  handleAdminStreamRequest,
  handleAdminOverviewRequest,
  handleGetSessionRequest,
  handleDevSessionRequest,
  handleDevIdentitiesRequest,
  handleLogoutRequest,
} from './server';

function bmoniDevPlugin(): Plugin {
  return {
    name: 'bmoni-dev-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/payments/proposal' && req.method === 'POST') {
          handlePaymentProposalRequest(req, res);
        } else if (url === '/api/accommodation/responsibility' && req.method === 'GET') {
          handleAccommodationRequest(req, res);
        } else if (url === '/api/payments/intents' && req.method === 'POST') {
          handleSaveIntentRequest(req, res);
        } else if (url === '/api/accommodation/admin/stream' && req.method === 'GET') {
          handleAdminStreamRequest(req, res);
        } else if (url === '/api/accommodation/admin/overview' && req.method === 'GET') {
          handleAdminOverviewRequest(req, res);
        } else if (url === '/api/accommodation/outbox' && req.method === 'GET') {
          handleOutboxListRequest(req, res);
        } else if (url === '/api/auth/session' && req.method === 'GET') {
          handleGetSessionRequest(req, res);
        } else if (url === '/api/auth/dev-session' && req.method === 'POST') {
          handleDevSessionRequest(req, res);
        } else if (url === '/api/auth/dev-identities' && req.method === 'GET') {
          handleDevIdentitiesRequest(req, res);
        } else if (url === '/api/auth/logout' && req.method === 'POST') {
          handleLogoutRequest(req, res);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), bmoniDevPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});


