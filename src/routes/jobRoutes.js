const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');




router.post('/', protect, authorize('ADMIN', 'OPERATOR'), jobController.createJob);
router.get('/', protect, jobController.getAllJobs);
router.get('/:id', protect, jobController.getJobById);
router.patch('/:id/status', protect, authorize('ADMIN', 'OPERATOR'), jobController.updateJobStatus);
router.delete('/:id', protect, authorize('ADMIN'), jobController.deleteJob);
router.post('/:id/complete', protect,authorize('ADMIN'), jobController.completeJob);

module.exports = router;