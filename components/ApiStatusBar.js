function ApiStatusBar({ apiStatus, onSettingsClick }) {
  try {
    const getStatusColor = () => {
      return apiStatus.isConnected ? 'text-green-400' : 'text-red-400';
    };

    const getStatusIcon = () => {
      return apiStatus.isConnected ? 'check-circle' : 'x-circle';
    };

    const getStatusText = () => {
      return apiStatus.isConnected ? 'Google Gemini Connected' : 'Google Gemini Disconnected';
    };

    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl p-3 mb-4" data-name="api-status-bar" data-file="components/ApiStatusBar.js">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`icon-${getStatusIcon()} text-lg ${getStatusColor()}`}></div>
            <div>
              <span className="text-white font-medium">AI Provider: </span>
              <span className="text-white/80">Google Gemini</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="flex items-center px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all duration-200 text-sm"
          >
            <div className="icon-settings text-sm mr-1"></div>
            Settings
          </button>
        </div>
        
        {!apiStatus.isConnected && (
          <div className="mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm flex items-center">
              <span className="icon-alert-triangle text-sm mr-1"></span>
              Google Gemini API connection required. Please check your API key in settings.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ApiStatusBar component error:', error);
    return null;
  }
}