import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Load aggregated routes under /api
app.use('/api', routes);

// Global Error Handler middleware
app.use(errorHandler);

export default app;
