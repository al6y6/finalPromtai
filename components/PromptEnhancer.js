function PromptEnhancer({ onSelectPrompt }) {
  try {
    const [inputPrompt, setInputPrompt] = React.useState('');
    const [enhancementType, setEnhancementType] = React.useState('cinematic');
    const [intensity, setIntensity] = React.useState('medium');
    const [isEnhancing, setIsEnhancing] = React.useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = React.useState('');

    const enhancementTypes = [
      { id: 'cinematic', name: 'Cinematic Enhancement', desc: 'Add cinematic flair' },
      { id: 'technical', name: 'Technical Boost', desc: 'Enhance technical details' },
      { id: 'artistic', name: 'Artistic Vision', desc: 'Add artistic elements' },
      { id: 'commercial', name: 'Commercial Polish', desc: 'Professional commercial style' },
      { id: 'dramatic', name: 'Dramatic Impact', desc: 'Increase emotional impact' },
      { id: 'modern', name: 'Modern Trendy', desc: 'Add current trends' }
    ];

    const intensityLevels = [
      { id: 'subtle', name: 'Subtle', desc: 'Light enhancement' },
      { id: 'medium', name: 'Medium', desc: 'Balanced enhancement' },
      { id: 'strong', name: 'Strong', desc: 'Bold enhancement' },
      { id: 'extreme', name: 'Extreme', desc: 'Maximum enhancement' }
    ];

    const enhancePrompt = async () => {
      if (!inputPrompt.trim()) {
        alert('Masukkan prompt terlebih dahulu');
        return;
      }

      setIsEnhancing(true);
      try {
        const systemPrompt = `You are a professional video prompt enhancer. Your task is to enhance video prompts with ${enhancementType} style at ${intensity} intensity level.

Enhancement Guidelines:
- Add specific visual details and technical specifications
- Include camera movements, lighting, and composition
- Enhance mood and atmosphere
- Add professional terminology
- Maintain the original concept while improving quality
- Make the prompt more detailed and specific`;

        const userPrompt = `Enhance this video prompt with ${enhancementType} style at ${intensity} intensity:

Original Prompt: ${inputPrompt}

Please provide an enhanced version that includes:
1. Detailed visual descriptions
2. Professional camera work specifications
3. Lighting and color details
4. Enhanced mood and atmosphere
5. Technical parameters
6. Style-specific elements for ${enhancementType}`;

        const enhanced = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
        setEnhancedPrompt(enhanced);
        alert('Prompt berhasil ditingkatkan!');
      } catch (error) {
        console.error('Enhancement error:', error);
        alert('Gagal meningkatkan prompt');
      } finally {
        setIsEnhancing(false);
      }
    };

    return (
      <div className="space-y-6" data-name="prompt-enhancer" data-file="components/PromptEnhancer.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-magic-wand text-2xl mr-3"></div>
            AI Prompt Enhancer
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-2">Input Prompt</label>
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Masukkan prompt yang ingin ditingkatkan..."
                className="input-modern h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/90 font-medium mb-3">Enhancement Type</label>
                <div className="space-y-2">
                  {enhancementTypes.map(type => (
                    <label key={type.id} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10">
                      <input
                        type="radio"
                        name="enhancement-type"
                        value={type.id}
                        checked={enhancementType === type.id}
                        onChange={(e) => setEnhancementType(e.target.value)}
                        className="w-4 h-4 text-indigo-600 mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">{type.name}</div>
                        <div className="text-white/60 text-sm">{type.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-3">Enhancement Intensity</label>
                <div className="space-y-2">
                  {intensityLevels.map(level => (
                    <label key={level.id} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10">
                      <input
                        type="radio"
                        name="intensity"
                        value={level.id}
                        checked={intensity === level.id}
                        onChange={(e) => setIntensity(e.target.value)}
                        className="w-4 h-4 text-indigo-600 mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">{level.name}</div>
                        <div className="text-white/60 text-sm">{level.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={enhancePrompt}
              disabled={isEnhancing || !inputPrompt.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isEnhancing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Enhancing Prompt...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <div className="icon-sparkles text-xl mr-2"></div>
                  Enhance Prompt
                </span>
              )}
            </button>

            {enhancedPrompt && (
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">Enhanced Prompt</h3>
                  <button
                    onClick={() => onSelectPrompt(enhancedPrompt)}
                    className="btn-primary px-4 py-2"
                  >
                    Use Enhanced
                  </button>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white/90 leading-relaxed">{enhancedPrompt}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PromptEnhancer component error:', error);
    return null;
  }
}