function ApiWarningModal({ apiStatus, onClose, onGoToSettings }) {
  try {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-name="api-warning-modal" data-file="components/ApiWarningModal.js">
        <div className="bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-lg border border-red-500/50 rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="icon-alert-triangle text-4xl text-red-400 mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-3">API Connection Required</h3>
            <p className="text-white/80 mb-6">
              You need to configure and connect an AI provider to use the generators. 
              Current provider "{apiStatus.vendorName}" is not connected.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={onGoToSettings}
                className="w-full btn-primary"
              >
                <div className="icon-settings text-lg mr-2"></div>
                Go to Settings
              </button>
              
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-200"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-200 text-sm flex items-center">
                <span className="icon-info text-sm mr-1"></span>
                Tip: Trickle AI is built-in and always available
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ApiWarningModal component error:', error);
    return null;
  }
}