import mqttClient from './mqttClient.js';
import { handleMQTTMessage } from './mqtt.service.js';

const topics = ['vending/+/auth', 'vending/+/point', 'vending/+/reset'];

export function setupMQTT() {
    const qos = 2;

    mqttClient.subscribe(topics, { qos }, (error) => {
        if (error) {
            console.log('Subscribe error:', error);
        } else {
            console.log(`Subscribed to topics: ${topics.join(', ')}`);
        }
    });

    mqttClient.on('message', (receivedTopic, message) => {
        handleMQTTMessage(receivedTopic, message);
    });
}
