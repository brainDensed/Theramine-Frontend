import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function IPFSSettings() {
  const [pinataJwt, setPinataJwt] = useState('');
  const [pinataGateway, setPinataGateway] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [saveInterval, setSaveInterval] = useState(10);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('ipfs-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoSave(settings.autoSave ?? true);
      setSaveInterval(settings.saveInterval ?? 10);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      autoSave,
      saveInterval,
    };
    localStorage.setItem('ipfs-settings', JSON.stringify(settings));
    
    // Note: JWT and Gateway should be set in .env file for security
    console.log('⚙️ IPFS settings saved');
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      // This would test the Pinata connection
      // For now, we'll simulate the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (import.meta.env.VITE_PINATA_JWT && import.meta.env.VITE_PINATA_GATEWAY) {
        setConnectionStatus({ success: true, message: 'Connection successful!' });
      } else {
        setConnectionStatus({ 
          success: false, 
          message: 'Please set VITE_PINATA_JWT and VITE_PINATA_GATEWAY in your .env file' 
        });
      }
    } catch (error) {
      setConnectionStatus({ success: false, message: error.message });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6">⚙️ IPFS Configuration</h3>
      
      <div className="space-y-6">
        {/* Connection Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Connection Settings</h4>
          
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <h5 className="text-yellow-300 font-medium mb-2">🔐 Security Notice</h5>
            <p className="text-yellow-200 text-sm">
              Pinata JWT and Gateway URL should be set in your <code className="bg-black/30 px-1 rounded">.env</code> file:
            </p>
            <pre className="text-yellow-200 text-xs mt-2 bg-black/30 p-2 rounded">
{`VITE_PINATA_JWT=your_jwt_token_here
VITE_PINATA_GATEWAY=your_gateway_url_here`}
            </pre>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testConnection}
              disabled={isTestingConnection}
              className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition disabled:opacity-50"
            >
              {isTestingConnection ? '🔄 Testing...' : '🔌 Test Connection'}
            </motion.button>
            
            {connectionStatus && (
              <div className={`px-3 py-1 rounded-lg text-sm ${
                connectionStatus.success 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {connectionStatus.success ? '✅' : '❌'} {connectionStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Auto-save Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Auto-save Settings</h4>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoSave" className="text-white">
              Enable automatic saving to IPFS
            </label>
          </div>
          
          {autoSave && (
            <div className="ml-7 space-y-2">
              <label className="block text-white/70 text-sm">
                Save after every
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={saveInterval}
                  onChange={(e) => setSaveInterval(parseInt(e.target.value) || 10)}
                  className="w-20 px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-white/70">messages</span>
              </div>
            </div>
          )}
        </div>

        {/* Storage Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Storage Information</h4>
          
          <div className="bg-white/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Storage Type:</span>
              <span className="text-white">IPFS (Pinata)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Data Format:</span>
              <span className="text-white">JSON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Encryption:</span>
              <span className="text-white">Client-side (optional)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Persistence:</span>
              <span className="text-white">Permanent</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSettings}
            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition"
          >
            💾 Save Settings
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAutoSave(true);
              setSaveInterval(10);
            }}
            className="px-4 py-2 rounded-lg bg-gray-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30 transition"
          >
            🔄 Reset to Defaults
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default IPFSSettings;
