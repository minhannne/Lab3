
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const squads = {
  ces: {
    id: 'ces',
    name: 'Cerberus Esports',
    map: 'Erangel',
    phase: 'Phase 6',
    alive: 4,
    kills: 14,
    wwcdProb: '68%',
    status: 'In Safe Zone',
  },
  te: {
    id: 'te',
    name: 'The Expendables',
    map: 'Miramar',
    phase: 'Phase 7',
    alive: 6,
    kills: 18,
    wwcdProb: '85%',
    status: 'Holding High Ground',
  },
  ge: {
    id: 'ge',
    name: 'Genius Esports',
    map: 'Taego',
    phase: 'Phase 5',
    alive: 3,
    kills: 9,
    wwcdProb: '41%',
    status: 'Rotating Blue Zone',
  },
};

function mockTelemetryApi() {
  return {
    name: 'mock-pubg-telemetry-api',

    configureServer(server) {
      server.middlewares.use('/api/telemetry', (req, res) => {
        const url = new URL(
          req.url || '/',
          'http://localhost'
        );

        const squadId = url.searchParams.get('squadId');
        const squad = squads[squadId];

        res.setHeader(
          'Content-Type',
          'application/json; charset=utf-8'
        );
        res.setHeader('Cache-Control', 'no-store');

        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end(JSON.stringify({
            message: 'Method not allowed.',
          }));
          return;
        }

        if (!squad) {
          res.statusCode = 404;
          res.end(JSON.stringify({
            message: 'Squad not found.',
          }));
          return;
        }

        // Simulate telemetry processing and network latency.
        const timer = setTimeout(() => {
          if (res.destroyed) {
            return;
          }

          const affectedMaps = ['Erangel', 'Miramar'];

          // Simulate 35% packet loss on the required maps.
          if (
            affectedMaps.includes(squad.map) &&
            Math.random() < 0.35
          ) {
            res.statusCode = 503;
            res.end(JSON.stringify({
              message:
                'Satellite packet loss detected. Please reconnect.',
            }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify(squad));
        }, 1500);

        // Stop unnecessary server work when the client
        // cancels or closes the request.
        res.on('close', () => {
          clearTimeout(timer);
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    mockTelemetryApi(),
  ],
});
