// Check these paths carefully!
const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');
// Change this line:
const protect = require('../middleware/auth'); // Removed "Middleware" from the name
const { authorize } = require('../middleware/roleMiddleware'); // Verify this path

router.get('/', protect, truckController.getAllTrucks); // Everyone can see
router.post('/', protect, authorize('ADMIN'), truckController.createTruck); // Only Admin
router.put('/:id', protect, authorize('ADMIN'), truckController.updateTruck); // Only Admin
router.delete('/:id', protect, authorize('ADMIN'), truckController.deleteTruck); // Only Admin

module.exports = router;