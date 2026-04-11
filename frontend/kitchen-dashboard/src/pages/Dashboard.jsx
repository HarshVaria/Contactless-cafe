import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Pending');
  const navigate = useNavigate();

  const statuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

  useEffect(() => {
    loadOrders();
    // Poll every 5 seconds for new orders
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      // Fetch ALL orders without filter
      const response = await getOrders({});
      setAllOrders(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      if (error.message === 'Not authorized to access this route') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Immediately update the order in state (optimistic update)
      setAllOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Show success message
      const orderNumber = allOrders.find(o => o._id === orderId)?.orderNumber;
      alert(`✅ Order ${orderNumber} updated to ${newStatus}`);
      
      // Refresh from server
      loadOrders();
      
    } catch (error) {
      console.error('Error updating order:', error);
      alert('❌ Failed to update order status');
    }
  };

  // Filter orders based on selected status
  const filteredOrders = filterStatus === 'All'
    ? allOrders
    : allOrders.filter(order => order.status === filterStatus);

  // Count orders by status
  const getStatusCount = (status) => {
    return allOrders.filter(order => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🍽️ Kitchen Dashboard</h1>
            <p className="text-gray-600">Live order management • Total Orders: {allOrders.length}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (onLogout) onLogout();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
            <button
              onClick={loadOrders}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Filters with Counts */}
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-semibold transition relative ${
                filterStatus === status
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
              {getStatusCount(status) > 0 && (
                <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {getStatusCount(status)}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filterStatus === 'All'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
            <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
              {allOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
            {/* Order Header */}
            <div className={`p-4 font-bold text-lg ${getStatusColor(order.status)}`}>
              <div className="flex justify-between items-center">
                <span>{order.orderNumber}</span>
                <span className="text-sm font-normal opacity-75">Table {order.tableNumber}</span>
              </div>
              <div className="text-sm opacity-75 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Items */}
            <div className="p-4 border-t">
              {order.items.map(item => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium">{item.name} × {item.quantity}</span>
                  <span className="text-gray-600">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t font-bold text-lg flex justify-between">
                <span>Total:</span>
                <span className="text-orange-500">₹{order.totalPrice}</span>
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-yellow-50 border-t border-yellow-200 p-4">
                <p className="text-sm text-yellow-800 font-semibold">📝 Special Instructions:</p>
                <p className="text-sm mt-1 text-gray-700">{order.specialInstructions}</p>
              </div>
            )}

            {/* Status Update Buttons */}
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 mb-2 text-center">Update Status:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(order._id, status)}
                    disabled={order.status === status}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      order.status === status
                        ? 'bg-green-500 text-white cursor-not-allowed ring-2 ring-green-300'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    {order.status === status ? `✓ ${status}` : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No orders {filterStatus === 'All' ? '' : `with status "${filterStatus}"`}
          </h2>
          <p className="text-gray-500 mb-4">Orders will appear here automatically</p>
          <button
            onClick={loadOrders}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            🔄 Refresh Now
          </button>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-500 text-white',
    'Preparing': 'bg-blue-500 text-white',
    'Ready': 'bg-green-500 text-white',
    'Served': 'bg-gray-400 text-white',
    'Cancelled': 'bg-red-500 text-white'
  };
  return colors[status] || 'bg-gray-500 text-white';
};

export default Dashboard;