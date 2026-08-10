import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Load aggregated routes under /api
app.use('/api', routes);

// Root health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'TV Control System backend server is running successfully.'
    });
});

// Global Error Handler middleware
app.use(errorHandler);

export default app;
