function PromptForm({ onGenerate, isLoading, apiStatus, onShowApiWarning }) {
  try {
    const [formData, setFormData] = React.useState({
      topic: '',
      style: 'cinematic',
      duration: '30s',
      mood: 'energetic',
      quality: '4K'
    });

    const styles = ['cinematic', 'documentary', 'commercial', 'artistic', 'minimalist'];
    const moods = ['energetic', 'calm', 'dramatic', 'playful', 'professional'];
    const durations = ['15s', '30s', '60s', '90s', '120s'];
    const qualities = ['HD', '4K', '8K'];

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.topic.trim()) return;
      
      onGenerate(formData);
    };

    return (
      <div className="card-glass mb-8" data-name="prompt-form" data-file="components/PromptForm.js">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/90 font-medium mb-2">Topik Video</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              placeholder="Masukkan topik atau ide video Anda..."
              className="input-modern"
              required
            />
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-white/90 font-medium mb-2">Gaya</label>
              <select 
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="input-modern"
              >
                {styles.map(style => (
                  <option key={style} value={style} className="text-gray-800">
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Durasi</label>
              <select 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="input-modern"
              >
                {durations.map(duration => (
                  <option key={duration} value={duration} className="text-gray-800">
                    {duration}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Mood</label>
              <select 
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value})}
                className="input-modern"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood} className="text-gray-800">
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Kualitas</label>
              <select 
                value={formData.quality}
                onChange={(e) => setFormData({...formData, quality: e.target.value})}
                className="input-modern"
              >
                {qualities.map(quality => (
                  <option key={quality} value={quality} className="text-gray-800">
                    {quality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.topic.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <div className="icon-sparkles text-xl mr-2"></div>
                Generate Prompt Video
              </span>
            )}
          </button>
        </form>
      </div>
    );
  } catch (error) {
    console.error('PromptForm component error:', error);
    return null;
  }
}