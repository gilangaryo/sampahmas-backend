// import express from 'express';
// import http from 'http';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import mqtt from 'mqtt';
// import ErrorHandler from './src/middleware/errorHandler.js';

// import usersRoutes from './src/routes/users.route.js';
// import itemsRoutes from './src/routes/items.route.js';
// import authRoutes from './src/routes/auth.route.js';
// import pointRoutes from './src/routes/point.route.js';
// import vendingRoutes from './src/routes/vending.route.js';
// import userRepository from './src/users/users.repository.js';
// import { WebSocketServer } from 'ws';

// dotenv.config();

// const PORT = process.env.PORT || 3000;
// const app = express();
// const server = http.createServer(app);

// const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
// const mqttOptions = {
//     clientId: 'server_nodejs_' + Math.random().toString(16).substring(2, 8),
//     username: 'sampahmas',
//     password: 'sampahmas123',
// };


// const wss = new WebSocketServer({ server });
// const clientSubscriptions = {};

// wss.on('connection', (ws) => {
//     console.log('New WebSocket connection established.');

//     ws.on('message', (message) => {
//         const data = JSON.parse(message);

//         if (data.action === 'subscribe') {
//             const deviceId = data.deviceId;
//             console.log(`Client subscribed to vending machine: ${deviceId}`);

//             clientSubscriptions[deviceId] = ws;

//             ws.send(JSON.stringify({ message: 'Subscription to vending machine successful' }));
//         }
//     });

//     ws.on('close', () => {
//         for (const deviceId in clientSubscriptions) {
//             if (clientSubscriptions[deviceId] === ws) {
//                 delete clientSubscriptions[deviceId];
//                 console.log(`Client unsubscribed from vending machine: ${deviceId}`);
//                 break;
//             }
//         }
//     });
// });



// const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

// mqttClient.on('connect', () => {
//     console.log('Connected to MQTT broker');

//     const topic = 'vending/+/auth'
//     const pointTopic = 'vending/+/point'
//     const qos = 2

//     mqttClient.subscribe([topic, pointTopic], { qos }, (error) => {
//         if (error) {
//             console.log('subscribe error:', error)
//             return
//         }
//         console.log(`Subscribe to topic '${topic}'`)
//     })
// });

// mqttClient.on('message', (topic, message) => {
//     const payloadString = message.toString();
//     console.log(`Received message on topic ${topic}: ${payloadString}`);

//     const data = JSON.parse(payloadString);
//     console.log(data);

//     const topicParts = topic.split('/');
//     if (topicParts.length >= 3 && topicParts[0] === 'vending') {
//         const deviceId = topicParts[1];
//         const action = topicParts[2];

//         if (action === 'point') {
//             console.log(`Handling point data for device: ${deviceId}`);

//             const client = clientSubscriptions[deviceId];
//             if (client && client.readyState === client.OPEN) {
//                 client.send(JSON.stringify({
//                     data
//                 }));
//             } else {
//                 console.log(`No client subscribed to vending machine: ${deviceId}`);
//             }
//         }
//     } else {
//         console.warn(`Received message on unexpected topic format: ${topic}`);
//     }
// });


// const handleRFIDAuthentication = async (deviceId, payload) => {
//     let data;

//     try {
//         data = JSON.parse(payload);
//     } catch (error) {
//         console.error('Failed to parse JSON:', error);
//         return;
//     }

//     const RFID = data.rfidTag;
//     const user = await userRepository.getUserByRFID(RFID);

//     console.log(`Authentication attempt for device ${deviceId}:`, user);

//     const responseTopic = `vending/${deviceId}/authResult`;

//     if (user !== null) {
//         mqttClient.publish(
//             responseTopic,
//             JSON.stringify({ result: 'Authorized', accessToken: 'ABCDEFG' }),
//             (error) => {
//                 if (error) {
//                     console.error('Failed to publish message:', error);
//                 } else {
//                     console.log(`Authorized message published successfully to ${responseTopic}`);
//                 }
//             }
//         );
//     } else {
//         mqttClient.publish(
//             responseTopic,
//             JSON.stringify({ result: 'Not Authorized' }),
//             { qos },
//             (error) => {
//                 if (error) {
//                     console.error('Failed to publish message:', error);
//                 } else {
//                     console.log(`Not Authorized message published successfully to ${responseTopic}`);
//                 }
//             }
//         );
//     }
// };

// const handlePointData = (deviceId, payload) => {
//     let pointData;
//     try {
//         pointData = JSON.parse(payload);
//     } catch (error) {
//         console.error('Failed to parse JSON:', error);
//         return;
//     }
//     console.log(`Received point data from device ${deviceId}: ${JSON.stringify(pointData)}`);
//     // Further processing...
// };



// app.use(express.json());
// app.use(morgan('dev'));
// app.use(cors());

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', usersRoutes);
// app.use('/api/item', itemsRoutes);
// app.use('/api/point', pointRoutes);
// app.use('/api/vending', vendingRoutes);

// app.get('/', (req, res) => {
//     res.json({
//         success: true,
//         statusCode: 200,
//         message: 'Welcome to the SAMPAHMAS API, go to /api',
//     });
// });

// app.post('/api/endpoint', (req, res) => {
//     const { message } = req.body;
//     console.log(`Received message from Python API: ${message}`);

//     res.status(200).json({ success: true });
// });

// app.use((req, res, next) => {
//     res.status(404).json({
//         success: false,
//         message: 'API route not found',
//     });
// });

// app.use(ErrorHandler);

// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
