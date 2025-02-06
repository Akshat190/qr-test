import  { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Utensils, MapPin, Share2, Loader2, CheckCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface QRCodeGeneratorProps {
  restaurantId: string;
  restaurantName: string;
}

const QRCodeGenerator = ({ restaurantId, restaurantName }: QRCodeGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [qrSize, setQrSize] = useState(180);
  const [menuUrl, setMenuUrl] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/menu/${restaurantId}`;
    console.log('Menu URL:', url);
    setMenuUrl(url);
  }, [restaurantId]);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const qrTemplate = document.getElementById('qr-template');
      if (qrTemplate) {
        const dataUrl = await toPng(qrTemplate, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#ffffff',
        });
        
        const link = document.createElement('a');
        link.download = `${restaurantName.toLowerCase().replace(/\s+/g, '-')}-menu-qr.png`;
        link.href = dataUrl;
        link.click();
        
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
        toast.success('QR Code downloaded successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      if (navigator.share) {
        await navigator.share({
          title: `${restaurantName} Menu QR Code`,
          text: `Scan this QR code to view the menu for ${restaurantName}`,
          url: menuUrl
        });
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(menuUrl);
        toast.success('Menu URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share QR code');
    } finally {
      setIsSharing(false);
    }
  };

  if (!menuUrl) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center max-w-lg mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Menu QR Code</h3>
          <p className="text-gray-500 mt-2">
            Scan this QR code to view the digital menu
          </p>
        </div>

        {/* QR Code Template */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div id="qr-template" className="w-full max-w-[320px] sm:max-w-[400px] mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl">
            <div className="bg-white rounded-2xl p-4 sm:p-8 flex flex-col items-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIi8+CiAgPHBhdGggZD0iTTAgMGgxNXYxNUgweiIgZmlsbD0iIzM3MzczNyIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] bg-repeat"></div>
              </div>

              {/* Restaurant Logo & Name */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                <Utensils className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">
                {restaurantName}
              </h2>

              {/* QR Code */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-xl shadow-2xl">
                <div className="bg-white p-3 sm:p-4 rounded-lg">
                  <QRCodeCanvas
                    id="qr-code"
                    value={menuUrl}
                    size={qrSize}
                    level="H"
                    includeMargin={false}
                    className="rounded-lg"
                    fgColor="#4F46E5"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="w-full text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">Place this QR code on your table</p>
                </div>
                <p className="text-xs text-gray-400">Scan to view our digital menu</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Size Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setQrSize(150)}
            className={`px-3 py-1 rounded ${qrSize === 150 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Small
          </button>
          <button
            onClick={() => setQrSize(180)}
            className={`px-3 py-1 rounded ${qrSize === 180 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Medium
          </button>
          <button
            onClick={() => setQrSize(210)}
            className={`px-3 py-1 rounded ${qrSize === 210 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Large
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : downloadSuccess ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Download'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {isSharing ? 'Sharing...' : 'Share'}
          </motion.button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-500 space-y-2">
          <p className="font-medium">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Download or share the QR code</li>
            <li>Print and display it in your restaurant</li>
            <li>Customers can scan to view your digital menu</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 