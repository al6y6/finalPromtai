function CommunityGallery({ onSelectPrompt }) {
  try {
    const [gallery, setGallery] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedCategory, setSelectedCategory] = React.useState('all');

    const categories = [
      { id: 'all', label: 'Semua', icon: 'grid-3x3' },
      { id: 'marketing', label: 'Marketing', icon: 'megaphone' },
      { id: 'entertainment', label: 'Entertainment', icon: 'film' },
      { id: 'education', label: 'Education', icon: 'graduation-cap' }
    ];

    React.useEffect(() => {
      loadGallery();
    }, []);

    const loadGallery = async () => {
      try {
        // Check if trickleListObjects is available
        if (typeof trickleListObjects === 'undefined') {
          console.warn('Database not available, using mock data');
          setGallery(getMockGalleryData());
          setLoading(false);
          return;
        }
        
        const result = await trickleListObjects('community_gallery', 20, true, undefined);
        setGallery((result.items || []).map((item, index) => ({
          ...item,
          objectId: item.objectId || `gallery_${index}_${Date.now()}`
        })));
      } catch (error) {
        console.error('Error loading gallery:', error);
        // Use mock data as fallback
        setGallery(getMockGalleryData());
      } finally {
        setLoading(false);
      }
    };

    const getMockGalleryData = () => [
      {
        objectId: 'mock1',
        objectData: {
          Title: 'Google Veo 3 Cinematic Demo',
          Content: 'Ultra-high resolution cinematic sequence with dynamic camera movements and photorealistic lighting.',
          Author: 'AI Studio Pro',
          Category: 'entertainment',
          Tags: '["veo3", "cinematic", "entertainment"]',
          Likes: 125,
          Downloads: 89,
          Style: 'cinematic',
          Duration: '60s',
          Quality: '8K'
        },
        createdAt: new Date().toISOString()
      }
    ];

    const likePrompt = async (objectId) => {
      try {
        const item = gallery.find(g => g.objectId === objectId);
        if (item) {
          await trickleUpdateObject('community_gallery', objectId, {
            ...item.objectData,
            Likes: (item.objectData.Likes || 0) + 1
          });
          await loadGallery();
        }
      } catch (error) {
        console.error('Error liking prompt:', error);
      }
    };

    const downloadPrompt = async (item) => {
      try {
        await trickleUpdateObject('community_gallery', item.objectId, {
          ...item.objectData,
          Downloads: (item.objectData.Downloads || 0) + 1
        });
        onSelectPrompt(item.objectData.Content);
        await loadGallery();
      } catch (error) {
        console.error('Error downloading prompt:', error);
      }
    };

    const filteredGallery = selectedCategory === 'all' 
      ? gallery 
      : gallery.filter(g => g.objectData.Category === selectedCategory);

    return (
      <div className="space-y-6" data-name="community-gallery" data-file="components/CommunityGallery.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-users text-2xl mr-3"></div>
            Community Gallery
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
              <p className="text-white/70 mt-4">Memuat gallery...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGallery.map(item => (
                <div key={item.objectId} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{item.objectData.Title}</h3>
                    <span className="text-white/50 text-xs">by {item.objectData.Author}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{item.objectData.Content.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-2">
                      {(() => {
                        try {
                          const tags = JSON.parse(item.objectData.Tags || '[]');
                          return tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={`${item.objectId}_tag_${tagIndex}`} className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
                              {tag}
                            </span>
                          ));
                        } catch {
                          return [];
                        }
                      })()}
                    </div>
                    <span className="px-2 py-1 bg-cyan-500/30 text-cyan-200 rounded text-xs">
                      {item.objectData.Duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => likePrompt(item.objectId)}
                        className="flex items-center text-red-400 hover:text-red-300"
                      >
                        <div className="icon-heart text-sm mr-1"></div>
                        {item.objectData.Likes || 0}
                      </button>
                      <span className="flex items-center text-white/50">
                        <div className="icon-download text-sm mr-1"></div>
                        {item.objectData.Downloads || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => downloadPrompt(item)}
                      className="btn-primary px-3 py-1 text-sm"
                    >
                      Use
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
    console.error('CommunityGallery component error:', error);
    return null;
  }
}