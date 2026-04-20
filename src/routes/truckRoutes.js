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
router.put('/:id', protect, authorize('ADMIN'), truckController.updateTruck); 
router.delete('/:id', protect, authorize('ADMIN'), truckController.deleteTruck); 

module.exports = router;