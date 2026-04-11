import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItems } from '../services/api';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', 'Beverages', 'Snacks', 'Main Course', 'Breakfast', 'Desserts'];

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, menuItems]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await getMenuItems();
      setMenuItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      alert('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem._id === itemId);
    
    if (existingItem.quantity === 1) {
      setCart(cart.filter(cartItem => cartItem._id !== itemId));
    } else {
      setCart(cart.map(cartItem =>
        cartItem._id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout', { state: { cart } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading menu... ☕</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">☕ Brew & Bites</h1>
              <p className="text-sm text-gray-600">
                Table: {localStorage.getItem('tableNumber')}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold relative"
            >
              🛒 Cart ({getTotalItems()})
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-bold text-orange-500">₹{item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">⏱️ {item.preparationTime} min</span>
                  {item.available ? (
                    cart.find(cartItem => cartItem._id === item._id) ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold">
                          {cart.find(cartItem => cartItem._id === item._id).quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Add +
                      </button>
                    )
                  ) : (
                    <span className="text-red-500 font-semibold">Unavailable</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-500 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{getTotalItems()} items</p>
              <p className="text-xl font-bold text-gray-800">Total: ₹{getTotalPrice()}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;