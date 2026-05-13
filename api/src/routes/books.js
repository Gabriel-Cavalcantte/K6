import express from 'express';
import { query } from '../db/index.js';
import logger from '../middleware/logger.js';

const router = express.Router();

// GET /api/books - List all books with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM books ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM books');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error listing books');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/books/:id - Get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error({ error }, 'Error fetching book');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/books - Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, year, stock } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const result = await query(
      'INSERT INTO books (title, author, isbn, year, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, isbn || null, year || null, stock || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'ISBN already exists' });
    }
    logger.error({ error }, 'Error creating book');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/books/:id - Update a book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, year, stock } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (author !== undefined) {
      updates.push(`author = $${paramCount++}`);
      values.push(author);
    }
    if (isbn !== undefined) {
      updates.push(`isbn = $${paramCount++}`);
      values.push(isbn);
    }
    if (year !== undefined) {
      updates.push(`year = $${paramCount++}`);
      values.push(year);
    }
    if (stock !== undefined) {
      updates.push(`stock = $${paramCount++}`);
      values.push(stock);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE books SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'ISBN already exists' });
    }
    logger.error({ error }, 'Error updating book');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/books/:id - Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM books WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    logger.error({ error }, 'Error deleting book');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
