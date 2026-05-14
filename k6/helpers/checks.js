import { check } from 'k6';

export function validateBookResponse(response, expectedStatus = 200) {
  return check(response, {
    'status is correct': (r) => r.status === expectedStatus,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
    'response body exists': (r) => r.body.length > 0,
  });
}

export function validateListResponse(response) {
  return check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has data array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.data);
      } catch {
        return false;
      }
    },
    'has pagination': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.pagination && body.pagination.total !== undefined;
      } catch {
        return false;
      }
    },
  });
}

export function validateCreateResponse(response) {
  return check(response, {
    'status is 201': (r) => r.status === 201,
    'has id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id && typeof body.id === 'number';
      } catch {
        return false;
      }
    },
    'has title': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.title && body.title.length > 0;
      } catch {
        return false;
      }
    },
    'has author': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.author && body.author.length > 0;
      } catch {
        return false;
      }
    },
  });
}

export function validateDeleteResponse(response) {
  return check(response, {
    'status is 200': (r) => r.status === 200,
    'success is true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    },
    'has id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id && typeof body.id === 'number';
      } catch {
        return false;
      }
    },
  });
}

export function validateErrorResponse(response, expectedStatus) {
  return check(response, {
    `status is ${expectedStatus}`: (r) => r.status === expectedStatus,
    'has error message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.error && body.error.length > 0;
      } catch {
        return false;
      }
    },
  });
}
