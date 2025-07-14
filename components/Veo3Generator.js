function Veo3Generator({ onSelectPrompt }) {
  try {
    const [formData, setFormData] = React.useState({
      concept: '',
      cameraMovement: 'smooth-pan',
      lighting: 'natural',
      resolution: '8K',
      framerate: '60fps',
      duration: '5s',
      customDuration: '',
      characters: '',
      dialogue: '',
      audioStyle: 'cinematic',
      environment: 'outdoor',
      mood: 'neutral',
      colorGrading: 'natural',
      effects: 'none',
      transitions: 'cut',
      customStyle: '',
      characterConsistency: true,
      voiceLanguage: 'indonesian',
      voiceGender: 'female',
      voiceAge: 'adult',
      characterReferences: '',
      styleIntensity: 'medium',
      voiceConsistency: true,
      voiceSpeed: 'normal',
      voiceTone: 'natural'
    });
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const [scenes, setScenes] = React.useState([]);
    const [audioSettings, setAudioSettings] = React.useState({});
    const [optimizedPrompt, setOptimizedPrompt] = React.useState('');
    const [showSceneBuilder, setShowSceneBuilder] = React.useState(false);
    const [showAudioEffects, setShowAudioEffects] = React.useState(false);
    const [showOptimizer, setShowOptimizer] = React.useState(false);
    const [durationError, setDurationError] = React.useState('');
    const [estimatedFileSize, setEstimatedFileSize] = React.useState('');
    const [savedPresets, setSavedPresets] = React.useState([]);
    const [presetName, setPresetName] = React.useState('');
    const [showPresets, setShowPresets] = React.useState(false);

    const cameraMovements = ['smooth-pan', 'dolly-zoom', 'tracking-shot', 'aerial-view', 'handheld', 'crane-shot', 'steadicam'];
    const lightingTypes = ['natural', 'cinematic', 'dramatic', 'soft', 'neon', 'golden-hour', 'blue-hour', 'studio'];
    const resolutions = ['4K', '8K', '12K', '16K'];
    const framerates = ['24fps', '30fps', '60fps', '120fps', '240fps'];
    const durations = ['3s', '5s', '10s', '15s', '30s', '60s', 'custom'];
    const audioStyles = ['cinematic', 'ambient', 'dramatic', 'upbeat', 'minimal', 'orchestral', 'electronic'];
    const environments = ['outdoor', 'indoor', 'studio', 'urban', 'nature', 'futuristic', 'vintage'];
    const moods = ['neutral', 'happy', 'dramatic', 'mysterious', 'energetic', 'calm', 'intense'];
    const colorGradings = ['natural', 'warm', 'cool', 'desaturated', 'high-contrast', 'vintage', 'cyberpunk'];
    const effects = ['none', 'slow-motion', 'time-lapse', 'particle', 'lens-flare', 'depth-of-field', 'motion-blur'];
    const transitions = ['cut', 'fade', 'dissolve', 'wipe', 'zoom', 'slide'];
    const voiceLanguages = ['indonesian', 'english', 'mandarin', 'japanese', 'korean', 'spanish', 'french'];
    const voiceGenders = ['female', 'male', 'neutral'];
    const voiceAges = ['child', 'teen', 'adult', 'elderly'];
    const styleIntensities = ['subtle', 'medium', 'strong', 'extreme'];
    const voiceSpeeds = ['slow', 'normal', 'fast'];
    const voiceTones = ['natural', 'warm', 'professional', 'casual', 'dramatic'];

    React.useEffect(() => {
      loadPresets();
      calculateFileSize();
    }, []);

    React.useEffect(() => {
      calculateFileSize();
    }, [formData.resolution, formData.duration, formData.customDuration, formData.framerate]);

    const validateDuration = (duration) => {
      if (!duration.trim()) return false;
      
      const patterns = [
        /^\d+s$/i,                    // 30s, 60s
        /^\d+:\d+$/,                  // 1:30, 2:45
        /^\d+\s*(min|minute|minutes)$/i, // 2 min, 5 minutes
        /^\d+\.?\d*\s*(min|minute|minutes)$/i, // 1.5 minutes
        /^\d+h\s*\d*m?$/i            // 1h30m, 2h
      ];
      
      return patterns.some(pattern => pattern.test(duration));
    };

    const handleCustomDurationChange = (value) => {
      setFormData({...formData, customDuration: value});
      if (value && !validateDuration(value)) {
        setDurationError('Format tidak valid. Contoh: 30s, 2 min, 1:30, 1.5 minutes');
      } else {
        setDurationError('');
      }
    };

    const calculateFileSize = () => {
      const duration = formData.duration === 'custom' ? formData.customDuration : formData.duration;
      if (!duration) return;
      
      let seconds = 0;
      if (duration.includes('s')) seconds = parseInt(duration);
      else if (duration.includes('min')) seconds = parseFloat(duration) * 60;
      else if (duration.includes(':')) {
        const [min, sec] = duration.split(':');
        seconds = parseInt(min) * 60 + parseInt(sec);
      }
      
      const resolutionMultiplier = {
        '4K': 1,
        '8K': 4,
        '12K': 9,
        '16K': 16
      };
      
      const framerateMultiplier = {
        '24fps': 1,
        '30fps': 1.25,
        '60fps': 2.5,
        '120fps': 5,
        '240fps': 10
      };
      
      const baseSizeMB = 50; // Base size for 4K 30fps 1 second
      const estimatedSize = baseSizeMB * seconds * 
        (resolutionMultiplier[formData.resolution] || 1) * 
        (framerateMultiplier[formData.framerate] || 1);
      
      setEstimatedFileSize(estimatedSize > 1000 ? 
        `${(estimatedSize / 1000).toFixed(1)} GB` : 
        `${estimatedSize.toFixed(0)} MB`);
    };

    const loadPresets = () => {
      try {
        const presets = JSON.parse(localStorage.getItem('veo3Presets') || '[]');
        setSavedPresets(presets);
      } catch (error) {
        setSavedPresets([]);
      }
    };

    const savePreset = () => {
      if (!presetName.trim()) {
        alert('Masukkan nama preset');
        return;
      }
      
      const preset = {
        id: Date.now(),
        name: presetName,
        settings: { ...formData },
        createdAt: new Date().toISOString()
      };
      
      const updatedPresets = [...savedPresets, preset];
      localStorage.setItem('veo3Presets', JSON.stringify(updatedPresets));
      setSavedPresets(updatedPresets);
      setPresetName('');
      alert('Preset berhasil disimpan!');
    };

    const loadPreset = (preset) => {
      setFormData(preset.settings);
      setShowPresets(false);
      alert(`Preset "${preset.name}" berhasil dimuat!`);
    };

    const deletePreset = (presetId) => {
      if (confirm('Hapus preset ini?')) {
        const updatedPresets = savedPresets.filter(p => p.id !== presetId);
        localStorage.setItem('veo3Presets', JSON.stringify(updatedPresets));
        setSavedPresets(updatedPresets);
      }
    };

    const generateVeo3Prompt = async () => {
      if (!formData.concept.trim()) return;
      
      if (formData.duration === 'custom' && !validateDuration(formData.customDuration)) {
        alert('Format durasi custom tidak valid');
        return;
      }
      
      setIsGenerating(true);
      try {
        const systemPrompt = `You are a Google Veo 3 specialist prompt engineer. Create ultra-high quality video prompts optimized specifically for Google Veo 3's advanced capabilities including:
- Photorealistic rendering
- Complex camera movements
- Advanced lighting systems
- High-resolution output
- Temporal consistency
- Physics-accurate motion

Format the output as a detailed Veo 3-optimized prompt.`;

        const scenesText = scenes.length > 0 ? scenes.map((scene, i) => 
          `Scene ${i+1}: ${scene.title} (${scene.duration}) - ${scene.description} | Camera: ${scene.cameraAngle} | Action: ${scene.action} | Dialogue: ${scene.dialogue}`
        ).join('\n') : 'No scenes specified';

        const audioText = audioSettings.type ? 
          `Audio Type: ${audioSettings.type}, Volume: ${audioSettings.volume}%, Quality: ${audioSettings.quality}, Effects: ${audioSettings.spatial || 'none'}` : 
          'No audio settings specified';

        const finalDuration = formData.duration === 'custom' ? formData.customDuration : formData.duration;
        
        const userPrompt = `Create a Google Veo 3 optimized prompt for:
- Concept: ${formData.concept}
- Camera Movement: ${formData.cameraMovement}
- Lighting: ${formData.lighting}
- Resolution: ${formData.resolution}
- Frame Rate: ${formData.framerate}
- Duration: ${finalDuration}
- Characters: ${formData.characters || 'Not specified'}
- Character References: ${formData.characterReferences || 'None provided'}
- Character Consistency: ${formData.characterConsistency ? 'Enabled - maintain same character appearance throughout' : 'Disabled'}
- Dialogue/Voice Over: ${formData.dialogue || 'No dialogue'} (Language: ${formData.voiceLanguage}, Gender: ${formData.voiceGender}, Age: ${formData.voiceAge}, Speed: ${formData.voiceSpeed}, Tone: ${formData.voiceTone})
- Voice Consistency: ${formData.voiceConsistency ? 'Enabled - maintain same voice characteristics throughout' : 'Disabled'}
- Custom Style: ${formData.customStyle || 'Use default style'}
- Style Intensity: ${formData.styleIntensity}
- Audio Style: ${formData.audioStyle}
- Environment: ${formData.environment}
- Mood: ${formData.mood}
- Color Grading: ${formData.colorGrading}
- Effects: ${formData.effects}
- Transitions: ${formData.transitions}

Scene-by-Scene Breakdown:
${scenesText}

Advanced Audio Settings:
${audioText}

Generate a comprehensive Veo 3 prompt with all technical specifications, scene-by-scene direction, advanced audio integration, character consistency instructions, Indonesian voice over integration, custom style application, and creative direction. If dialogue is provided in Indonesian, include proper pronunciation guides and cultural context.`;

        const response = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
        
        // Save to Veo 3 history with Google Gemini tag
        try {
          await historyManager.saveVeo3History({
            title: `${formData.concept} - Veo 3 (Google Gemini)`,
            content: response,
            formData: formData,
            category: 'veo3',
            apiProvider: 'google-gemini'
          });
        } catch (error) {
          console.error('Failed to save Veo 3 history:', error);
        }
        
        onSelectPrompt(response);
      } catch (error) {
        console.error('Google Gemini Veo 3 generation error:', error);
        
        // Enhanced fallback with Google Gemini integration attempt
        try {
          const fallbackSystemPrompt = `You are a Google Veo 3 video prompt specialist. Create a professional video prompt based on the user's concept.`;
          const fallbackUserPrompt = `Create a Veo 3 video prompt for: ${formData.concept}`;
          const fallbackResponse = await apiManager.callGoogleGemini(fallbackSystemPrompt, fallbackUserPrompt);
          
          try {
            await historyManager.saveVeo3History({
              title: `${formData.concept} - Veo 3 (Fallback)`,
              content: fallbackResponse,
              formData: formData,
              category: 'veo3'
            });
          } catch (historyError) {
            console.error('Failed to save fallback history:', historyError);
          }
          
          onSelectPrompt(fallbackResponse);
        } catch (fallbackError) {
          console.error('Google Gemini fallback also failed:', fallbackError);
          
          // Final static fallback
          const finalDuration = formData.duration === 'custom' ? formData.customDuration : formData.duration;
          const staticFallback = `Google Veo 3 optimized prompt: ${formData.concept}. 
${formData.resolution} resolution, ${formData.framerate} framerate, ${finalDuration} duration.
${formData.cameraMovement} camera movement with ${formData.lighting} lighting.
${formData.mood} mood in ${formData.environment} environment.
${formData.characters ? `Characters: ${formData.characters}. ` : ''}
${formData.dialogue ? `Voice over in ${formData.voiceLanguage}: ${formData.dialogue}. ` : ''}
${formData.customStyle ? `Custom style: ${formData.customStyle}. ` : ''}
Professional video production with attention to detail and cinematic quality.`;
          
          onSelectPrompt(staticFallback);
        }
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <div className="space-y-6" data-name="veo3-generator" data-file="components/Veo3Generator.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-zap text-2xl mr-3"></div>
            Google Veo 3 Generator
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-2">Video Concept</label>
              <textarea
                value={formData.concept}
                onChange={(e) => setFormData({...formData, concept: e.target.value})}
                placeholder="Describe your video concept for Veo 3..."
                className="input-modern h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Karakter Utama</label>
                <textarea
                  value={formData.characters}
                  onChange={(e) => setFormData({...formData, characters: e.target.value})}
                  placeholder="Deskripsikan karakter (usia, penampilan, pakaian, ekspresi)..."
                  className="input-modern h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Dialog/Voice Over (Bahasa Indonesia)</label>
                <textarea
                  value={formData.dialogue}
                  onChange={(e) => setFormData({...formData, dialogue: e.target.value})}
                  placeholder="Masukkan dialog atau narasi dalam Bahasa Indonesia..."
                  className="input-modern h-20 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Custom Style</label>
                <textarea
                  value={formData.customStyle}
                  onChange={(e) => setFormData({...formData, customStyle: e.target.value})}
                  placeholder="Deskripsikan gaya visual custom yang diinginkan..."
                  className="input-modern h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Referensi Karakter</label>
                <textarea
                  value={formData.characterReferences}
                  onChange={(e) => setFormData({...formData, characterReferences: e.target.value})}
                  placeholder="Referensi untuk konsistensi karakter (foto, deskripsi detail)..."
                  className="input-modern h-20 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Gaya Audio</label>
                <select 
                  value={formData.audioStyle}
                  onChange={(e) => setFormData({...formData, audioStyle: e.target.value})}
                  className="input-modern"
                >
                  {audioStyles.map(style => (
                    <option key={style} value={style} className="text-gray-800">
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Lingkungan</label>
                <select 
                  value={formData.environment}
                  onChange={(e) => setFormData({...formData, environment: e.target.value})}
                  className="input-modern"
                >
                  {environments.map(env => (
                    <option key={env} value={env} className="text-gray-800">
                      {env.charAt(0).toUpperCase() + env.slice(1)}
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
                  <label className="block text-white/90 font-medium mb-2">Durasi</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="input-modern"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration} className="text-gray-800">
                        {duration === 'custom' ? 'Custom' : duration}
                      </option>
                    ))}
                  </select>
                  {formData.duration === 'custom' && (
                    <input
                      type="text"
                      value={formData.customDuration}
                      onChange={(e) => setFormData({...formData, customDuration: e.target.value})}
                      placeholder="Masukkan durasi custom (contoh: 2 menit, 90s, 1.5 minutes)"
                      className={`input-modern mt-2 ${durationError ? 'border-red-500' : ''}`}
                      onChange={(e) => handleCustomDurationChange(e.target.value)}
                    />
                  )}
                  {durationError && (
                    <p className="text-red-400 text-xs mt-1">{durationError}</p>
                  )}
                  {estimatedFileSize && (
                    <p className="text-cyan-400 text-xs mt-1">Estimasi ukuran file: {estimatedFileSize}</p>
                  )}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl p-4 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <div className="icon-user text-lg mr-2"></div>
                Pengaturan Karakter & Audio Indonesia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Bahasa Voice</label>
                  <select 
                    value={formData.voiceLanguage}
                    onChange={(e) => setFormData({...formData, voiceLanguage: e.target.value})}
                    className="input-modern"
                  >
                    {voiceLanguages.map(lang => (
                      <option key={lang} value={lang} className="text-gray-800">
                        {lang === 'indonesian' ? 'Bahasa Indonesia' : 
                         lang === 'english' ? 'English' :
                         lang === 'mandarin' ? '中文' :
                         lang === 'japanese' ? '日本語' :
                         lang === 'korean' ? '한국어' :
                         lang === 'spanish' ? 'Español' :
                         lang === 'french' ? 'Français' : lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Gender Suara</label>
                  <select 
                    value={formData.voiceGender}
                    onChange={(e) => setFormData({...formData, voiceGender: e.target.value})}
                    className="input-modern"
                  >
                    {voiceGenders.map(gender => (
                      <option key={gender} value={gender} className="text-gray-800">
                        {gender === 'female' ? 'Wanita' : 
                         gender === 'male' ? 'Pria' : 'Netral'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Usia Suara</label>
                  <select 
                    value={formData.voiceAge}
                    onChange={(e) => setFormData({...formData, voiceAge: e.target.value})}
                    className="input-modern"
                  >
                    {voiceAges.map(age => (
                      <option key={age} value={age} className="text-gray-800">
                        {age === 'child' ? 'Anak' : 
                         age === 'teen' ? 'Remaja' : 
                         age === 'adult' ? 'Dewasa' : 'Tua'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-white/90 font-medium">
                    <input
                      type="checkbox"
                      checked={formData.characterConsistency}
                      onChange={(e) => setFormData({...formData, characterConsistency: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded mr-2"
                    />
                    Konsistensi Karakter
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Kecepatan Suara</label>
                  <select 
                    value={formData.voiceSpeed}
                    onChange={(e) => setFormData({...formData, voiceSpeed: e.target.value})}
                    className="input-modern"
                  >
                    {voiceSpeeds.map(speed => (
                      <option key={speed} value={speed} className="text-gray-800">
                        {speed === 'slow' ? 'Lambat' : 
                         speed === 'normal' ? 'Normal' : 'Cepat'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Tone Suara</label>
                  <select 
                    value={formData.voiceTone}
                    onChange={(e) => setFormData({...formData, voiceTone: e.target.value})}
                    className="input-modern"
                  >
                    {voiceTones.map(tone => (
                      <option key={tone} value={tone} className="text-gray-800">
                        {tone === 'natural' ? 'Natural' : 
                         tone === 'warm' ? 'Hangat' : 
                         tone === 'professional' ? 'Profesional' :
                         tone === 'casual' ? 'Santai' : 'Dramatis'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-white/90 font-medium">
                    <input
                      type="checkbox"
                      checked={formData.voiceConsistency}
                      onChange={(e) => setFormData({...formData, voiceConsistency: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded mr-2"
                    />
                    Konsistensi Suara
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <div className="icon-palette text-lg mr-2"></div>
                Custom Style Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Intensitas Style</label>
                  <select 
                    value={formData.styleIntensity}
                    onChange={(e) => setFormData({...formData, styleIntensity: e.target.value})}
                    className="input-modern"
                  >
                    {styleIntensities.map(intensity => (
                      <option key={intensity} value={intensity} className="text-gray-800">
                        {intensity === 'subtle' ? 'Halus' : 
                         intensity === 'medium' ? 'Sedang' : 
                         intensity === 'strong' ? 'Kuat' : 'Ekstrem'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="text-white/70 text-sm">
                    Custom style akan diterapkan dengan intensitas {formData.styleIntensity === 'subtle' ? 'halus' : 
                     formData.styleIntensity === 'medium' ? 'sedang' : 
                     formData.styleIntensity === 'strong' ? 'kuat' : 'ekstrem'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-white/80 hover:text-white mb-4"
              >
                <div className={`icon-chevron-${showAdvanced ? 'down' : 'right'} text-lg mr-2`}></div>
                Advanced Settings
              </button>

              {showAdvanced && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white/90 font-medium mb-2">Camera Movement</label>
                      <select 
                        value={formData.cameraMovement}
                        onChange={(e) => setFormData({...formData, cameraMovement: e.target.value})}
                        className="input-modern"
                      >
                        {cameraMovements.map(movement => (
                          <option key={movement} value={movement} className="text-gray-800">
                            {movement.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Lighting</label>
                      <select 
                        value={formData.lighting}
                        onChange={(e) => setFormData({...formData, lighting: e.target.value})}
                        className="input-modern"
                      >
                        {lightingTypes.map(lighting => (
                          <option key={lighting} value={lighting} className="text-gray-800">
                            {lighting.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Resolution</label>
                      <select 
                        value={formData.resolution}
                        onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                        className="input-modern"
                      >
                        {resolutions.map(res => (
                          <option key={res} value={res} className="text-gray-800">{res}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Frame Rate</label>
                      <select 
                        value={formData.framerate}
                        onChange={(e) => setFormData({...formData, framerate: e.target.value})}
                        className="input-modern"
                      >
                        {framerates.map(fps => (
                          <option key={fps} value={fps} className="text-gray-800">{fps}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Color Grading</label>
                      <select 
                        value={formData.colorGrading}
                        onChange={(e) => setFormData({...formData, colorGrading: e.target.value})}
                        className="input-modern"
                      >
                        {colorGradings.map(grading => (
                          <option key={grading} value={grading} className="text-gray-800">
                            {grading.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Effects</label>
                      <select 
                        value={formData.effects}
                        onChange={(e) => setFormData({...formData, effects: e.target.value})}
                        className="input-modern"
                      >
                        {effects.map(effect => (
                          <option key={effect} value={effect} className="text-gray-800">
                            {effect.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Transitions</label>
                      <select 
                        value={formData.transitions}
                        onChange={(e) => setFormData({...formData, transitions: e.target.value})}
                        className="input-modern"
                      >
                        {transitions.map(transition => (
                          <option key={transition} value={transition} className="text-gray-800">
                            {transition.charAt(0).toUpperCase() + transition.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <div className="icon-info text-lg mr-2"></div>
                Veo 3 Enhanced Features (Powered by Google Gemini)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                <div className="text-purple-200">• Photorealistic Rendering</div>
                <div className="text-blue-200">• 16K Resolution</div>
                <div className="text-cyan-200">• 240fps Support</div>
                <div className="text-green-200">• Physics Engine</div>
                <div className="text-yellow-200">• Character Consistency</div>
                <div className="text-pink-200">• Indonesian Voice Over</div>
                <div className="text-orange-200">• Custom Style Engine</div>
                <div className="text-indigo-200">• Multi-Language Support</div>
                <div className="text-red-200">• Advanced Character Control</div>
                <div className="text-emerald-200">• Cultural Context Aware</div>
                <div className="text-violet-200">• Style Intensity Control</div>
                <div className="text-amber-200">• Voice Age & Gender</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-xl p-4 border border-indigo-500/20 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <div className="icon-bookmark text-lg mr-2"></div>
                  Preset Management
                </h3>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-white/80 hover:text-white"
                >
                  <div className={`icon-chevron-${showPresets ? 'up' : 'down'} text-lg`}></div>
                </button>
              </div>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Nama preset..."
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70"
                />
                <button onClick={savePreset} className="px-4 py-2 bg-indigo-600 text-white rounded-lg" style={{"paddingTop":"8px","paddingRight":"9px","paddingBottom":"6px","paddingLeft":"8px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"-75px","fontSize":"16px","color":"rgb(255, 255, 255)","backgroundColor":"rgb(79, 70, 229)","textAlign":"center","fontWeight":"400","display":"block","position":"static","width":"68.4667px","height":"42px","top":"auto","left":"auto","right":"auto","bottom":"auto"}}>Save</button>
              </div>

              {showPresets && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {savedPresets.map(preset => (
                    <div key={preset.id} className="flex justify-between items-center p-2 bg-white/10 rounded">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <button
                onClick={() => setShowSceneBuilder(!showSceneBuilder)}
                className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                  showSceneBuilder ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="icon-film text-lg mr-2"></div>
                Scene Builder
              </button>
              
              <button
                onClick={() => setShowAudioEffects(!showAudioEffects)}
                className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                  showAudioEffects ? 'bg-green-600 border-green-500 text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="icon-volume-2 text-lg mr-2"></div>
                Audio Effects
              </button>
              
              <button
                onClick={() => setShowOptimizer(!showOptimizer)}
                className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                  showOptimizer ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="icon-settings text-lg mr-2"></div>
                Prompt Optimizer
              </button>
            </div>

            {showSceneBuilder && (
              <div className="mb-6">
                <SceneBuilder scenes={scenes} onScenesChange={setScenes} />
              </div>
            )}

            {showAudioEffects && (
              <div className="mb-6">
                <AudioEffects audioSettings={audioSettings} onAudioChange={setAudioSettings} />
              </div>
            )}

            {showOptimizer && (
              <div className="mb-6">
                <AdvancedPromptOptimizer 
                  inputPrompt={formData.concept} 
                  formData={formData}
                  onOptimizedPrompt={(optimized) => {
                    setOptimizedPrompt(optimized);
                    setFormData({...formData, concept: optimized});
                  }} 
                />
              </div>
            )}

            <button
              onClick={generateVeo3Prompt}
              disabled={isGenerating || !formData.concept.trim() || (formData.duration === 'custom' && !validateDuration(formData.customDuration))}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Generating Veo 3 Prompt...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <div className="icon-zap text-xl mr-2"></div>
                  Generate Veo 3 Prompt (Google Gemini AI)
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Veo3Generator component error:', error);
    return null;
  }
}