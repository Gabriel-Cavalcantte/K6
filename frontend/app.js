const API_URL = window.location.origin.includes('localhost:8080')
  ? 'http://localhost:3000'
  : `http://${window.location.hostname}:3000`;

const elements = {
  bookForm: document.getElementById('bookForm'),
  booksList: document.getElementById('booksList'),
  booksTable: document.getElementById('booksTable'),
  emptyState: document.getElementById('emptyState'),
  message: document.getElementById('message'),
  loading: document.getElementById('loading'),
  editModal: document.getElementById('editModal'),
  editForm: document.getElementById('editForm'),
  editId: document.getElementById('editId'),
  editTitle: document.getElementById('editTitle'),
  editAuthor: document.getElementById('editAuthor'),
  editIsbn: document.getElementById('editIsbn'),
  editYear: document.getElementById('editYear'),
  editStock: document.getElementById('editStock'),
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  elements.bookForm.addEventListener('submit', handleCreateBook);
  elements.editForm.addEventListener('submit', handleUpdateBook);
  loadBooks();
});

async function loadBooks() {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/api/books`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      renderBooks(data.data);
      elements.booksTable.style.display = 'table';
      elements.emptyState.style.display = 'none';
    } else {
      elements.booksTable.style.display = 'none';
      elements.emptyState.style.display = 'block';
    }
  } catch (error) {
    showMessage('Error loading books. Check if the API is running.', 'error');
    console.error('Load error:', error);
  } finally {
    showLoading(false);
  }
}

function renderBooks(books) {
  elements.booksList.innerHTML = books.map(book => `
    <tr>
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn || '-'}</td>
      <td>${book.year || '-'}</td>
      <td>${book.stock}</td>
      <td>
        <button class="button btn-edit" onclick="openEditModal(${book.id})">Edit</button>
        <button class="button btn-danger" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function handleCreateBook(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    isbn: document.getElementById('isbn').value || undefined,
    year: document.getElementById('year').value ? parseInt(document.getElementById('year').value) : undefined,
    stock: parseInt(document.getElementById('stock').value) || 0,
  };

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create book');
    }

    showMessage('Book added successfully!', 'success');
    elements.bookForm.reset();
    loadBooks();
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
    console.error('Create error:', error);
  } finally {
    showLoading(false);
  }
}

async function openEditModal(id) {
  try {
    const response = await fetch(`${API_URL}/api/books/${id}`);
    const book = await response.json();

    if (!response.ok) {
      throw new Error('Failed to load book');
    }

    elements.editId.value = book.id;
    elements.editTitle.value = book.title;
    elements.editAuthor.value = book.author;
    elements.editIsbn.value = book.isbn || '';
    elements.editYear.value = book.year || '';
    elements.editStock.value = book.stock;

    elements.editModal.classList.add('show');
  } catch (error) {
    showMessage('Error loading book details', 'error');
    console.error('Edit load error:', error);
  }
}

function closeEditModal() {
  elements.editModal.classList.remove('show');
}

async function handleUpdateBook(e) {
  e.preventDefault();

  const id = elements.editId.value;
  const updateData = {
    title: elements.editTitle.value,
    author: elements.editAuthor.value,
    isbn: elements.editIsbn.value || undefined,
    year: elements.editYear.value ? parseInt(elements.editYear.value) : undefined,
    stock: parseInt(elements.editStock.value) || 0,
  };

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update book');
    }

    showMessage('Book updated successfully!', 'success');
    closeEditModal();
    loadBooks();
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
    console.error('Update error:', error);
  } finally {
    showLoading(false);
  }
}

async function deleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) {
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete book');
    }

    showMessage('Book deleted successfully!', 'success');
    loadBooks();
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
    console.error('Delete error:', error);
  } finally {
    showLoading(false);
  }
}

function showMessage(text, type) {
  elements.message.textContent = text;
  elements.message.className = `message ${type}`;

  setTimeout(() => {
    elements.message.className = 'message';
  }, 4000);
}

function showLoading(show) {
  elements.loading.classList.toggle('show', show);
}

// Close modal when clicking outside
elements.editModal.addEventListener('click', (e) => {
  if (e.target === elements.editModal) {
    closeEditModal();
  }
});
