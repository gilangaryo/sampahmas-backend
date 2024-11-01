import mqttClient from './mqttClient.js';
import { handleRFIDAuthentication, handlePointData } from '../helper/iotHandler.js';
import { clientSubscriptions } from './mqtt.controller.js';

export async function handleMQTTMessage(topic, message) {
    const payloadString = message.toString();
    console.log(`Received message on topic ${topic}: ${payloadString}`);

    let data;
    try {
        data = JSON.parse(payloadString);
    } catch (error) {
        console.error('Failed to parse message payload:', error);
        return;
    }

    const topicParts = topic.split('/');
    if (topicParts.length >= 3 && topicParts[0] === 'vending') {
        const deviceId = topicParts[1];
        const action = topicParts[2];

        if (action === 'auth') {
            const result = await handleRFIDAuthentication(deviceId, data);
            const responseTopic = `vending/${deviceId}/authResult`;

            mqttClient.publish(responseTopic, JSON.stringify(result), { qos: 2 }, (error) => {
                if (error) {
                    console.error(`Failed to publish authResult to ${responseTopic}:`, error);
                } else {
                    console.log(`Successfully published authResult to ${responseTopic}`);
                }
            });

            const client = clientSubscriptions[deviceId];
            if (client && client.readyState === client.OPEN) {
                client.send(JSON.stringify(result));
            } else {
                console.warn(`No WebSocket client connected for device ${deviceId}`);
            }
        } else if (action === 'point') {
            const result = await handlePointData(deviceId, data);
            const responseTopic = `vending/${deviceId}/pointResult`;

            mqttClient.publish(responseTopic, JSON.stringify(result), { qos: 2 }, (error) => {
                if (error) {
                    console.error(`Failed to publish pointResult to ${responseTopic}:`, error);
                } else {
                    console.log(`Successfully published pointResult to ${responseTopic}`);
                }
            });

            const client = clientSubscriptions[deviceId];
            if (client && client.readyState === client.OPEN) {
                client.send(JSON.stringify(result));
            } else {
                console.warn(`No WebSocket client connected for device ${deviceId}`);
            }
        }
    } else {
        console.warn(`Received message on unexpected topic format: ${topic}`);
    }
}