import { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getRevenueAnalytics, getPopularItems, getPeakHours, getTableOrders } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [revenue, setRevenue] = useState(null);
  const [popularItems, setPopularItems] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [revenueData, itemsData, hoursData, tablesData] = await Promise.all([
        getRevenueAnalytics(),
        getPopularItems(),
        getPeakHours(),
        getTableOrders()
      ]);

      setRevenue(revenueData.data);
      setPopularItems(itemsData.data || []);
      setPeakHours(hoursData.data || []);
      setTableOrders(tablesData.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  // Popular Items Chart Data
  const popularItemsChart = {
    labels: popularItems.slice(0, 10).map(item => item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: popularItems.slice(0, 10).map(item => item.quantity),
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Peak Hours Chart Data
  const peakHoursChart = {
    labels: peakHours.map(item => item.hour),
    datasets: [
      {
        label: 'Orders per Hour',
        data: peakHours.map(item => item.orders),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
      },
    ],
  };

  // Table Revenue Chart Data
  const tableRevenueChart = {
    labels: tableOrders.slice(0, 10).map(item => `Table ${item.tableNumber}`),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: tableOrders.slice(0, 10).map(item => item.revenue),
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(147, 51, 234, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(20, 184, 166, 0.6)',
          'rgba(132, 204, 22, 0.6)',
          'rgba(251, 146, 60, 0.6)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold">₹{revenue?.totalRevenue || 0}</h3>
            </div>
            <div className="text-5xl opacity-50">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold">{revenue?.totalOrders || 0}</h3>
            </div>
            <div className="text-5xl opacity-50">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold mb-1">Avg Order Value</p>
              <h3 className="text-3xl font-bold">₹{revenue?.averageOrderValue || 0}</h3>
            </div>
            <div className="text-5xl opacity-50">📊</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Most Popular Items</h3>
          <div style={{ height: '300px' }}>
            {popularItems.length > 0 ? (
              <Bar data={popularItemsChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ Peak Ordering Hours</h3>
          <div style={{ height: '300px' }}>
            {peakHours.length > 0 ? (
              <Line data={peakHoursChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Table Revenue */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🪑 Table-wise Revenue</h3>
          <div style={{ height: '300px' }}>
            {tableOrders.length > 0 ? (
              <Doughnut data={tableRevenueChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Top Tables List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Top Performing Tables</h3>
          <div className="space-y-3">
            {tableOrders.slice(0, 5).map((table, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Table {table.tableNumber}</p>
                    <p className="text-sm text-gray-600">{table.orders} orders</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">₹{table.revenue}</p>
              </div>
            ))}
            {tableOrders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No table data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Popular Items List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🍽️ Popular Items Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity Sold</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {popularItems.slice(0, 10).map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 font-bold text-green-600">₹{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {popularItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">No items data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;