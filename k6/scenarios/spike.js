import http from 'k6/http';
import { sleep, check } from 'k6';

// Spike test configuration
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Start with 10 VUs
    { duration: '10s', target: 300 },  // SPIKE! Jump to 300 VUs
    { duration: '10s', target: 300 },  // Hold at 300 VUs
    { duration: '10s', target: 10 },   // Ramp-down
    { duration: '5s', target: 0 },     // Final ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500', 'p(99)<3000'], // Relaxed thresholds for spike
    http_req_failed: ['rate<0.2'], // Accept up to 20% failures during spike
  },
};

const API_BASE_URL = __ENV.API_URL || 'http://api:3000';

export default function () {
  // Very simple, fast requests during spike
  const res = http.get(`${API_BASE_URL}/api/books?limit=5`);
  check(res, {
    'status ok': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  sleep(0.1);
}
