import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import { seedDatabase } from './utils/seeder';
import { WebSocketService } from './services/WebSocketService';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Initialize Database connection
connectDB().then(() => {
  seedDatabase();
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });
const wsService = WebSocketService.getInstance();

// Handle upgrade connection request to WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  wsService.handleConnection(ws);
});

// Start listening
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
