function FavoritesPanel({ onSelectPrompt }) {
  try {
    const [favorites, setFavorites] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadFavorites();
    }, []);

    const loadFavorites = async () => {
      try {
        // Check if trickleListObjects is available
        if (typeof trickleListObjects === 'undefined') {
          console.warn('Database not available, using local storage fallback');
          const localFavorites = JSON.parse(localStorage.getItem('videoPromptFavorites') || '[]');
          setFavorites(localFavorites.map((item, index) => ({
            ...item,
            objectId: item.objectId || `local_fav_${index}_${Date.now()}`
          })));
          setLoading(false);
          return;
        }
        
        const result = await trickleListObjects('prompt_favorite', 20, true, undefined);
        setFavorites((result.items || []).map((item, index) => ({
          ...item,
          objectId: item.objectId || `db_fav_${index}_${Date.now()}`
        })));
      } catch (error) {
        console.error('Error loading favorites:', error);
        // Fallback to localStorage
        try {
          const localFavorites = JSON.parse(localStorage.getItem('videoPromptFavorites') || '[]');
          setFavorites(localFavorites.map((item, index) => ({
            ...item,
            objectId: item.objectId || `fallback_fav_${index}_${Date.now()}`
          })));
        } catch (localError) {
          console.error('Error loading local favorites:', localError);
          setFavorites([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const deleteFavorite = async (objectId) => {
      try {
        await trickleDeleteObject('prompt_favorite', objectId);
        await loadFavorites();
      } catch (error) {
        alert('Gagal menghapus favorit');
      }
    };

    if (loading) {
      return (
        <div className="card-glass text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
          <p className="text-white/70 mt-4">Memuat favorit...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4" data-name="favorites-panel" data-file="components/FavoritesPanel.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <div className="icon-heart text-2xl mr-3"></div>
            Prompt Favorit Anda
          </h2>
          
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <div className="icon-heart text-4xl text-white/30 mb-4"></div>
              <p className="text-white/70">Belum ada prompt favorit</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {favorites.map(fav => (
                <div key={fav.objectId} className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{fav.objectData.Title}</h3>
                    <button
                      onClick={() => deleteFavorite(fav.objectId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <div className="icon-trash-2 text-lg"></div>
                    </button>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{fav.objectData.Content}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-indigo-500/30 text-indigo-200 rounded text-xs">
                        {fav.objectData.Category}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs">
                        {fav.objectData.Style}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectPrompt(fav.objectData.Content)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <div className="icon-arrow-right text-lg"></div>
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
    console.error('FavoritesPanel component error:', error);
    return null;
  }
}