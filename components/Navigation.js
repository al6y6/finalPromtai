function Navigation({ activeTab, onTabChange }) {
  try {
    const tabs = [
      { id: 'generator', label: 'Generator', icon: 'sparkles' },
      { id: 'batch', label: 'Batch Generation', icon: 'layers' },
      { id: 'result', label: 'Prompt Result', icon: 'file-text' },
      { id: 'veo3', label: 'Veo 3', icon: 'zap' },
      { id: 'image', label: 'Image AI', icon: 'image' },
      { id: 'image-to-video', label: 'Image to Video', icon: 'camera' },
      { id: 'templates', label: 'Presets', icon: 'layout-template' },
      { id: 'enhancer', label: 'Enhancer', icon: 'magic-wand' },
      { id: 'library', label: 'Library', icon: 'book-open' },
      { id: 'favorites', label: 'Favorites', icon: 'heart' },
      { id: 'history', label: 'History', icon: 'clock' },
      { id: 'community', label: 'Community', icon: 'users' },
      { id: 'workspace', label: 'Team', icon: 'users-2' },
      { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
      { id: 'marketplace', label: 'Marketplace', icon: 'shopping-cart' },
      { id: 'export', label: 'Export', icon: 'download' },
      { id: 'preview', label: 'Preview', icon: 'play' },
      { id: 'settings', label: 'Settings', icon: 'settings' }
    ];

    return (
      <nav className="card-glass mb-4 sm:mb-6 lg:mb-8" data-name="navigation" data-file="components/Navigation.js">
        <div className="mobile-scroll">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-3 py-2 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`icon-${tab.icon} text-base sm:text-lg mr-1 sm:mr-2`}></div>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}