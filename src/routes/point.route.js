import express from 'express';
import pointController from '../point/point.controller.js';

const router = express.Router();

router.get('/', pointController.getAllPoints);


export default router;
