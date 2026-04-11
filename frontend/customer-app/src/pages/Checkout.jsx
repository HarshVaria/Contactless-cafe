import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const tableNumber = localStorage.getItem('tableNumber');

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    const orderData = {
      tableNumber,
      items: cart.map(item => ({
        menuItem: item._id,
        quantity: item.quantity
      })),
      specialInstructions
    };

    try {
      const response = await createOrder(orderData);
      
      if (response.success) {
        navigate('/order-success', { 
          state: { 
            orderNumber: response.data.orderNumber,
            orderId: response.data._id
          } 
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/menu')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Summary</h1>
          <p className="text-gray-600">Table Number: {tableNumber}</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Items</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-orange-500">₹{getTotalPrice()}</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Special Instructions</h2>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests? (e.g., less spicy, no onions)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            rows="3"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg"
          >
            ← Back to Menu
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400"
          >
            {loading ? 'Placing Order...' : 'Place Order 🍽️'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;