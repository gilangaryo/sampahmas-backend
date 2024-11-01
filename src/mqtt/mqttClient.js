import mqtt from 'mqtt';

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const mqttOptions = {
    clientId: 'server_nodejs_' + Math.random().toString(16).substring(2, 8),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clean: true,
    reconnectPeriod: 1000,
};

const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});

mqttClient.on('error', (err) => {
    console.error('Failed to connect to MQTT broker:', err);
});

export default mqttClient;
