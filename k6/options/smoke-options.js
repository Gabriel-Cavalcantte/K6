export const options = {
  stages: [
    { duration: '30s', target: 2 },
    { duration: '30s', target: 2 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95'],
  },
  setupTimeout: '60s',
  teardownTimeout: '60s',
};
