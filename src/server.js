import express from 'express';
import http from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import ErrorHandler from './middleware/errorHandler.js';

import usersRoutes from './routes/users.route.js';
import itemsRoutes from './routes/items.route.js';
import authRoutes from './routes/auth.route.js';
import pointRoutes from './routes/point.route.js';
import vendingRoutes from './routes/vending.route.js';
import payRoutes from './routes/pay.route.js';

import { setupWebSocket } from './websocket/websocket.js';
import { setupMQTT } from './mqtt/mqtt.controller.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

setupWebSocket(server);
setupMQTT();


app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// API user routes
app.use('/api/auth', authRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/item', itemsRoutes);
app.use('/api/point', pointRoutes);
app.use('/api/vending', vendingRoutes);
app.use('/api/transaction', payRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        statusCode: 200,
        message: 'Welcome to the SAMPAHMAS API, go to /api',
    });
});

app.post('/api/endpoint', (req, res) => {
    const { message } = req.body;
    console.log(`Received message from Python API: ${message}`);

    res.status(200).json({ success: true });
});

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    });
});

app.use(ErrorHandler);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
