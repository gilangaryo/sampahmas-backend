import mqttClient from './mqttClient.js';
import { handleMQTTMessage } from './mqtt.service.js';

export const clientSubscriptions = {};

export function setupMQTT() {
    const topic = 'vending/+/auth';
    const pointTopic = 'vending/+/point';
    const mqttTopicReset = 'vending/+/reset';
    const qos = 2;

    mqttClient.subscribe([topic, pointTopic, mqttTopicReset], { qos }, (error) => {
        if (error) {
            console.log('subscribe error:', error);
            return;
        }
        console.log(`Subscribed to topics '${topic}', '${pointTopic}', and '${mqttTopicReset}'`);
    });

    mqttClient.on('message', (receivedTopic, message) => {
        handleMQTTMessage(receivedTopic, message);
    });
}
