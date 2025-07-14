function TemplatePresets({ onSelectTemplate }) {
  try {
    const [selectedCategory, setSelectedCategory] = React.useState('marketing');
    const [presets, setPresets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const categories = [
      { id: 'marketing', label: 'Marketing & Iklan', icon: 'megaphone' },
      { id: 'education', label: 'Edukasi', icon: 'graduation-cap' },
      { id: 'entertainment', label: 'Entertainment', icon: 'film' },
      { id: 'corporate', label: 'Korporat', icon: 'briefcase' },
      { id: 'social', label: 'Media Sosial', icon: 'share-2' },
      { id: 'tutorial', label: 'Tutorial', icon: 'play-circle' }
    ];

    React.useEffect(() => {
      loadPresets();
    }, []);

    const loadPresets = async () => {
      try {
        const templates = await templateManager.getPresets();
        setPresets(templates);
      } catch (error) {
        console.error('Error loading presets:', error);
      } finally {
        setLoading(false);
      }
    };

    const applyPreset = async (preset) => {
      try {
        const formData = await templateManager.applyPreset(preset.id);
        onSelectTemplate({
          Title: preset.title,
          Content: preset.promptTemplate,
          Style: formData.style,
          Duration: formData.duration,
          Quality: formData.quality,
          ...formData
        });
      } catch (error) {
        alert('Gagal menerapkan preset');
      }
    };

    const filteredPresets = presets.filter(p => p.category === selectedCategory);

    return (
      <div className="space-y-6" data-name="template-presets" data-file="components/TemplatePresets.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-layout-template text-2xl mr-3"></div>
            Template Preset Video
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className={`icon-${category.icon} text-lg mr-2`}></div>
                {category.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
              <p className="text-white/70 mt-4">Memuat preset...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map(preset => (
                <div key={preset.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{preset.title}</h3>
                    <span className="px-2 py-1 bg-cyan-500/30 text-cyan-200 rounded text-xs">
                      {preset.duration}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{preset.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
                        {preset.style}
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded text-xs">
                        {preset.quality}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyPreset(preset)}
                      className="flex-1 btn-primary px-3 py-2 text-sm"
                    >
                      <span className="flex items-center justify-center">
                        <div className="icon-play text-lg mr-1"></div>
                        Gunakan
                      </span>
                    </button>
                    <button
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white text-sm"
                      title="Preview"
                    >
                      <div className="icon-eye text-lg"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('TemplatePresets component error:', error);
    return null;
  }
}