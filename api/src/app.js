import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { httpLogger } from './middleware/logger.js';
import logger from './middleware/logger.js';
import { initializeDatabase } from './db/index.js';
import booksRouter from './routes/books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Swagger file
const swaggerFile = fs.readFileSync(path.join(__dirname, '..', 'swagger.yaml'), 'utf8');
const swaggerDoc = yaml.parse(swaggerFile);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Serve Swagger YAML file
app.get('/swagger.yaml', (req, res) => {
  res.type('application/yaml').send(swaggerFile);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/books', booksRouter);

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  logger.error({ error }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize and start
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();

export default app;
