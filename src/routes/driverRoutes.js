const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

// 1. GLOBAL MIDDLEWARE - This applies to EVERYTHING below it in this file
router.use(protect);
router.use(authorize('ADMIN'));

// 2. ROUTES
router.get('/', driverController.getAllDrivers);      // GET /api/drivers
router.post('/', driverController.createDriver);    // POST /api/drivers
router.get('/:id', driverController.getDriverById);  // GET /api/drivers/:id
router.patch('/:id', driverController.updateDriver); // PATCH /api/drivers/:id
router.delete('/:id', driverController.deleteDriver); // DELETE /api/drivers/:id

module.exports = router;