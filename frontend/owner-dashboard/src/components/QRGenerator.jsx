import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRGenerator = () => {
  const [numberOfTables, setNumberOfTables] = useState(10);
  const [selectedTable, setSelectedTable] = useState(null);

  // Base URL - This will be your deployed app URL (for now localhost)
  const BASE_URL = 'http://localhost:5173';

  const generateQRValue = (tableNumber) => {
    return `${BASE_URL}?table=${tableNumber}`;
  };

  const downloadQR = (tableNumber) => {
    const canvas = document.getElementById(`qr-${tableNumber}`);
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Table-${tableNumber}-QR.png`;
      link.href = url;
      link.click();
    }
  };

  const downloadAllQRs = () => {
    for (let i = 1; i <= numberOfTables; i++) {
      setTimeout(() => downloadQR(i), i * 200);
    }
  };

  const printQR = (tableNumber) => {
    const canvas = document.getElementById(`qr-${tableNumber}`);
    if (canvas) {
      const win = window.open('', '_blank');
      win.document.write(`
        <html>
          <head>
            <title>Table ${tableNumber} QR Code</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column;
                justify-content: center; 
                align-items: center; 
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              h1 { margin-bottom: 20px; }
              img { border: 2px solid #333; padding: 20px; }
              p { margin-top: 20px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Table ${tableNumber}</h1>
            <img src="${canvas.toDataURL()}" />
            <p>Scan to order from Brew & Bites Cafe</p>
          </body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📱 QR Code Generator</h2>
          <p className="text-gray-600">Generate QR codes for your tables</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-semibold text-gray-700">Number of Tables:</label>
          <input
            type="number"
            min="1"
            max="50"
            value={numberOfTables}
            onChange={(e) => setNumberOfTables(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={downloadAllQRs}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          📥 Download All QR Codes
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{BASE_URL}</code>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: numberOfTables }, (_, i) => i + 1).map((tableNumber) => (
          <div key={tableNumber} className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200 hover:border-purple-500 transition">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Table {tableNumber}</h3>
            
            <div className="bg-white p-3 rounded-lg inline-block mb-3">
              <QRCodeCanvas
                id={`qr-${tableNumber}`}
                value={generateQRValue(tableNumber)}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => downloadQR(tableNumber)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
              >
                📥 Download
              </button>
              <button
                onClick={() => printQR(tableNumber)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
              >
                🖨️ Print
              </button>
              <button
                onClick={() => setSelectedTable(tableNumber)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
              >
                👁️ Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTable(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Table {selectedTable}</h3>
            <div className="bg-gray-100 p-6 rounded-lg mb-4 flex justify-center">
              <QRCodeCanvas
                value={generateQRValue(selectedTable)}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              URL: {generateQRValue(selectedTable)}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => downloadQR(selectedTable)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Download
              </button>
              <button
                onClick={() => printQR(selectedTable)}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Print
              </button>
              <button
                onClick={() => setSelectedTable(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;