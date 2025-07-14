function HistoryPanel({ onSelectPrompt }) {
  try {
    const [history, setHistory] = React.useState([]);
    const [veo3History, setVeo3History] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadHistory();
      loadVeo3History();
    }, []);

    const loadHistory = async () => {
      try {
        // Check if trickleListObjects is available
        if (typeof trickleListObjects === 'undefined') {
          console.warn('Database not available, using local storage fallback');
          const localHistory = JSON.parse(localStorage.getItem('videoPromptHistory') || '[]');
          setHistory(localHistory.map((item, index) => ({
            ...item,
            objectId: item.objectId || `local_${index}_${Date.now()}`
          })));
          setLoading(false);
          return;
        }
        
        const result = await trickleListObjects('prompt_history', 20, true, undefined);
        setHistory((result.items || []).map((item, index) => ({
          ...item,
          objectId: item.objectId || `db_${index}_${Date.now()}`
        })));
      } catch (error) {
        console.error('Error loading history:', error);
        // Fallback to localStorage
        try {
          const localHistory = JSON.parse(localStorage.getItem('videoPromptHistory') || '[]');
          setHistory(localHistory.map((item, index) => ({
            ...item,
            objectId: item.objectId || `fallback_${index}_${Date.now()}`
          })));
        } catch (localError) {
          console.error('Error loading local history:', localError);
          setHistory([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const loadVeo3History = async () => {
      try {
        const veo3Items = await historyManager.getVeo3History();
        setVeo3History(veo3Items.map((item, index) => ({
          ...item,
          objectId: item.objectId || `veo3_${index}_${Date.now()}`
        })));
      } catch (error) {
        console.error('Error loading Veo 3 history:', error);
        setVeo3History([]);
      }
    };

    const deleteHistory = async (objectId) => {
      try {
        await trickleDeleteObject('prompt_history', objectId);
        await loadHistory();
      } catch (error) {
        alert('Gagal menghapus history');
      }
    };

    const clearAllHistory = async () => {
      if (confirm('Hapus semua history? Tindakan ini tidak dapat dibatalkan.')) {
        try {
          if (activeTab === 'veo3') {
            await historyManager.clearVeo3History();
            await loadVeo3History();
          } else {
            for (const item of history) {
              await trickleDeleteObject('prompt_history', item.objectId);
            }
            await loadHistory();
          }
        } catch (error) {
          alert('Gagal menghapus history');
        }
      }
    };

    if (loading) {
      return (
        <div className="card-glass text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
          <p className="text-white/70 mt-4">Memuat history...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4" data-name="history-panel" data-file="components/HistoryPanel.js">
        <div className="card-glass">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <div className="icon-clock text-2xl mr-3"></div>
              History Prompt
            </h2>
            <div className="flex gap-2">
              {((activeTab === 'all' && history.length > 0) || (activeTab === 'veo3' && veo3History.length > 0)) && (
                <button
                  onClick={clearAllHistory}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  <div className="icon-trash-2 text-lg mr-1"></div>
                  Hapus Semua
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <div className="icon-list text-lg mr-2"></div>
              Semua Prompt
            </button>
            <button
              onClick={() => setActiveTab('veo3')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'veo3'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <div className="icon-zap text-lg mr-2"></div>
              Google Veo 3
            </button>
          </div>
          
          {activeTab === 'all' ? (
            history.length === 0 ? (
              <div className="text-center py-8">
                <div className="icon-clock text-4xl text-white/30 mb-4"></div>
                <p className="text-white/70">Belum ada history prompt</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.objectId} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{item.objectData.Title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectPrompt(item.objectData.Content)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <div className="icon-refresh-cw text-lg"></div>
                        </button>
                        <button
                          onClick={() => deleteHistory(item.objectId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <div className="icon-trash-2 text-lg"></div>
                        </button>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{item.objectData.Content.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 bg-indigo-500/30 text-indigo-200 rounded text-xs">
                        {item.objectData.Category}
                      </span>
                      <span className="text-white/50 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            veo3History.length === 0 ? (
              <div className="text-center py-8">
                <div className="icon-zap text-4xl text-white/30 mb-4"></div>
                <p className="text-white/70">Belum ada history Google Veo 3</p>
              </div>
            ) : (
              <div className="space-y-3">
                {veo3History.map(item => (
                  <div key={item.objectId} className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="icon-zap text-lg text-blue-400"></div>
                        <h3 className="font-semibold text-white">{item.objectData.Title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectPrompt(item.objectData.Content)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <div className="icon-refresh-cw text-lg"></div>
                        </button>
                        <button
                          onClick={() => deleteHistory(item.objectId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <div className="icon-trash-2 text-lg"></div>
                        </button>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{item.objectData.Content.substring(0, 100)}...</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded text-xs">
                        Veo 3
                      </span>
                      <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs">
                        {item.objectData.Resolution || '8K'}
                      </span>
                      <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded text-xs">
                        {item.objectData.Duration || '5s'}
                      </span>
                      {item.objectData.VoiceLanguage && (
                        <span className="px-2 py-1 bg-yellow-500/30 text-yellow-200 rounded text-xs">
                          {item.objectData.VoiceLanguage}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-xs">
                        Camera: {item.objectData.CameraMovement || 'N/A'}
                      </span>
                      <span className="text-white/50 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('HistoryPanel component error:', error);
    return null;
  }
}