import http from 'k6/http';
import { sleep, check } from 'k6';
import { options } from '../options/stress-options.js';
import { generateRandomBook, API_BASE_URL } from '../helpers/data.js';

export { options };

export default function () {
  // Stress test with lighter payloads
  // Mostly GETs with occasional POST/PUT/DELETE

  // Primarily test list endpoint (lightweight)
  const listRes = http.get(`${API_BASE_URL}/api/books`);
  check(listRes, {
    'list status 200': (r) => r.status === 200,
  });
  sleep(Math.random() * 0.5); // 0-0.5 second sleep

  // Occasionally create a book (heavyweight operation)
  if (Math.random() < 0.1) { // 10% of the time
    const newBook = generateRandomBook();
    const createRes = http.post(
      `${API_BASE_URL}/api/books`,
      JSON.stringify(newBook),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(createRes, {
      'create status 201': (r) => r.status === 201,
    });

    // Try to delete it immediately
    try {
      const body = JSON.parse(createRes.body);
      if (body.id) {
        const deleteRes = http.delete(`${API_BASE_URL}/api/books/${body.id}`);
        check(deleteRes, {
          'delete status 200': (r) => r.status === 200,
        });
      }
    } catch (e) {
      // Ignore parse errors under stress
    }
  }

  sleep(Math.random() * 0.2);
}
