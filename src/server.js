import express from 'express';
import http from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import {  ErrorHandler } from './middleware/ErrorHandler.js';
import VendingMachineSystem from './iot/index.js';

import usersRoutes from './routes/users.route.js';
import itemsRoutes from './routes/items.route.js';
import authRoutes from './routes/auth.route.js';
import vendingRoutes from './routes/vending.route.js';
import payRoutes from './routes/pay.route.js';

class AppServer {
    constructor() {
        dotenv.config();
        this.PORT = process.env.PORT || 4000;
        this.app = express();
        this.server = http.createServer(this.app);
        this.vendingSystem = null;
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
    }

    setupRoutes() {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/user', usersRoutes);
        this.app.use('/api/item', itemsRoutes);
        this.app.use('/api/vending', vendingRoutes);
        this.app.use('/api/transaction', payRoutes);

        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                statusCode: 200,
                message: 'Welcome to the SAMPAHMAS API, go to /api',
            });
        });

        this.app.post('/api/endpoint', (req, res) => {
            const { message } = req.body;
            console.log(`Received message from Python API: ${message}`);
            res.status(200).json({ success: true });
        });

        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'API route not found',
            });
        });

        this.app.use(ErrorHandler);
    }

    setupVendingSystem() {
        const config = {
            mqttBrokerUrl: process.env.MQTT_BROKER_URL,
            mqttUsername: process.env.MQTT_USERNAME,
            mqttPassword: process.env.MQTT_PASSWORD
        };

        this.vendingSystem = new VendingMachineSystem(config);
        this.vendingSystem.setupMQTT();
        this.vendingSystem.setupWebSocket(this.server);
    }
    setupErrorHandling() {
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            this.restart('Uncaught Exception');
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            this.restart('Unhandled Rejection');
        });

        process.on('SIGTERM', () => {
            console.log('Received SIGTERM signal');
            this.restart('SIGTERM');
        });

        process.on('SIGINT', () => {
            console.log('Received SIGINT signal');
            this.restart('SIGINT');
        });
    }

    async restart(reason) {
        console.log(`Initiating server restart due to: ${reason}`);
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;
            console.log(`Restart attempt ${attempts} of ${maxAttempts}...`);

            try {
                if (this.vendingSystem) {
                    console.log('Cleaning up vending system...');
                    await this.vendingSystem.cleanup();
                }

                if (this.server) {
                    console.log('Closing existing server...');
                    await new Promise((resolve) => {
                        this.server.close(resolve);
                    });
                }

                console.log('Reinitializing server components...');
                this.server = http.createServer(this.app);

                this.setupMiddleware();
                this.setupRoutes();
                this.setupVendingSystem();

                await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay before restarting

                this.server.listen(this.PORT, () => {
                    console.log(`Server restarted successfully on port ${this.PORT}`);
                });

                console.log('Server restart completed successfully');
                return;
            } catch (error) {
                console.error(`Error during restart attempt ${attempts}:`, error);
            }
        }

        console.error(`Failed to restart the server after ${maxAttempts} attempts. Exiting...`);
        process.exit(1);
    }


    start() {
        this.setupMiddleware();
        this.setupRoutes();
        this.setupVendingSystem();
        this.setupErrorHandling();

        this.server.listen(this.PORT, () => {
            console.log(`Server running on port ${this.PORT}`);
        });
    }
}

const appServer = new AppServer();
appServer.start();

export default appServer;