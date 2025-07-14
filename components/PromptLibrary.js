function PromptLibrary({ onSelectPrompt }) {
  try {
    const [library, setLibrary] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('cinematic');
    const [searchTerm, setSearchTerm] = React.useState('');

    const categories = [
      { id: 'cinematic', name: 'Cinematic', icon: 'film' },
      { id: 'commercial', name: 'Commercial', icon: 'megaphone' },
      { id: 'artistic', name: 'Artistic', icon: 'palette' },
      { id: 'technical', name: 'Technical', icon: 'settings' },
      { id: 'trending', name: 'Trending', icon: 'trending-up' }
    ];

    React.useEffect(() => {
      loadLibrary();
    }, [selectedCategory]);

    const loadLibrary = () => {
      const mockLibrary = {
        cinematic: [
          {
            id: 'cin1',
            title: 'Epic Drone Shot',
            prompt: 'Cinematic aerial drone shot soaring over vast mountain landscape at golden hour, dramatic shadows, 4K resolution, smooth camera movement',
            tags: ['drone', 'landscape', 'golden-hour'],
            rating: 4.8
          }
        ],
        commercial: [
          {
            id: 'com1', 
            title: 'Product Showcase',
            prompt: 'Professional product showcase with rotating display, studio lighting, clean background, commercial photography style',
            tags: ['product', 'studio', 'professional'],
            rating: 4.6
          }
        ]
      };
      
      setLibrary(mockLibrary[selectedCategory] || []);
    };

    const filteredLibrary = library.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6" data-name="prompt-library" data-file="components/PromptLibrary.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-book-open text-2xl mr-3"></div>
            Prompt Library
          </h2>
          
          <div className="space-y-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts..."
              className="input-modern"
            />

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    selectedCategory === cat.id ? 'bg-indigo-600' : 'bg-white/10'
                  }`}
                >
                  <div className={`icon-${cat.icon} text-lg mr-2`}></div>
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {filteredLibrary.map(item => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <span className="text-yellow-400">★ {item.rating}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{item.prompt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => onSelectPrompt(item.prompt)}
                      className="btn-primary px-3 py-1 text-sm"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PromptLibrary error:', error);
    return null;
  }
}