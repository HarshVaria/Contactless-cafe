const Order = require('../models/Order');
const MenuItem = require('../models/Menu');

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private (Owner)
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { status: { $ne: 'Cancelled' } };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get popular items
// @route   GET /api/analytics/popular-items
// @access  Private (Owner)
exports.getPopularItems = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });

    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemName = item.name;
        if (itemCounts[itemName]) {
          itemCounts[itemName].quantity += item.quantity;
          itemCounts[itemName].revenue += item.price * item.quantity;
        } else {
          itemCounts[itemName] = {
            name: itemName,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          };
        }
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: popularItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get peak hours
// @route   GET /api/analytics/peak-hours
// @access  Private (Owner)
exports.getPeakHours = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });

    const hourCounts = Array(24).fill(0);
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourCounts[hour]++;
    });

    const peakHours = hourCounts.map((count, hour) => ({
      hour: `${hour}:00`,
      orders: count
    })).filter(item => item.orders > 0);

    res.status(200).json({
      success: true,
      data: peakHours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get table-wise orders
// @route   GET /api/analytics/table-orders
// @access  Private (Owner)
exports.getTableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });

    const tableStats = {};
    orders.forEach(order => {
      const table = order.tableNumber;
      if (tableStats[table]) {
        tableStats[table].orders++;
        tableStats[table].revenue += order.totalPrice;
      } else {
        tableStats[table] = {
          tableNumber: table,
          orders: 1,
          revenue: order.totalPrice
        };
      }
    });

    const tableData = Object.values(tableStats).sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      success: true,
      data: tableData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};