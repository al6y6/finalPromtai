function PreviewGenerator({ prompt }) {
  try {
    const [preview, setPreview] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);

    const generatePreview = async () => {
      if (!prompt) return;
      
      setIsGenerating(true);
      try {
        const systemPrompt = `You are a visual description generator. Create a detailed visual preview description based on the video prompt. Focus on:
- Key visual elements and scenes
- Camera angles and movements
- Lighting and color palette
- Overall mood and atmosphere
Format as a concise but vivid description.`;

        const userPrompt = `Generate a visual preview description for this video prompt: ${prompt}`;
        const result = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
        setPreview(result);
      } catch (error) {
        alert('Gagal menghasilkan preview');
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <div className="space-y-6" data-name="preview-generator" data-file="components/PreviewGenerator.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-play text-2xl mr-3"></div>
            Preview Generator
          </h2>
          
          {!prompt ? (
            <div className="text-center py-8">
              <div className="icon-image text-4xl text-white/30 mb-4"></div>
              <p className="text-white/70">Generate prompt terlebih dahulu untuk melihat preview</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">Prompt Saat Ini:</h3>
                <p className="text-white/70 text-sm">{prompt.substring(0, 200)}...</p>
              </div>
              
              <button
                onClick={generatePreview}
                disabled={isGenerating}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Generating Preview...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <div className="icon-eye text-xl mr-2"></div>
                    Generate Visual Preview
                  </span>
                )}
              </button>

              <VideoPreview prompt={prompt} />

              {preview && (
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <div className="icon-image text-xl mr-2"></div>
                    Visual Preview
                  </h3>
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <p className="text-white/90 leading-relaxed">{preview}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="icon-camera text-2xl text-cyan-400 mb-2"></div>
                      <p className="text-white/70 text-sm">Camera Work</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="icon-palette text-2xl text-purple-400 mb-2"></div>
                      <p className="text-white/70 text-sm">Color Palette</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="icon-zap text-2xl text-yellow-400 mb-2"></div>
                      <p className="text-white/70 text-sm">Mood & Energy</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('PreviewGenerator component error:', error);
    return null;
  }
}