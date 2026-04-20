const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');
const { protect, authorize } = require('../middleware/auth'); 


router.get('/', protect, truckController.getAllTrucks); 
router.post('/', protect, authorize('ADMIN'), truckController.createTruck); 

router.patch('/:id', protect, authorize('ADMIN'), truckController.updateTruck);
router.delete('/:id', protect, authorize('ADMIN'), truckController.deleteTruck); 
router.get('/:id', truckController.getTruckById);

module.exports = router;