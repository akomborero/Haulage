const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');



// --- ACCESS CONTROL ---
// Both ADMIN and OPERATOR can manage the daily movement of cargo.

// 1. Create a Job (Enforces Business Rules: Truck/Driver availability)
router.post('/', protect, authorize('ADMIN', 'OPERATOR'), jobController.createJob);


// Check line 15 - it must match the name in your exports exactly


// 2. View Jobs (With Pagination Bonus)
router.get('/', protect, jobController.getAllJobs);
router.get('/:id', protect, jobController.getJobById);

// 3. Update Job Status (Triggers status changes for Truck/Driver)
router.patch('/:id/status', protect, authorize('ADMIN', 'OPERATOR'), jobController.updateJobStatus);

// 4. Delete Job (Usually restricted to ADMIN for audit integrity)
router.delete('/:id', protect, authorize('ADMIN'), jobController.deleteJob);
router.post('/:id/complete', protect,authorize('ADMIN'), jobController.completeJob);

module.exports = router;