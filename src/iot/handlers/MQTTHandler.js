import mqtt from 'mqtt';
class MQTTHandler {
    constructor(system) {
        this.system = system;
        this.mqttClient = null;
    }

    setup(config) {
        const mqttOptions = {
            clientId: 'server_nodejs_' + Math.random().toString(16).substring(2, 8),
            username: config.mqttUsername,
            password: config.mqttPassword,
            clean: true,
            reconnectPeriod: 1000,
        };

        this.mqttClient = mqtt.connect(config.mqttBrokerUrl, mqttOptions);

        this.mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.subscribe(config.topics, config.qos);
        });

        this.mqttClient.on('error', (err) => console.error('MQTT connection error:', err));
        this.mqttClient.on('message', (topic, message) => this.handleMessage(topic, message));
    }
    
    subscribe(topics, qos) {
        this.mqttClient.subscribe(topics, { qos }, (error) => {
            if (error) console.error('MQTT subscription error:', error);
            else console.log(`Subscribed to topics: ${topics.join(', ')}`);
        });
    }

    publish(topic, message) {
        this.mqttClient.publish(topic, JSON.stringify(message), { qos: 2 }, (error) => {
            if (error) {
                console.error(`Failed to publish to ${topic}:`, error);
            } else {
                console.log(`Successfully published to ${topic}`);
            }
        });
    }
    
    handleMessage(topic, message) {
        const payloadString = message.toString();
        console.log(`Received message on topic ${topic}: ${payloadString}`);

        let data;
        try {
            data = JSON.parse(payloadString);
        } catch (error) {
            console.error('Failed to parse message payload:', error);
            return;
        }

        const [type, deviceId, action] = topic.split('/');
        if (type !== 'vending') {
            console.warn(`Received message on unexpected topic format: ${topic}`);
            return;
        }

        try {
            switch (action) {
                case 'auth':
                    console.log(`[MQTT] Received AUTH command for device ${deviceId}`);
                    this.system.userHandler.handleAuth(deviceId, data);
                    break;
                case 'point':
                    console.log(`[MQTT] Received POINT command for device ${deviceId}`);
                    this.system.userHandler.handlePoint(deviceId, data);
                    break;
                case 'reset':
                    console.log(`[MQTT] Received RESET command for device ${deviceId}`);
                    break;
                case 'register':
                    this.system.userHandler.handleRegisterMQTT(deviceId, data);
                    console.log(`[MQTT] Received REGISTER command for device ${deviceId} -- ${data.rfid}`);
                    break;
                default:
                    console.warn("MQTT topic tidak match: ", action);
            }
        } catch (error) {
            console.error(`Error handling MQTT message for ${action}:`, error);
        }
    }

    cleanup() {
        if (this.mqttClient) {
            this.mqttClient.end(() => console.log('MQTT client disconnected'));
        }
    }
}



export default MQTTHandler;
