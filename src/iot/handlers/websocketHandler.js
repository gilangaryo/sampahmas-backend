import { WebSocketServer } from 'ws';

class WebSocketHandler {
    constructor(system) {
        this.system = system;
    }

    setup(server) {
        this.wss = new WebSocketServer({ server });
        this.wss.on('connection', this.handleConnection.bind(this));
        console.log('WebSocket server initialized');
    }

    handleConnection(ws) {
        console.log('New WebSocket connection established');
        ws.on('message', (message) => this.handleMessage(ws, message));
        ws.on('close', () => this.handleClose(ws));
    }

    handleMessage(ws, message) {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error('Invalid WebSocket message:', error);
            ws.send(JSON.stringify({ status: false, message: 'Invalid message format' }));
            return;
        }

        const { action, deviceId } = data;

        try {
            switch (action) {
                case 'subscribe':
                    this.handleSubscribe(ws, deviceId);
                    break;
                case 'auth':
                    this.system.userHandler.handleAuth(deviceId, data);
                    break;
                case 'point':
                    this.system.userHandler.handlePoint(deviceId, data);
                    break;
                case 'reset':
                    this.system.userHandler.handleResetCommand(deviceId, data.userId, data.counter);
                    break;
                case 'register':
                    this.system.userHandler.handleRegister(deviceId, data);
                    break;
                default:
                    ws.send(JSON.stringify({ status: false, message: 'Unknown action' }));
            }
        } catch (error) {
            console.error(`Error handling WebSocket ${action}:`, error);
            ws.send(JSON.stringify({
                status: false,
                message: 'Internal server error',
                error: error.message,
            }));
        }
    }

    handleSubscribe(ws, deviceId) {
        if (!deviceId) {
            throw new Error('Device ID is required for subscription');
        }

        if (this.system.clientSubscriptions[deviceId]) {
            this.system.clientSubscriptions[deviceId].close();
        }

        this.system.clientSubscriptions[deviceId] = ws;
        console.log(`Client subscribed to device: ${deviceId}`);
        ws.send(JSON.stringify({ status: true, message: 'Subscribed successfully', deviceId  }));
    }

    handleClose(ws) {
        for (const [deviceId, client] of Object.entries(this.system.clientSubscriptions)) {
            if (client === ws) {
                delete this.system.clientSubscriptions[deviceId];
                console.log(`Client unsubscribed from device: ${deviceId}`);
            }
        }
    }


    notifyClient(deviceId, message) {
        try {
            const client = this.system.clientSubscriptions[deviceId];
            if (client?.readyState === client?.OPEN) {
                client.send(JSON.stringify(message));
                console.log(`Notification sent to device ${deviceId}`);
            } else {
                console.log(`No active WebSocket connection for device ${deviceId}`);
            }
        } catch (error) {
            console.warn(`Failed to notify WebSocket client for device ${deviceId}:`, error.message);
        }
    }

    notifyWebSocketClient(deviceId, message) {
        try {
            const client = this.clientSubscriptions[deviceId];
            if (client?.readyState === client?.OPEN) {
                client.send(JSON.stringify(message));
                console.log(`Notification sent to device ${deviceId}`);
            } else {
                console.log(`No active WebSocket connection for device ${deviceId}`);
            }
        } catch (error) {
            console.warn(`Failed to notify WebSocket client for device ${deviceId}:`, error.message);
        }
    }
    cleanup() {
        if (this.wss) {
            this.wss.close(() => console.log('WebSocket server closed'));
        }
    }
}

export default WebSocketHandler;
