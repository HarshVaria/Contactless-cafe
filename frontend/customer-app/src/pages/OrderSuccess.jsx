import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber } = location.state || {};

  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h1>
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <p className="text-gray-600 mb-2">Your Order Number</p>
          <p className="text-4xl font-bold text-orange-500">{orderNumber}</p>
        </div>
        <p className="text-gray-600 mb-6">
          Your order has been sent to the kitchen. We'll prepare it shortly!
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg"
          >
            Order More Items
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;