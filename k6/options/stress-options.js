export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Ramp-up to 50 VUs
    { duration: '2m', target: 100 },   // Ramp-up to 100 VUs
    { duration: '2m', target: 200 },   // Ramp-up to 200 VUs - stress level
    { duration: '2m', target: 200 },   // Stay at 200 VUs for 2 minutes
    { duration: '1m', target: 50 },    // Ramp-down
    { duration: '1m', target: 0 },     // Final ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.1'],  // Allow up to 10% failures under stress
    checks: ['rate>0.80'],
  },
};
