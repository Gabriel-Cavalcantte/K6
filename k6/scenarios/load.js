import http from 'k6/http';
import { sleep } from 'k6';
import { options } from '../options/load-options.js';
import { generateRandomBook, API_BASE_URL } from '../helpers/data.js';
import { validateListResponse, validateCreateResponse, validateDeleteResponse } from '../helpers/checks.js';

export { options };

export default function () {
  // GET /api/books - list all books
  const listRes = http.get(`${API_BASE_URL}/api/books?page=1&limit=20`);
  validateListResponse(listRes);
  sleep(0.5);

  // POST /api/books - create new book
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
    // Continue on parse error
  }
  sleep(0.5);

  // GET /api/books/{id} - get specific book
  if (bookId) {
    const getRes = http.get(`${API_BASE_URL}/api/books/${bookId}`);
    validateListResponse(getRes);
    sleep(0.5);

    // PUT /api/books/{id} - update book
    const updateBook = {
      title: `Updated: ${newBook.title}`,
      stock: Math.floor(Math.random() * 100),
    };
    const updateRes = http.put(
      `${API_BASE_URL}/api/books/${bookId}`,
      JSON.stringify(updateBook),
      { headers: { 'Content-Type': 'application/json' } }
    );
    validateListResponse(updateRes);
    sleep(0.5);

    // DELETE /api/books/{id} - delete book (cleanup)
    const deleteRes = http.del(`${API_BASE_URL}/api/books/${bookId}`);
    validateDeleteResponse(deleteRes);
    sleep(0.5);
  }

  // GET /api/books again for final list check
  const finalListRes = http.get(`${API_BASE_URL}/api/books?page=1&limit=20`);
  validateListResponse(finalListRes);
  sleep(1);
}
