import mqttClient from './mqttClient.js';
import userRepository from '../users/users.repository.js';
export const clientSubscriptions = {};

export async function handleRFIDAuthentication(deviceId, data) {
    try {
        const RFID = data.rfidTag;
        const user = await userRepository.getUserByRFID(RFID);

        if (user) {
            const accessToken = 'ABCDEFG';
            return {
                deviceId: deviceId,
                result: 'Authorized',
                status: true,
                accessToken: accessToken,
                idUser: user.uid,
                name: user.name,
                points: user.points
            };
        } else {
            return {
                result: 'Not Authorized',
                status: false
            };
        }
    } catch (error) {
        console.error('Error handling RFID authentication:', error);
        return {
            result: 'Error',
            status: false
        };
    }
}



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

        switch (action) {
            case 'auth':
                const authResult = await handleRFIDAuthentication(deviceId, data);
                const authResponseTopic = `vending/${deviceId}/authResult`;

                mqttClient.publish(authResponseTopic, JSON.stringify(authResult), { qos: 2 }, (error) => {
                    if (error) {
                        console.error(`Failed to publish authResult to ${authResponseTopic}:`, error);
                    } else {
                        console.log(`Successfully published authResult to ${authResponseTopic}`);
                    }
                });

                const authClient = clientSubscriptions[deviceId];
                if (authClient && authClient.readyState === authClient.OPEN) {
                    authClient.send(JSON.stringify(authResult));
                } else {
                    console.warn(`No WebSocket client connected for device ${deviceId}`);
                }
                break;

            case 'point':
                const pointResult = await handlePointData(deviceId, data);
                const pointResponseTopic = `vending/${deviceId}/pointResult`;

                mqttClient.publish(pointResponseTopic, JSON.stringify(pointResult), { qos: 2 }, (error) => {
                    if (error) {
                        console.error(`Failed to publish pointResult to ${pointResponseTopic}:`, error);
                    } else {
                        console.log(`Successfully published pointResult to ${pointResponseTopic}`);
                    }
                });

                const pointClient = clientSubscriptions[deviceId];
                if (pointClient && pointClient.readyState === pointClient.OPEN) {
                    pointClient.send(JSON.stringify(pointResult));
                } else {
                    console.warn(`No WebSocket client connected for device ${deviceId}`);
                }
                break;


            default:
                console.warn("Unknown action:", action);
        }
    } else {
        console.warn(`Received message on unexpected topic format: ${topic}`);
    }
}
