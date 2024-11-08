import userRepository from '../users/users.repository.js';
export async function handleQRCodeAuthentication(deviceId, data) {
    try {
        const uid = data.uid;
        const user = await userRepository.getUserById(uid);

        if (user) {
            const accessToken = 'ABCDEFG';
            return {
                action: 'auth',
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
                action: 'auth',
                result: 'Not Authorized',
                status: false
            };
        }
    } catch (error) {
        console.error('Error handling QR Code authentication:', error);
        return {
            action: 'auth',
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

        await userRepository.updateLastCounter(userId, botolTerkumpul);
        await userRepository.updatePoints(userId, updatedTotalPoints);

        return {
            action: 'point',
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
            action: 'point',
            result: 'Error',
            status: false
        };
    }
}

export async function updatePointUser(userId, counter, ws) {
    try {
        const currentUser = await userRepository.getUserById(userId);
        const botolTerkumpul = currentUser.botolTerkumpul + parseInt(counter, 10);

        console.log(`User ${userId} botol terkumpul updated to: ${botolTerkumpul}`);

        const pointsToAdd = counter * 100;
        const updatedTotalPoints = currentUser.points + pointsToAdd;

        await userRepository.updateBottle(userId, botolTerkumpul);
        await userRepository.updatePoints(userId, updatedTotalPoints);

        console.log(`User ${userId} points updated to: ${updatedTotalPoints}`);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                deviceId: currentUser.deviceId,
                result: 'Points Updated',
                status: true,
                idUser: userId,
                botolTerkumpul: botolTerkumpul,
                points: updatedTotalPoints
            }));
        }
    } catch (error) {
        console.error('Error updating user points:', error);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                result: 'Error',
                status: false,
                message: 'Failed to update points'
            }));
        }
    }
}
