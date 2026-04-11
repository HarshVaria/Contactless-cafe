import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableNumber = () => {
  const [tableNumber, setTableNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      localStorage.setItem('tableNumber', tableNumber);
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ☕ Brew & Bites Cafe
          </h1>
          <p className="text-gray-600">Contactless Ordering System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Your Table Number
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 text-lg"
          >
            View Menu 🍽️
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Scan the QR code on your table or enter the table number manually</p>
        </div>
      </div>
    </div>
  );
};

export default TableNumber;