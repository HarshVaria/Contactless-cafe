import { useState, useEffect } from 'react';
import { getOrders } from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTable, setSearchTable] = useState('');

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders({});
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesTable = searchTable === '' || order.tableNumber.includes(searchTable);
    return matchesStatus && matchesTable;
  });

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalPrice, 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Preparing': 'bg-blue-100 text-blue-800',
      'Ready': 'bg-green-100 text-green-800',
      'Served': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📦 Order History</h2>
          <p className="text-gray-600">
            {filteredOrders.length} orders • Total Revenue: ₹{getTotalRevenue()}
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                filterStatus === status
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
              {status !== 'All' && (
                <span className="ml-2 bg-white bg-opacity-30 rounded-full px-2 py-0.5 text-xs">
                  {orders.filter(o => o.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          <input
            type="text"
            placeholder="🔍 Search by table number..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Order #</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Table</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Items</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                    Table {order.tableNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-gray-600">
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-gray-800">₹{order.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {searchTable ? 'Try a different search term' : 'Orders will appear here'}
          </p>
        </div>
      )}

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{filteredOrders.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{getTotalRevenue()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{filteredOrders.length > 0 ? (getTotalRevenue() / filteredOrders.filter(o => o.status !== 'Cancelled').length).toFixed(2) : 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Served Orders</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredOrders.filter(o => o.status === 'Served').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;