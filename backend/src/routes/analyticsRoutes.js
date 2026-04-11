const express = require('express');
const router = express.Router();
const {
  getRevenueAnalytics,
  getPopularItems,
  getPeakHours,
  getTableOrders
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/revenue', protect, authorize('owner'), getRevenueAnalytics);
router.get('/popular-items', protect, authorize('owner'), getPopularItems);
router.get('/peak-hours', protect, authorize('owner'), getPeakHours);
router.get('/table-orders', protect, authorize('owner'), getTableOrders);

module.exports = router;