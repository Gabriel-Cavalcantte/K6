export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp-up to 10 VUs over 1 minute
    { duration: '2m', target: 30 },   // Ramp-up to 30 VUs over 2 minutes
    { duration: '3m', target: 30 },   // Stay at 30 VUs for 3 minutes
    { duration: '1m', target: 10 },   // Ramp-down to 10 VUs over 1 minute
    { duration: '1m', target: 0 },    // Ramp-down to 0 VUs over 1 minute
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.90'],
    http_reqs: ['rate>50'],  // Minimum 50 requests per second
  },
  ext: {
    loadimpact: {
      projectID: 0,
      name: 'k6 Load Test',
    },
  },
};
