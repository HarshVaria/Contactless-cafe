import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRGenerator from '../components/QRGenerator';
import MenuManagement from '../components/MenuManagement';
import Analytics from '../components/Analytics';
import OrderHistory from '../components/OrderHistory';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'analytics', label: '📊 Analytics', icon: '📊' },
    { id: 'qr', label: '📱 QR Codes', icon: '📱' },
    { id: 'menu', label: '🍽️ Menu', icon: '🍽️' },
    { id: 'orders', label: '📦 Orders', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">👨‍💼 Owner Dashboard</h1>
              <p className="text-gray-600">{user.cafeName || 'Brew & Bites Cafe'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{user.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b sticky top-20 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition border-b-4 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'qr' && <QRGenerator />}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'orders' && <OrderHistory />}
      </div>
    </div>
  );
};

export default Dashboard;