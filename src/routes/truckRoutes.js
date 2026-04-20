const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');

// Define the "doors"
router.post('/', truckController.createTruck); // Add a truck
router.get('/', truckController.getAllTrucks); // List all trucks
// Add this below your other routes
router.get('/:id', truckController.getTruckById);

module.exports = router;