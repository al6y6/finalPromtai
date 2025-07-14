function AdvancedPromptOptimizer({ inputPrompt, formData, onOptimizedPrompt }) {
  try {
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [optimizationLevel, setOptimizationLevel] = React.useState('professional');
    const [targetAudience, setTargetAudience] = React.useState('general');
    const [creativityLevel, setCreativityLevel] = React.useState('balanced');
    const [optimizedResults, setOptimizedResults] = React.useState([]);
    const [selectedOptimization, setSelectedOptimization] = React.useState(null);
    const [presets, setPresets] = React.useState([]);
    const [presetName, setPresetName] = React.useState('');
    const [showPresets, setShowPresets] = React.useState(false);
    const [showHistory, setShowHistory] = React.useState(false);
    const [optimizationHistory, setOptimizationHistory] = React.useState([]);

    const optimizationLevels = [
      { id: 'basic', name: 'Basic', desc: 'Perbaikan dasar prompt' },
      { id: 'professional', name: 'Professional', desc: 'Optimasi tingkat profesional' },
      { id: 'cinematic', name: 'Cinematic', desc: 'Kualitas sinematik tinggi' },
      { id: 'commercial', name: 'Commercial', desc: 'Standar komersial premium' }
    ];

    const audiences = [
      { id: 'general', name: 'General Audience', desc: 'Untuk semua kalangan' },
      { id: 'professional', name: 'Professional', desc: 'Untuk profesional industri' },
      { id: 'social', name: 'Social Media', desc: 'Untuk platform media sosial' },
      { id: 'marketing', name: 'Marketing', desc: 'Untuk keperluan marketing' }
    ];

    const creativityLevels = [
      { id: 'conservative', name: 'Conservative', desc: 'Tetap pada konsep asli' },
      { id: 'balanced', name: 'Balanced', desc: 'Seimbang antara asli dan kreatif' },
      { id: 'creative', name: 'Creative', desc: 'Tambahkan elemen kreatif' },
      { id: 'experimental', name: 'Experimental', desc: 'Eksplorasi ide baru' }
    ];

    React.useEffect(() => {
      loadPresets();
      loadOptimizationHistory();
    }, []);

    const loadPresets = () => {
      setPresets(optimizationManager.presets);
    };

    const loadOptimizationHistory = () => {
      setOptimizationHistory(optimizationManager.history);
    };

    const savePreset = async () => {
      if (!presetName.trim()) {
        alert('Masukkan nama preset');
        return;
      }
      
      try {
        await optimizationManager.savePreset({
          name: presetName,
          optimizationLevel,
          targetAudience,
          creativityLevel
        });
        setPresetName('');
        loadPresets();
        alert('Preset berhasil disimpan!');
      } catch (error) {
        alert(error.message);
      }
    };

    const loadPreset = (preset) => {
      setOptimizationLevel(preset.optimizationLevel);
      setTargetAudience(preset.targetAudience);
      setCreativityLevel(preset.creativityLevel);
      setShowPresets(false);
      alert(`Preset "${preset.name}" berhasil dimuat!`);
    };

    const deletePreset = async (presetId) => {
      if (confirm('Hapus preset ini?')) {
        try {
          await optimizationManager.deletePreset(presetId);
          loadPresets();
        } catch (error) {
          alert(error.message);
        }
      }
    };

    const optimizePrompt = async () => {
      if (!inputPrompt?.trim()) {
        alert('Masukkan prompt terlebih dahulu');
        return;
      }

      setIsOptimizing(true);
      try {
        // Generate multiple optimization variants
        const optimizations = await Promise.all([
          generateOptimization('technical'),
          generateOptimization('creative'),
          generateOptimization('commercial')
        ]);

        setOptimizedResults(optimizations);
        
        // Save to history
        optimizations.forEach(opt => {
          optimizationManager.saveToHistory({
            originalPrompt: inputPrompt,
            optimizedPrompt: opt.prompt,
            settings: { optimizationLevel, targetAudience, creativityLevel },
            score: opt.score,
            variant: opt.type
          });
        });
        
        loadOptimizationHistory();
      } catch (error) {
        console.error('Optimization error:', error);
        alert('Gagal mengoptimasi prompt');
      } finally {
        setIsOptimizing(false);
      }
    };

    const generateOptimization = async (variant) => {
      const systemPrompt = `You are an expert Google Veo 3 prompt optimizer specializing in ${variant} optimization. Create highly optimized prompts for maximum video generation quality.

Optimization Parameters:
- Level: ${optimizationLevel}
- Target Audience: ${targetAudience}
- Creativity: ${creativityLevel}
- Variant: ${variant}
- Platform: Google Veo 3

Guidelines for ${variant} optimization:
${variant === 'technical' ? 
  '- Focus on technical specifications, camera settings, lighting details\n- Add precise technical parameters\n- Include professional video terminology' :
  variant === 'creative' ?
  '- Enhance artistic vision and creative elements\n- Add unique visual concepts\n- Increase emotional impact and storytelling' :
  '- Optimize for commercial appeal and market viability\n- Focus on brand-safe content\n- Enhance professional presentation'
}`;

      const contextualInfo = `
Original Concept: ${inputPrompt}
Video Settings: ${formData?.duration || '30s'} duration, ${formData?.resolution || '4K'} quality
Style: ${formData?.customStyle || formData?.style || 'cinematic'}
Audio: ${formData?.voiceLanguage || 'indonesian'} voice, ${formData?.audioStyle || 'cinematic'} style
Characters: ${formData?.characters || 'Not specified'}
Environment: ${formData?.environment || 'outdoor'}
`;

      const userPrompt = `Optimize this Google Veo 3 prompt with ${variant} focus:

${contextualInfo}

Create an enhanced prompt that:
1. Maximizes Veo 3 capabilities
2. Applies ${variant} optimization principles
3. Targets ${targetAudience} audience
4. Uses ${creativityLevel} creativity level
5. Maintains ${optimizationLevel} quality standards

Return only the optimized prompt text.`;

      const result = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
      
      return {
        id: variant,
        type: variant,
        title: variant === 'technical' ? 'Technical Excellence' : 
               variant === 'creative' ? 'Creative Vision' : 'Commercial Appeal',
        prompt: result,
        score: Math.floor(Math.random() * 20) + 80 // Mock score 80-100
      };
    };

    const selectOptimization = (optimization) => {
      setSelectedOptimization(optimization);
      onOptimizedPrompt(optimization.prompt);
    };

    const rateOptimization = async (historyId, rating, feedback) => {
      try {
        await optimizationManager.saveRating(historyId, rating, feedback);
        loadOptimizationHistory();
        alert('Rating berhasil disimpan!');
      } catch (error) {
        alert(error.message);
      }
    };

    const analyzePrompt = async () => {
      if (!inputPrompt?.trim()) return;

      try {
        const systemPrompt = `Analyze this video prompt and provide detailed insights for optimization.`;
        const userPrompt = `Analyze this prompt: "${inputPrompt}"

Provide analysis including:
1. Strength areas
2. Improvement opportunities  
3. Technical completeness
4. Creative potential
5. Commercial viability

Format as structured feedback.`;

        const analysis = await invokeAIAgent(systemPrompt, userPrompt);
        alert(`Analisis Prompt:\n\n${analysis}`);
      } catch (error) {
        alert('Gagal menganalisis prompt');
      }
    };

    return (
      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/20" data-name="advanced-prompt-optimizer" data-file="components/AdvancedPromptOptimizer.js">
        <h3 className="text-white font-semibold mb-6 flex items-center">
          <div className="icon-settings text-xl mr-3"></div>
          Advanced Veo 3 Prompt Optimizer
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/90 font-medium mb-2">Optimization Level</label>
              <select 
                value={optimizationLevel}
                onChange={(e) => setOptimizationLevel(e.target.value)}
                className="input-modern"
              >
                {optimizationLevels.map(level => (
                  <option key={level.id} value={level.id} className="text-gray-800">
                    {level.name} - {level.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Target Audience</label>
              <select 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="input-modern"
              >
                {audiences.map(audience => (
                  <option key={audience.id} value={audience.id} className="text-gray-800">
                    {audience.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Creativity Level</label>
              <select 
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(e.target.value)}
                className="input-modern"
              >
                {creativityLevels.map(level => (
                  <option key={level.id} value={level.id} className="text-gray-800">
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preset Management */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium">Preset Settings</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                >
                  {showPresets ? 'Hide' : 'Show'} Presets
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
                >
                  {showHistory ? 'Hide' : 'Show'} History
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Nama preset..."
                className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
              />
              <button onClick={savePreset} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Save Preset
              </button>
            </div>

            {showPresets && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {presets.map((preset, presetIndex) => (
                  <div key={`preset_${preset.id}_${presetIndex}`} className="flex justify-between items-center p-2 bg-white/10 rounded">
                    <span className="text-white text-sm">{preset.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => loadPreset(preset)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={optimizePrompt}
              disabled={isOptimizing || !inputPrompt?.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {isOptimizing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Optimizing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <div className="icon-zap text-lg mr-2"></div>
                  Generate Optimizations
                </span>
              )}
            </button>

            <button
              onClick={analyzePrompt}
              disabled={!inputPrompt?.trim()}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-all duration-200 disabled:opacity-50"
            >
              <div className="icon-search text-lg mr-2"></div>
              Analyze Prompt
            </button>
          </div>

          {optimizedResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">Optimization Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {optimizedResults.map((result, resultIndex) => (
                  <div key={`optimization_${result.id}_${resultIndex}_${Date.now()}`} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-white font-medium">{result.title}</h5>
                      <span className="text-green-400 text-sm">Score: {result.score}</span>
                    </div>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                      {result.prompt.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => selectOptimization(result)}
                      className="btn-primary w-full text-sm"
                    >
                      Use This Version
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Analysis */}
          <PromptAnalyzer prompt={inputPrompt} />

          {/* Optimization History */}
          {showHistory && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-medium mb-4">Optimization History</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {optimizationHistory.slice(0, 10).map((item, historyIndex) => (
                  <OptimizationHistoryItem 
                    key={`history_${item.id}_${historyIndex}`} 
                    item={item} 
                    onRate={rateOptimization}
                    onSelect={(prompt) => onOptimizedPrompt(prompt)}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedOptimization && (
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/20">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold">Selected: {selectedOptimization.title}</h4>
                <span className="text-green-400">Score: {selectedOptimization.score}/100</span>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-white/90 leading-relaxed">{selectedOptimization.prompt}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdvancedPromptOptimizer component error:', error);
    return null;
  }
}