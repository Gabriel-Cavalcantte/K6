export function generateRandomBook() {
  const titles = [
    'The Go Programming Language',
    'Clean Code',
    'Design Patterns',
    'The Pragmatic Programmer',
    'Code Complete',
    'Refactoring',
    'The Mythical Man-Month',
    'Software Engineering at Google',
    'Cracking the Coding Interview',
    'The Art of Computer Programming',
  ];

  const authors = [
    'Robert C. Martin',
    'Gang of Four',
    'Andrew Hunt',
    'Steve McConnell',
    'Martin Fowler',
    'Frederick P. Brooks Jr.',
    'Googlers',
    'Gayle Laakmann McDowell',
    'Donald Knuth',
    'Robert Griesemer',
  ];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
  const randomYear = Math.floor(Math.random() * (2024 - 1980)) + 1980;
  const randomStock = Math.floor(Math.random() * 100) + 1;

  return {
    title: `${randomTitle} (${Date.now()})`,
    author: randomAuthor,
    isbn: `978-${Math.floor(Math.random() * 10000000000000)}`,
    year: randomYear,
    stock: randomStock,
  };
}

export function generateBulkBooks(count) {
  const books = [];
  for (let i = 0; i < count; i++) {
    books.push(generateRandomBook());
  }
  return books;
}

export const API_BASE_URL = __ENV.API_URL || 'http://localhost:3000';
