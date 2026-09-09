/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import {
  handlePaymentProposalRequest,
  handleAccommodationRequest,
  handleSaveIntentRequest,
  handleOutboxListRequest,
  globalOutboxPublisher,
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
          globalOutboxPublisher.handleSseConnection(req, res);
        } else if (url === '/api/accommodation/outbox' && req.method === 'GET') {
          handleOutboxListRequest(req, res);
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


