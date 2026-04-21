import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRGenerator from '../components/QRGenerator';
import MenuManagement from '../components/MenuManagement';
import Analytics from '../components/Analytics';
import OrderHistory from '../components/OrderHistory';
import Inventory from '../components/Inventory';
import KitchenStaff from '../components/KitchenStaff';
import { getKitchenStatus } from '../services/api';
import { 
  BarChart3, 
  QrCode, 
  Coffee, 
  ShoppingBag, 
  LogOut, 
  Store, 
  UserCircle,
  PackageSearch,
  ChefHat
} from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isScrolled, setIsScrolled] = useState(false);
  const [kitchenOnline, setKitchenOnline] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const cafeName = user.cafeName || 'Brew & Bites';

  // Add a subtle shadow to the header when scrolling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Poll kitchen status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getKitchenStatus();
        setKitchenOnline(res.isAvailable);
      } catch (err) {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: PackageSearch },
    { id: 'staff', label: 'Kitchen Staff', icon: ChefHat },
    { id: 'qr', label: 'QR Codes', icon: QrCode },
    { id: 'menu', label: 'Menu', icon: Coffee },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Two-Tier App Bar */}
      <header 
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
          isScrolled ? 'border-slate-200 shadow-sm' : 'border-slate-200'
        }`}
      >
        {/* Tier 1: Brand & User Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Brand & Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <Store className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {cafeName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Owner Workspace</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              
              {/* Kitchen Status Badge */}
              <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border ${kitchenOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <ChefHat className="w-4 h-4" />
                <span className="text-sm font-bold">{kitchenOnline ? 'Online' : 'Offline'}</span>
                <span className="relative flex h-2.5 w-2.5 ml-1">
                  {kitchenOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${kitchenOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
              
              {/* Profile & Logout */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">Welcome back,</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">{user.username || 'Admin'}</p>
                  </div>
                  <UserCircle className="w-9 h-9 text-slate-300" />
                </div>
                
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tier 2: Navigation Tabs (Unified for Desktop & Mobile) */}
        <div className="bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex overflow-x-auto space-x-2 sm:space-x-4 py-2.5 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/75 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header for current view */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Manage your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} and view insights.
          </p>
        </div>

        {/* Component Rendering */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 p-6 min-h-[500px]">
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'staff' && <KitchenStaff />}
          {activeTab === 'qr' && <QRGenerator />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'orders' && <OrderHistory />}
        </div>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;