import userRepository from '../../users/users.repository.js';

class UserHandler {
    constructor(system) {
        this.system = system;
    }

    async handleAuth(deviceId, data) {
        try {
            let user;
            if (data.rfidTag) {
                user = await userRepository.getUserByRFID(data.rfidTag);
            } else if (data.uid) {
                user = await userRepository.getUserById(data.uid);
            }

            const authResult = this.createAuthResponse(user, deviceId);
            const authResponseTopic = `vending/${deviceId}/authResult`;

            this.system.publishToMQTT(authResponseTopic, authResult);
            this.system.notifyWebSocketClient(deviceId, authResult);

            console.log(`Authentication handled for device ${deviceId}:`, authResult);
        } catch (error) {
            console.error(`Error handling authentication for device ${deviceId}: ${error.message}`, error);

            this.system.notifyWebSocketClient(deviceId, {
                action: 'auth',
                result: 'Error',
                status: false,
                message: error.message,
            });
        }
    }

    async handlePoint(deviceId, data) {
        try {
            if (!data.userId) {
                throw new Error('User ID is required for point action');
            }
            if (typeof data.counter !== 'number' || isNaN(data.counter)) {
                throw new Error('Counter must be a valid number');
            }

            const user = await userRepository.getUserById(data.userId);
            if (!user) {
                throw new Error('User not found');
            }

            const lastCounter = user.lastCounter || 0;
            const newBottles = data.counter - lastCounter;
            const pointsToAdd = newBottles * 100;
            const updatedPoints = user.points + pointsToAdd;

            await Promise.all([
                userRepository.updateLastCounter(data.userId, data.counter),
            ]);

            const pointUpdateMessage = {
                action: 'point',
                deviceId,
                status: true,
                idUser: data.userId,
                counter: data.counter,
                pointsAdded: pointsToAdd,
                totalPoints: updatedPoints,
            };

            this.system.notifyWebSocketClient(deviceId, pointUpdateMessage);
            this.system.publishToMQTT(`vending/${deviceId}/pointResult`, pointUpdateMessage);

        } catch (error) {
            console.error(`Error handling points for device ${deviceId}:`, error.message);
            this.system.notifyWebSocketClient(deviceId, {
                action: 'point',
                result: 'Error',
                status: false,
                message: error.message,
            });
        }
    }


    createAuthResponse(user, deviceId) {
        if (user) {
            return {
                action: 'auth',
                deviceId: deviceId,
                result: 'Authorized',
                status: true,
                accessToken: 'ABCDEFG',
                idUser: user.uid,
                email: user.email,
                phone: user.phone,
                name: user.name,
                rfid: user.rfid,
                points: user.points,
            };
        }
        return {
            action: 'auth',
            deviceId: deviceId,
            result: 'Not Authorized',
            status: false,
        };
    }

    async handleResetCommand(deviceId, userId) {
        try {
            if (!deviceId || !userId) {
                throw new Error('Device ID and User ID are required for reset');
            }

            const user = await userRepository.getUserById(userId);
            if (!user) throw new Error('User not found');

            const lastCounter = user.lastCounter || 0;
            let botolTerkumpul = user.botolTerkumpul;
            const newBottles = lastCounter;
            botolTerkumpul += newBottles;
            
            if (newBottles < 0) {
                throw new Error('Invalid counter value ');
            }

            const pointsToAdd = newBottles * 100;
            const updatedPoints = user.points + pointsToAdd;

            await Promise.all([
                userRepository.updateBottle(userId, botolTerkumpul),
                userRepository.updatePoints(userId, updatedPoints),
                userRepository.updateLastCounter(userId, 0),
            ]);

            const resetMessage = {
                action: 'reset',
                deviceId,
                status: true,
                idUser: userId,
                pointsAdded: pointsToAdd,
                totalPoints: updatedPoints,
                message: 'Reset completed successfully',
            };

            console.log(resetMessage);

            this.system.notifyWebSocketClient(deviceId, resetMessage);
            this.system.publishToMQTT(`vending/${deviceId}/reset`, resetMessage);

            console.log(`Reset completed for user ${userId}: ${pointsToAdd} points added`);
        } catch (error) {
            console.error('Error handling reset command:', error);
            this.system.notifyWebSocketClient(deviceId, {
                action: 'reset',
                result: 'Error',
                status: false,
                message: error.message,
            });
        }
    }

    async handleRegister(deviceId, data) {
        try {
            const { rfid, email, phone } = data;

            // Validate input
            if (!email) {
                throw new Error('Email is invalid or missing');
            }
            if (!phone) {
                throw new Error('Phone is invalid or missing');
            }
            if (!rfid) {
                throw new Error('RFID is invalid or missing');
            }

            // Get user by email
            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found with the provided email');
            }

            console.log("User retrieved:", user);

            const userId = user.uid;

            // Validate phone number
            if (user.phone !== phone) {
                throw new Error('Phone number does not match the user\'s record');
            }

            // Ensure userId exists
            if (!userId) {
                throw new Error('User ID is invalid or missing');
            }

            // Update RFID
            const response = await userRepository.updateRFID(userId, rfid);
            console.log("RFID update response:", response);

            // Notify success
            this.system.notifyWebSocketClient(deviceId, {
                action: 'registerResult',
                result: 'success',
                status: true,
                message: 'RFID registered successfully',
                data: response,
            });
        } catch (error) {
            console.error(`Error handling register for device ${deviceId}: ${error.message}`, error);

            // Notify failure
            if (this.system && this.system.notifyWebSocketClient) {
                this.system.notifyWebSocketClient(deviceId, {
                    action: 'registerResult',
                    result: 'Error',
                    status: false,
                    message: error.message,
                });
            }
        }
    }

    async handleRegisterMQTT(deviceId, data) {
        try {
            const rfid = data.rfid;
            if (!rfid) {
                throw new Error('RFID tidak ada');
            }

            this.system.notifyWebSocketClient(deviceId, {
                action: 'rfid',
                result: 'success',
                status: true,
                message: 'RFID sent successfully',
                data: rfid,
            });
        } catch (error) {
            console.error(`Error handling register for device ${deviceId}: ${error.message}`, error);
            if (this.system && this.system.notifyWebSocketClient) {
                this.system.notifyWebSocketClient(deviceId, {
                    action: 'register',
                    result: 'Error',
                    status: false,
                    message: error.message,
                });
            }
        }
    }
}

export default UserHandler;
