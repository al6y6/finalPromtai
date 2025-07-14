function BatchGenerator({ onSelectPrompt }) {
  try {
    const [formData, setFormData] = React.useState({
      topic: '',
      variations: 3,
      styles: ['cinematic', 'commercial', 'artistic'],
      durations: ['30s', '60s'],
      moods: ['energetic', 'calm'],
      qualities: ['4K'],
      customVariations: false
    });
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [batchResults, setBatchResults] = React.useState([]);
    const [selectedPrompts, setSelectedPrompts] = React.useState([]);

    const availableStyles = ['cinematic', 'documentary', 'commercial', 'artistic', 'minimalist'];
    const availableMoods = ['energetic', 'calm', 'dramatic', 'playful', 'professional'];
    const availableDurations = ['15s', '30s', '60s', '90s', '120s'];
    const availableQualities = ['HD', '4K', '8K'];

    const generateBatch = async () => {
      if (!formData.topic.trim()) {
        alert('Masukkan topik terlebih dahulu');
        return;
      }

      setIsGenerating(true);
      setBatchResults([]);
      
      try {
        const variations = [];
        const totalVariations = formData.variations;
        
        for (let i = 0; i < totalVariations; i++) {
          const variation = {
            id: i + 1,
            topic: formData.topic,
            style: formData.styles[i % formData.styles.length],
            duration: formData.durations[i % formData.durations.length],
            mood: formData.moods[i % formData.moods.length],
            quality: formData.qualities[i % formData.qualities.length]
          };
          variations.push(variation);
        }

        const results = [];
        for (const variation of variations) {
          const prompt = await batchManager.generateVariation(variation);
          results.push({
            ...variation,
            prompt,
            timestamp: new Date().toISOString()
          });
        }

        setBatchResults(results);
        await batchManager.saveBatchResults(formData.topic, results);
        
      } catch (error) {
        console.error('Batch generation error:', error);
        alert('Gagal menghasilkan batch prompt');
      } finally {
        setIsGenerating(false);
      }
    };

    const toggleSelection = (promptId) => {
      setSelectedPrompts(prev => 
        prev.includes(promptId) 
          ? prev.filter(id => id !== promptId)
          : [...prev, promptId]
      );
    };

    const exportSelected = () => {
      if (selectedPrompts.length === 0) {
        alert('Pilih prompt yang ingin diekspor');
        return;
      }
      
      const selected = batchResults.filter(result => selectedPrompts.includes(result.id));
      batchManager.exportBatch(selected, formData.topic);
    };

    return (
      <div className="space-y-6" data-name="batch-generator" data-file="components/BatchGenerator.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-layers text-2xl mr-3"></div>
            Batch Prompt Generator
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-2">Topik Utama</label>
              <textarea
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                placeholder="Masukkan topik untuk dibuat variasi prompt..."
                className="input-modern h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/90 font-medium mb-2">
                  Jumlah Variasi: {formData.variations}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={formData.variations}
                  onChange={(e) => setFormData({...formData, variations: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Gaya Video</label>
                <div className="flex flex-wrap gap-2">
                  {availableStyles.map(style => (
                    <label key={style} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.styles.includes(style)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, styles: [...formData.styles, style]});
                          } else {
                            setFormData({...formData, styles: formData.styles.filter(s => s !== style)});
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 mr-2"
                      />
                      <span className="text-white/80 text-sm">{style}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Durasi</label>
                <div className="space-y-1">
                  {availableDurations.map(duration => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.durations.includes(duration)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, durations: [...formData.durations, duration]});
                          } else {
                            setFormData({...formData, durations: formData.durations.filter(d => d !== duration)});
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 mr-2"
                      />
                      <span className="text-white/80 text-sm">{duration}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Mood</label>
                <div className="space-y-1">
                  {availableMoods.map(mood => (
                    <label key={mood} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.moods.includes(mood)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, moods: [...formData.moods, mood]});
                          } else {
                            setFormData({...formData, moods: formData.moods.filter(m => m !== mood)});
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 mr-2"
                      />
                      <span className="text-white/80 text-sm">{mood}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Kualitas</label>
                <div className="space-y-1">
                  {availableQualities.map(quality => (
                    <label key={quality} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.qualities.includes(quality)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, qualities: [...formData.qualities, quality]});
                          } else {
                            setFormData({...formData, qualities: formData.qualities.filter(q => q !== quality)});
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 mr-2"
                      />
                      <span className="text-white/80 text-sm">{quality}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateBatch}
              disabled={isGenerating || !formData.topic.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Generating {formData.variations} Variations...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <div className="icon-layers text-xl mr-2"></div>
                  Generate {formData.variations} Variasi Prompt
                </span>
              )}
            </button>
          </div>
        </div>

        {batchResults.length > 0 && (
          <div className="card-glass">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Hasil Batch Generation</h3>
              <div className="flex gap-2">
                <span className="text-white/70 text-sm">
                  {selectedPrompts.length} dari {batchResults.length} dipilih
                </span>
                <button
                  onClick={exportSelected}
                  disabled={selectedPrompts.length === 0}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  Export Terpilih
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {batchResults.map(result => (
                <div key={result.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPrompts.includes(result.id)}
                        onChange={() => toggleSelection(result.id)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <h4 className="font-semibold text-white">Variasi #{result.id}</h4>
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded text-xs">
                        {result.style}
                      </span>
                      <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded text-xs">
                        {result.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {result.prompt.substring(0, 120)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-xs">
                      {result.mood} • {result.quality}
                    </span>
                    <button
                      onClick={() => onSelectPrompt(result.prompt)}
                      className="btn-primary px-3 py-1 text-sm"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('BatchGenerator component error:', error);
    return null;
  }
}