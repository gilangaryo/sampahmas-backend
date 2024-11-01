import { clientSubscriptions, publishResetCommand } from '../mqtt/mqtt.controller.js';
import { handleQRCodeAuthentication, updatePointUser } from './websocket.service.js';

export function handleWebSocketConnection(ws) {
    ws.on('message', async (message) => {
        let data;
        try {
            data = JSON.parse(message);
            console.log("Received data:", data);
        } catch (error) {
            console.error("Failed to parse message:", error);
            ws.send(JSON.stringify({ message: 'Invalid message format' }));
            return;
        }

        const { action, deviceId, userId, counter } = data;

        console.log("Action:", action, "Device ID:", deviceId, "User ID:", userId, "Counter:", counter);

        switch (action) {
            case 'subscribe':
                clientSubscriptions[deviceId] = ws;
                console.log(`Client subscribed to vending machine: ${deviceId}`);
                ws.send(JSON.stringify({ message: 'Subscription to auth vending machine successful' }));
                break;

            case 'point':
                clientSubscriptions[deviceId] = ws;
                ws.send(JSON.stringify({ message: 'Subscription to point vending machine successful' }));
                break;

            case 'reset':
                console.log('Reset request received');
                updatePointUser(userId, counter);
                publishResetCommand(deviceId);
                break;

            case 'auth':
                console.log('Auth request received');
                try {
                    const authResult = await handleQRCodeAuthentication(deviceId, data);
                    ws.send(JSON.stringify(authResult));
                } catch (error) {
                    console.error("Error handling QR code authentication:", error);
                    ws.send(JSON.stringify({
                        action: 'auth',
                        result: 'Error',
                        status: false,
                        message: 'Authentication processing failed'
                    }));
                }
                break;

            default:
                console.warn("Unknown action:", action);
                ws.send(JSON.stringify({ message: 'Unknown action' }));
        }
    });

    ws.on('close', () => {
        for (const deviceId in clientSubscriptions) {
            if (clientSubscriptions[deviceId] === ws) {
                delete clientSubscriptions[deviceId];
                console.log(`Client unsubscribed from vending machine: ${deviceId}`);
                break;
            }
        }
    });
}
