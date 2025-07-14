function TemplateGallery({ onSelectTemplate }) {
  try {
    const [templates, setTemplates] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    const categories = [
      { id: 'all', label: 'Semua', icon: 'grid-3x3' },
      { id: 'marketing', label: 'Marketing', icon: 'megaphone' },
      { id: 'entertainment', label: 'Entertainment', icon: 'film' },
      { id: 'education', label: 'Education', icon: 'graduation-cap' }
    ];

    React.useEffect(() => {
      loadTemplates();
    }, []);

    const loadTemplates = async () => {
      try {
        if (typeof trickleListObjects === 'undefined') {
          console.warn('Database not available, using mock templates');
          setTemplates([]);
          setLoading(false);
          return;
        }
        
        const result = await trickleListObjects('prompt_favorite', 20, true, undefined);
        setTemplates((result.items || []).map((item, index) => ({
          ...item,
          objectId: item.objectId || `template_${index}_${Date.now()}`
        })));
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    const filteredTemplates = selectedCategory === 'all' 
      ? templates 
      : templates.filter(t => t.objectData.Category === selectedCategory);

    return (
      <div className="space-y-6" data-name="template-gallery" data-file="components/TemplateGallery.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-layout-template text-2xl mr-3"></div>
            Galeri Template Prompt
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
              <p className="text-white/70 mt-4">Memuat template...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <div key={template.objectId} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{template.objectData.Title}</h3>
                    <span className="px-2 py-1 bg-cyan-500/30 text-cyan-200 rounded text-xs">
                      {template.objectData.Duration}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{template.objectData.Content}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {(() => {
                        try {
                          const tags = JSON.parse(template.objectData.Tags || '[]');
                          return tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={`${template.objectId}_tag_${tagIndex}`} className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
                              {tag}
                            </span>
                          ));
                        } catch {
                          return [];
                        }
                      })()}
                    </div>
                    <button
                      onClick={() => onSelectTemplate(template.objectData)}
                      className="btn-primary px-3 py-1 text-sm"
                    >
                      Gunakan
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
    console.error('TemplateGallery component error:', error);
    return null;
  }
}