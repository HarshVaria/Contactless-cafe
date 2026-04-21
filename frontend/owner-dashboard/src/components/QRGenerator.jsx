import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Printer, Maximize2, X, Link as LinkIcon, Info } from 'lucide-react';

const QRGenerator = () => {
  const [showPreview, setShowPreview] = useState(false);

  // Base URL - Pointing to the customer app dynamically
  const BASE_URL = `${window.location.protocol}//${window.location.hostname}`;

  const downloadQR = () => {
    const canvas = document.getElementById('master-qr');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'Master-Cafe-QR.png';
      link.href = url;
      link.click();
    }
  };

  const printQR = () => {
    const canvas = document.getElementById('master-qr');
    if (canvas) {
      const win = window.open('', '_blank');
      win.document.write(`
        <html>
          <head>
            <title>Master Cafe QR Code</title>
            <style>
              body { 
                display: flex; flex-direction: column; justify-content: center; align-items: center; 
                height: 100vh; margin: 0; font-family: system-ui; background-color: white;
              }
              .container { text-align: center; padding: 60px; border: 4px solid #4f46e5; border-radius: 40px; }
              h1 { margin: 0 0 10px 0; color: #1e293b; font-size: 48px; }
              h2 { margin: 0 0 40px 0; color: #4f46e5; font-size: 24px; opacity: 0.8; }
              img { border-radius: 20px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
              p { margin-top: 40px; font-size: 20px; color: #64748b; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Brew & Bites</h1>
              <h2>Scan to Order</h2>
              <img src="${canvas.toDataURL()}" style="width: 400px; height: 400px;" />
              <p>Direct Access to Digital Menu</p>
            </div>
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 250);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-2">
          <QrCode className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Master QR Generator</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Generate a single high-quality QR code for your entire cafe. Customers can scan this to view the menu instantly.
        </p>
      </div>

      {/* Main QR Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual QR Side */}
          <div className="p-8 md:p-12 bg-slate-50 border-r border-slate-200 flex flex-col items-center justify-center">
            <div 
              className="bg-white p-6 rounded-3xl shadow-2xl shadow-indigo-500/10 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowPreview(true)}
            >
              <QRCodeCanvas
                id="master-qr"
                value={BASE_URL}
                size={240}
                level="H"
                includeMargin={false}
                className="rounded-xl"
              />
            </div>
            <div className="mt-8 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <LinkIcon className="w-4 h-4 text-indigo-500" />
              <code className="text-xs font-mono font-bold text-slate-600">
                {BASE_URL}
              </code>
            </div>
          </div>

          {/* Controls Side */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">QR Code Settings</h3>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-900/70 leading-relaxed font-medium">
                  This QR code points to your customer application. It is optimized for mobile scanning and will automatically direct users to your menu.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={printQR}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
              >
                <Printer className="w-5 h-5" />
                Print Big Poster
              </button>
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 px-6 py-4 rounded-2xl font-bold transition-all"
              >
                <Download className="w-5 h-5" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4" 
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Brew & Bites</h3>
              <p className="text-indigo-600 font-bold">Standard Customer QR</p>
            </div>

            <div className="bg-slate-50 p-10 rounded-[32px] mb-8 border border-slate-100 flex justify-center shadow-inner">
              <QRCodeCanvas
                value={BASE_URL}
                size={300}
                level="H"
                includeMargin={false}
                className="rounded-2xl"
              />
            </div>
            
            <p className="text-center text-slate-400 text-sm font-medium">
              Click outside to close preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;