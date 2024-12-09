import UserHandler from './handlers/userHandler.js';
import WebSocketHandler from './handlers/websocketHandler.js';
import MQTTHandler from './handlers/MQTTHandler.js';

class VendingMachineSystem {
    constructor(config) {
        this.config = {
            mqttBrokerUrl: config.mqttBrokerUrl,
            mqttUsername: config.mqttUsername,
            mqttPassword: config.mqttPassword,
            topics: ['vending/+/auth', 'vending/+/point', 'vending/+/reset', 'vending/+/register'],
            qos: 1,
        };
        this.clientSubscriptions = {};
        this.userHandler = new UserHandler(this);
        this.webSocketHandler = new WebSocketHandler(this);
        this.mqttHandler = new MQTTHandler(this);
    }

    setupWebSocket(server) {
        this.webSocketHandler.setup(server);
    }

    setupMQTT() {
        this.mqttHandler.setup(this.config);
    }

    publishToMQTT(topic, message) {
        this.mqttHandler.publish(topic, message);
    }

    notifyWebSocketClient(deviceId, message) {
        this.webSocketHandler.notifyClient(deviceId, message);
    }

    cleanup() {
        this.webSocketHandler.cleanup();
        this.mqttHandler.cleanup();
    }
}

export default VendingMachineSystem;
