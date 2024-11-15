import userRepository from '../users/users.repository.js';
import mqttClient from '../mqtt/mqttClient.js';
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


export async function handlePointData(deviceId, data) {
    try {
        const botolTerkumpul = data.counter || 0;
        const userId = data.idUser;

        const currentUser = await userRepository.getUserById(userId);
        const lastCounter = currentUser.lastCounter || 0;

        const tambahBotol = botolTerkumpul - (botolTerkumpul - lastCounter);
        const pointsToAdd = tambahBotol * 100;
        const updatedTotalPoints = currentUser.points + pointsToAdd;

        console.log('Points updated:', updatedTotalPoints);

        return {
            deviceId: deviceId,
            result: 'Points Updated',
            status: true,
            idUser: userId,
            counter: botolTerkumpul,
            points: updatedTotalPoints
        };
    } catch (error) {
        console.error('Error handling point data:', error);
        return {
            result: 'Error',
            status: false
        };
    }
}

export async function publishResetCommand(deviceId) {
    const resetTopic = `vending/${deviceId}/reset`;

    mqttClient.publish(resetTopic, JSON.stringify({ message: 'reset' }), { qos: 2 }, (err) => {
        if (err) {
            console.error('Failed to publish reset command to MQTT:', err);
        } else {
            console.log(`Published reset command to MQTT topic '${resetTopic}'`);
        }
    });
}