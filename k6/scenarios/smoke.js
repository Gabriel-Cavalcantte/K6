import http from 'k6/http';
import { sleep } from 'k6';
import { options } from '../options/smoke-options.js';
import { generateRandomBook, API_BASE_URL } from '../helpers/data.js';
import { validateListResponse, validateCreateResponse, validateErrorResponse, validateDeleteResponse } from '../helpers/checks.js';

export { options };

export default function () {
  // Test 1: GET /api/books (list all books)
  const listRes = http.get(`${API_BASE_URL}/api/books`);
  validateListResponse(listRes);
  sleep(1);

  // Test 2: POST /api/books (create a new book)
  const newBook = generateRandomBook();
  const createRes = http.post(
    `${API_BASE_URL}/api/books`,
    JSON.stringify(newBook),
    { headers: { 'Content-Type': 'application/json' } }
  );
  validateCreateResponse(createRes);

  let bookId = null;
  try {
    const body = JSON.parse(createRes.body);
    bookId = body.id;
  } catch (e) {
    console.error('Failed to parse create response:', e);
  }
  sleep(1);

  // Test 3: GET /api/books/{id} (get specific book)
  if (bookId) {
    const getRes = http.get(`${API_BASE_URL}/api/books/${bookId}`);
    validateListResponse(getRes);
    sleep(1);

    // Test 4: PUT /api/books/{id} (update book)
    const updateBook = {
      title: `${newBook.title} - Updated`,
      stock: 99,
    };
    const updateRes = http.put(
      `${API_BASE_URL}/api/books/${bookId}`,
      JSON.stringify(updateBook),
      { headers: { 'Content-Type': 'application/json' } }
    );
    validateListResponse(updateRes);
    sleep(1);

    // Test 5: DELETE /api/books/{id} (delete book)
    const deleteRes = http.del(`${API_BASE_URL}/api/books/${bookId}`);
    validateDeleteResponse(deleteRes);
    sleep(1);
  }

  // Test 6: Verify book was deleted (404)
  if (bookId) {
    const notFoundRes = http.get(`${API_BASE_URL}/api/books/${bookId}`);
    validateErrorResponse(notFoundRes, 404);
  }

  sleep(2);
}
