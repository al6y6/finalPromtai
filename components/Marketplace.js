function Marketplace({ onSelectTemplate }) {
  try {
    const [templates, setTemplates] = React.useState([]);
    const [categories, setCategories] = React.useState(['all', 'premium', 'free', 'trending']);
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadMarketplaceTemplates();
    }, [selectedCategory]);

    const loadMarketplaceTemplates = async () => {
      try {
        // Mock marketplace data - in real app would fetch from API
        const mockTemplates = [
          {
            id: 'premium_cinematic',
            title: 'Hollywood Cinematic Pack',
            description: 'Professional cinematic templates used by major studios',
            price: 29.99,
            rating: 4.9,
            downloads: 1250,
            author: 'StudioPro',
            category: 'premium',
            preview: 'Cinematic drone shot of city skyline at golden hour...',
            tags: ['cinematic', 'professional', 'drone', 'urban']
          },
          {
            id: 'free_social',
            title: 'Social Media Starter Pack',
            description: 'Perfect templates for Instagram and TikTok content',
            price: 0,
            rating: 4.5,
            downloads: 3420,
            author: 'ContentCreator',
            category: 'free',
            preview: 'Quick-cut social media video with trending music...',
            tags: ['social', 'instagram', 'tiktok', 'trending']
          },
          {
            id: 'trending_ai',
            title: 'AI Future Tech Collection',
            description: 'Futuristic AI and technology themed templates',
            price: 19.99,
            rating: 4.7,
            downloads: 890,
            author: 'TechVision',
            category: 'trending',
            preview: 'Neon-lit cyberpunk cityscape with holographic elements...',
            tags: ['ai', 'cyberpunk', 'technology', 'neon']
          }
        ];

        const filtered = selectedCategory === 'all' 
          ? mockTemplates 
          : mockTemplates.filter(t => t.category === selectedCategory);
        
        setTemplates(filtered);
      } catch (error) {
        console.error('Error loading marketplace:', error);
      } finally {
        setLoading(false);
      }
    };

    const purchaseTemplate = async (template) => {
      if (template.price === 0) {
        // Free template
        onSelectTemplate({
          Title: template.title,
          Content: template.preview,
          Style: 'marketplace',
          Duration: '60s',
          Quality: '4K'
        });
        alert('Template gratis berhasil ditambahkan!');
      } else {
        // Paid template - would integrate with payment system
        if (confirm(`Purchase ${template.title} for $${template.price}?`)) {
          onSelectTemplate({
            Title: template.title,
            Content: template.preview,
            Style: 'premium',
            Duration: '60s',
            Quality: '4K'
          });
          alert('Template berhasil dibeli dan ditambahkan!');
        }
      }
    };

    return (
      <div className="space-y-6" data-name="marketplace" data-file="components/Marketplace.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-shopping-cart text-2xl mr-3"></div>
            Template Marketplace
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
              <p className="text-white/70 mt-4">Loading marketplace...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{template.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      template.price === 0 
                        ? 'bg-green-500/30 text-green-200' 
                        : 'bg-yellow-500/30 text-yellow-200'
                    }`}>
                      {template.price === 0 ? 'FREE' : `$${template.price}`}
                    </span>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3">{template.description}</p>
                  <p className="text-white/60 text-xs mb-3 italic">{template.preview.substring(0, 60)}...</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="icon-star text-yellow-400 text-sm"></div>
                        <span className="text-white/70 text-sm ml-1">{template.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="icon-download text-blue-400 text-sm"></div>
                        <span className="text-white/70 text-sm ml-1">{template.downloads}</span>
                      </div>
                    </div>
                    <span className="text-white/50 text-xs">by {template.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => purchaseTemplate(template)}
                    className="btn-primary w-full"
                  >
                    {template.price === 0 ? 'Download Free' : `Buy for $${template.price}`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Marketplace component error:', error);
    return null;
  }
}