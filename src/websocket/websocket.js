// websocket.js
import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './websocket.controller.js';

export function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection.');
        handleWebSocketConnection(ws);
    });
}
