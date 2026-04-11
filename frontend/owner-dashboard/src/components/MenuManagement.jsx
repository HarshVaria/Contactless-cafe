import { useState, useEffect } from 'react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from '../services/api';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Beverages',
    image: '',
    preparationTime: 15,
    available: true
  });

  const categories = ['Beverages', 'Snacks', 'Main Course', 'Breakfast', 'Desserts'];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await getMenuItems();
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Error loading menu:', error);
      alert('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime)
      };

      if (editingItem) {
        await updateMenuItem(editingItem._id, itemData);
        alert('✅ Menu item updated successfully!');
      } else {
        await createMenuItem(itemData);
        alert('✅ Menu item created successfully!');
      }

      resetForm();
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('❌ Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      preparationTime: item.preparationTime,
      available: item.available
    });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMenuItem(id);
        alert('✅ Menu item deleted successfully!');
        loadMenuItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('❌ Failed to delete menu item');
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await toggleMenuItemAvailability(id);
      loadMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('❌ Failed to update availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Beverages',
      image: '',
      preparationTime: 15,
      available: true
    });
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🍽️ Menu Management</h2>
          <p className="text-gray-600">{menuItems.length} items in menu</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {showForm ? '❌ Cancel' : '➕ Add New Item'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Item Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Preparation Time (min) *</label>
              <input
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                rows="3"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="font-semibold text-gray-700">Available for orders</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {editingItem ? '💾 Update Item' : '➕ Add Item'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Menu Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition">
            <img
              src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <span className="text-lg font-bold text-purple-600">₹{item.price}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">
                  {item.category}
                </span>
                <span>⏱️ {item.preparationTime} min</span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => handleToggleAvailability(item._id)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm font-semibold ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                    {item.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id, item.name)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No menu items yet</h3>
          <p className="text-gray-500 mb-4">Click "Add New Item" to create your first menu item</p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;