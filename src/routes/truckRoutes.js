const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');

// Correctly destructure from your updated auth.js
const { protect, authorize } = require('../middleware/auth'); 

// --- ROUTES ---

// View all trucks
router.get('/', protect, truckController.getAllTrucks); 

// Admin only actions
router.post('/', protect, authorize('ADMIN'), truckController.createTruck); 
// Change .put to .patch if you want to use the PATCH method in Postman
router.patch('/:id', protect, authorize('ADMIN'), truckController.updateTruck);
router.delete('/:id', protect, authorize('ADMIN'), truckController.deleteTruck); 
router.get('/:id', truckController.getTruckById);

module.exports = router;