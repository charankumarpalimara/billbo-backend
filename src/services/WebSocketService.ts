import { WebSocket } from 'ws';
import { TVService } from './TVService';
import { Store } from '../models/Store';
import { logger } from '../utils/logger';

export class WebSocketService {
  private static instance: WebSocketService;
  private tvClients = new Map<string, WebSocket>();
  private dashboardClients = new Set<WebSocket>();
  private tvService = new TVService();

  private constructor() { }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public handleConnection(ws: WebSocket) {
    logger.info('New WebSocket connection established');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case 'register_tv':
            await this.registerTV(data.tvCode, ws);
            break;
          case 'register_dashboard':
            this.registerDashboard(ws);
            break;
          case 'control_command':
            this.forwardControlCommand(data.tvCode, data.command, data.value, ws);
            break;
          default:
            logger.warn(`Unknown WS event type: ${data.type}`);
        }
      } catch (error) {
        logger.error('Error handling WebSocket message', error);
      }
    });

    ws.on('close', () => {
      this.handleClose(ws);
    });
  }

  private async registerTV(tvCode: string, ws: WebSocket) {
    if (!tvCode) return;
    this.tvClients.set(tvCode, ws);
    logger.info(`TV Registered: ${tvCode}`);

    await this.tvService.updateTVStatus(tvCode, 'online');
    this.broadcastToDashboards({ type: 'tv_status_change', tvCode, status: 'online' });
  }

  private registerDashboard(ws: WebSocket) {
    this.dashboardClients.add(ws);
    logger.info('Dashboard client connected');

    // Send list of active TVs
    const activeTvCodes = Array.from(this.tvClients.keys());
    ws.send(JSON.stringify({ type: 'active_tvs', activeTvCodes }));
  }

  private async forwardControlCommand(tvCode: string, command: string, value: any, dashboardWs: WebSocket) {
    let targetTvSocket = this.tvClients.get(tvCode);

    // Fallback: If TV socket is not found directly by tvCode (e.g. TV-103),
    // check if the TV's store code (e.g. STR_102) has a registered client.
    if (!targetTvSocket) {
      try {
        const tv = await this.tvService.getTVByTvCode(tvCode);
        if (tv && tv.storeId) {
          // 1. Try finding socket registered under storeId string
          targetTvSocket = this.tvClients.get(tv.storeId.toString());

          if (!targetTvSocket) {
            // 2. Try finding socket registered under storeCode (e.g. STR_102)
            const store = await Store.findById(tv.storeId).exec();
            if (store && store.storeCode) {
              targetTvSocket = this.tvClients.get(store.storeCode);
              if (targetTvSocket) {
                logger.info(`Fallback: Found client socket for TV "${tvCode}" registered under Store Code "${store.storeCode}"`);
              }
            }
          } else {
            logger.info(`Fallback: Found client socket for TV "${tvCode}" registered under Store ID "${tv.storeId}"`);
          }
        }
      } catch (err) {
        logger.error('Error in WebSocket TV fallback routing:', err);
      }
    }

    if (targetTvSocket && targetTvSocket.readyState === WebSocket.OPEN) {
      targetTvSocket.send(JSON.stringify({ type: 'command', command, value }));
      logger.info(`Forwarded command "${command}" to TV "${tvCode}"`);
      console.log(`⚡ [WEBSOCKET] Successfully forwarded command "${command}" to TV "${tvCode}"`);
    } else {
      logger.warn(`Failed to send command: TV "${tvCode}" is offline`);
      console.log(`❌ [WEBSOCKET] Failed to forward command: TV "${tvCode}" is offline`);
      dashboardWs.send(JSON.stringify({ type: 'error', message: `TV ${tvCode} is offline.` }));
    }
  }

  private handleClose(ws: WebSocket) {
    for (const [tvCode, socket] of this.tvClients.entries()) {
      if (socket === ws) {
        this.tvClients.delete(tvCode);
        logger.info(`TV connection closed: ${tvCode}`);
        this.tvService.updateTVStatus(tvCode, 'offline');
        this.broadcastToDashboards({ type: 'tv_status_change', tvCode, status: 'offline' });
        break;
      }
    }
    this.dashboardClients.delete(ws);
  }

  public broadcastToDashboards(payload: any) {
    const message = JSON.stringify(payload);
    this.dashboardClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
