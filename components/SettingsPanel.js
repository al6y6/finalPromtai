function SettingsPanel({ onStatusUpdate }) {
  try {
    const [settings, setSettings] = React.useState({
      defaultVendor: 'trickle',
      apiKeys: {
        trickle: 'built-in',
        openai: '',
        anthropic: '',
        google: '',
        custom: ''
      },
      preferences: {
        autoSave: true,
        darkMode: true,
        notifications: true
      }
    });
    const [connectionStatus, setConnectionStatus] = React.useState(null);
    const [testing, setTesting] = React.useState(false);

    const vendors = [
      { id: 'trickle', name: 'Trickle AI (Built-in)', icon: 'zap', recommended: true },
      { id: 'openai', name: 'OpenAI GPT', icon: 'brain' },
      { id: 'anthropic', name: 'Anthropic Claude', icon: 'cpu' },
      { id: 'google', name: 'Google Gemini', icon: 'search' },
      { id: 'custom', name: 'Custom API', icon: 'settings' }
    ];

    const handleApiKeyChange = (vendor, value) => {
      setSettings(prev => ({
        ...prev,
        apiKeys: { ...prev.apiKeys, [vendor]: value || '' }
      }));
    };

    const handlePreferenceChange = (key, value) => {
      setSettings(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: value }
      }));
    };

    const saveSettings = async () => {
      try {
        apiManager.saveSettings(settings);
        await testConnection();
        if (onStatusUpdate) onStatusUpdate();
        alert('Pengaturan berhasil disimpan dan AI vendor diperbarui!');
      } catch (error) {
        alert('Pengaturan disimpan tetapi ada masalah dengan koneksi AI');
      }
    };

    const testConnection = async () => {
      setTesting(true);
      try {
        const result = await apiManager.testConnection(settings.defaultVendor);
        setConnectionStatus(result);
        if (result.success) {
          await apiManager.switchVendor(settings.defaultVendor);
        }
      } catch (error) {
        setConnectionStatus({ success: false, message: 'Connection test failed' });
      } finally {
        setTesting(false);
      }
    };

    const switchVendor = async (vendorId) => {
      setSettings(prev => ({ ...prev, defaultVendor: vendorId }));
      setTesting(true);
      try {
        const result = await apiManager.switchVendor(vendorId);
        setConnectionStatus(result);
        if (onStatusUpdate) onStatusUpdate();
      } catch (error) {
        setConnectionStatus({ success: false, message: 'Failed to switch vendor' });
      } finally {
        setTesting(false);
      }
    };

    React.useEffect(() => {
      try {
        const saved = localStorage.getItem('videoPromptSettings');
        if (saved) {
          const loadedSettings = JSON.parse(saved);
          setSettings(prevSettings => ({
            ...prevSettings,
            ...loadedSettings,
            apiKeys: {
              trickle: 'built-in',
              openai: '',
              anthropic: '',
              google: '',
              custom: '',
              ...loadedSettings.apiKeys
            },
            preferences: {
              autoSave: true,
              darkMode: true,
              notifications: true,
              ...loadedSettings.preferences
            }
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }, []);

    return (
      <div className="space-y-6" data-name="settings-panel" data-file="components/SettingsPanel.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-settings text-2xl mr-3"></div>
            Pengaturan AI Vendor
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-3">Vendor AI Default</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vendors.map(vendor => (
                  <button
                    key={vendor.id}
                    onClick={() => switchVendor(vendor.id)}
                    className={`flex items-center p-3 rounded-lg border transition-all duration-200 relative ${
                      settings.defaultVendor === vendor.id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <div className={`icon-${vendor.icon} text-xl mr-3`}></div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        {vendor.name}
                        {vendor.recommended && (
                          <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded text-xs">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-medium">Connection Status</h4>
                  <button
                    onClick={testConnection}
                    disabled={testing}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
                {connectionStatus && (
                  <div className={`p-3 rounded-lg ${
                    connectionStatus.success 
                      ? 'bg-green-500/20 text-green-200' 
                      : 'bg-red-500/20 text-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`icon-${connectionStatus.success ? 'check-circle' : 'x-circle'} text-lg`}></div>
                      <span className="text-sm">{connectionStatus.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">API Keys</h3>
              <div className="space-y-3">
                {vendors.map(vendor => (
                  <div key={vendor.id}>
                    <label className="block text-white/80 text-sm mb-1">{vendor.name}</label>
                    <input
                      type={vendor.id === 'trickle' ? 'text' : 'password'}
                      value={settings.apiKeys[vendor.id] || ''}
                      onChange={(e) => handleApiKeyChange(vendor.id, e.target.value)}
                      placeholder={vendor.id === 'trickle' ? 'Built-in (No API key required)' : `Masukkan ${vendor.name} API key...`}
                      className="input-modern"
                      disabled={vendor.id === 'trickle'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Preferensi</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-white/80">Auto-save Favorites</span>
                  <input
                    type="checkbox"
                    checked={settings.preferences.autoSave || false}
                    onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-white/80">Dark Mode</span>
                  <input
                    type="checkbox"
                    checked={settings.preferences.darkMode || false}
                    onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-white/80">Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.preferences.notifications || false}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="btn-primary w-full"
            >
              <span className="flex items-center justify-center">
                <div className="icon-save text-xl mr-2"></div>
                Simpan Pengaturan
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SettingsPanel component error:', error);
    return null;
  }
}