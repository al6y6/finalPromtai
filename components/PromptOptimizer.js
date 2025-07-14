function PromptOptimizer({ prompt, onOptimizedPrompt }) {
  try {
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [optimizationLevel, setOptimizationLevel] = React.useState('balanced');
    const [targetPlatform, setTargetPlatform] = React.useState('veo3');
    const [optimizationFocus, setOptimizationFocus] = React.useState('quality');

    const platforms = [
      { id: 'veo3', name: 'Google Veo 3', icon: 'zap' },
      { id: 'sora', name: 'OpenAI Sora', icon: 'cpu' },
      { id: 'runway', name: 'Runway ML', icon: 'play' },
      { id: 'pika', name: 'Pika Labs', icon: 'film' }
    ];

    const levels = [
      { id: 'conservative', name: 'Konservatif', desc: 'Optimasi minimal' },
      { id: 'balanced', name: 'Seimbang', desc: 'Balance kualitas dan kecepatan' },
      { id: 'aggressive', name: 'Agresif', desc: 'Optimasi maksimal' }
    ];

    const focuses = [
      { id: 'quality', name: 'Kualitas Visual', icon: 'eye' },
      { id: 'speed', name: 'Kecepatan Render', icon: 'zap' },
      { id: 'consistency', name: 'Konsistensi', icon: 'check-circle' },
      { id: 'creativity', name: 'Kreativitas', icon: 'sparkles' }
    ];

    const optimizePrompt = async () => {
      if (!prompt) {
        alert('Tidak ada prompt untuk dioptimasi');
        return;
      }

      setIsOptimizing(true);
      try {
        const systemPrompt = `You are an expert AI video prompt optimizer specializing in ${targetPlatform.toUpperCase()} optimization. Your task is to optimize prompts for maximum quality and performance.

Optimization Level: ${optimizationLevel}
Target Platform: ${targetPlatform}
Focus Area: ${optimizationFocus}

Guidelines:
- Enhance technical specifications for ${targetPlatform}
- Optimize for ${optimizationFocus} performance
- Maintain original creative intent
- Add platform-specific optimizations
- Include advanced parameters when beneficial
- Ensure prompt length is optimal for the platform`;

        const userPrompt = `Optimize this video prompt for ${targetPlatform.toUpperCase()} with ${optimizationLevel} optimization level, focusing on ${optimizationFocus}:

Original Prompt: ${prompt}

Please provide an optimized version that:
1. Enhances technical specifications
2. Improves platform compatibility  
3. Optimizes for the focus area
4. Maintains creative vision
5. Adds relevant advanced parameters`;

        const optimized = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
        onOptimizedPrompt(optimized);
      } catch (error) {
        alert('Gagal mengoptimasi prompt');
      } finally {
        setIsOptimizing(false);
      }
    };

    return (
      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-4 border border-orange-500/20" data-name="prompt-optimizer" data-file="components/PromptOptimizer.js">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <div className="icon-settings text-lg mr-2"></div>
          Prompt Optimizer
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white/90 font-medium mb-2">Target Platform</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setTargetPlatform(platform.id)}
                  className={`flex items-center p-2 rounded-lg border transition-all duration-200 ${
                    targetPlatform === platform.id
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <div className={`icon-${platform.icon} text-lg mr-2`}></div>
                  <span className="text-sm">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 font-medium mb-2">Level Optimasi</label>
              <div className="space-y-2">
                {levels.map(level => (
                  <label key={level.id} className="flex items-center">
                    <input
                      type="radio"
                      name="optimization-level"
                      value={level.id}
                      checked={optimizationLevel === level.id}
                      onChange={(e) => setOptimizationLevel(e.target.value)}
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

            <div>
              <label className="block text-white/90 font-medium mb-2">Fokus Optimasi</label>
              <div className="grid grid-cols-2 gap-2">
                {focuses.map(focus => (
                  <button
                    key={focus.id}
                    onClick={() => setOptimizationFocus(focus.id)}
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                      optimizationFocus === focus.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <div className={`icon-${focus.icon} text-lg mr-2`}></div>
                    <span className="text-sm">{focus.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={optimizePrompt}
            disabled={isOptimizing || !prompt}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isOptimizing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Mengoptimasi Prompt...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <div className="icon-zap text-xl mr-2"></div>
                Optimasi Prompt untuk {platforms.find(p => p.id === targetPlatform)?.name}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PromptOptimizer component error:', error);
    return null;
  }
}