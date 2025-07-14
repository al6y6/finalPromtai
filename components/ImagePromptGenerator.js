function ImagePromptGenerator({ onSelectPrompt }) {
  try {
    const [formData, setFormData] = React.useState({
      subject: '',
      style: 'photorealistic',
      composition: 'portrait',
      lighting: 'natural',
      mood: 'neutral',
      colors: 'vibrant',
      background: 'blurred',
      quality: '4K',
      aspectRatio: '16:9',
      cameraSettings: '',
      postProcessing: 'minimal',
      artisticStyle: '',
      negativePrompt: ''
    });
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const styles = ['photorealistic', 'artistic', 'anime', 'cartoon', 'oil-painting', 'watercolor', 'digital-art', 'vintage'];
    const compositions = ['portrait', 'landscape', 'close-up', 'wide-shot', 'macro', 'panoramic', 'square'];
    const lightings = ['natural', 'golden-hour', 'blue-hour', 'studio', 'dramatic', 'soft', 'neon', 'candlelight'];
    const moods = ['neutral', 'happy', 'dramatic', 'mysterious', 'energetic', 'calm', 'romantic', 'dark'];
    const colorSchemes = ['vibrant', 'muted', 'monochrome', 'warm', 'cool', 'pastel', 'high-contrast'];
    const backgrounds = ['blurred', 'detailed', 'solid-color', 'gradient', 'transparent', 'textured', 'minimalist'];
    const qualities = ['HD', '4K', '8K', '16K'];
    const aspectRatios = ['1:1', '4:3', '16:9', '21:9', '9:16', '3:4'];
    const postProcessings = ['minimal', 'enhanced', 'hdr', 'film-grain', 'vintage', 'modern', 'artistic'];

    const generateImagePrompt = async () => {
      if (!formData.subject.trim()) return;
      
      setIsGenerating(true);
      try {
        const systemPrompt = `You are an expert image prompt engineer specializing in creating detailed prompts for AI image generation tools like DALL-E, Midjourney, and Stable Diffusion. Create highly detailed and specific prompts that will generate stunning images.

Guidelines:
- Include specific technical details
- Add artistic and stylistic elements
- Consider composition and lighting
- Include negative prompts when beneficial
- Optimize for the specified parameters
- Make prompts detailed but concise`;

        const userPrompt = `Create a detailed image generation prompt for:
- Subject: ${formData.subject}
- Style: ${formData.style}
- Composition: ${formData.composition}
- Lighting: ${formData.lighting}
- Mood: ${formData.mood}
- Colors: ${formData.colors}
- Background: ${formData.background}
- Quality: ${formData.quality}
- Aspect Ratio: ${formData.aspectRatio}
- Camera Settings: ${formData.cameraSettings || 'Not specified'}
- Post Processing: ${formData.postProcessing}
- Artistic Style: ${formData.artisticStyle || 'Default'}
- Negative Prompt Elements: ${formData.negativePrompt || 'None specified'}

Generate a comprehensive image prompt with technical specifications and artistic direction.`;

        const response = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
        onSelectPrompt(response);
      } catch (error) {
        alert('Gagal menghasilkan image prompt');
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <div className="space-y-6" data-name="image-prompt-generator" data-file="components/ImagePromptGenerator.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-image text-2xl mr-3"></div>
            AI Image Prompt Generator
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-2">Subject/Object</label>
              <textarea
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Describe the main subject or object for your image..."
                className="input-modern h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Style</label>
                <select 
                  value={formData.style}
                  onChange={(e) => setFormData({...formData, style: e.target.value})}
                  className="input-modern"
                >
                  {styles.map(style => (
                    <option key={style} value={style} className="text-gray-800">
                      {style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Composition</label>
                <select 
                  value={formData.composition}
                  onChange={(e) => setFormData({...formData, composition: e.target.value})}
                  className="input-modern"
                >
                  {compositions.map(comp => (
                    <option key={comp} value={comp} className="text-gray-800">
                      {comp.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  {lightings.map(light => (
                    <option key={light} value={light} className="text-gray-800">
                      {light.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/90 font-medium mb-2">Colors</label>
                      <select 
                        value={formData.colors}
                        onChange={(e) => setFormData({...formData, colors: e.target.value})}
                        className="input-modern"
                      >
                        {colorSchemes.map(color => (
                          <option key={color} value={color} className="text-gray-800">
                            {color.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Background</label>
                      <select 
                        value={formData.background}
                        onChange={(e) => setFormData({...formData, background: e.target.value})}
                        className="input-modern"
                      >
                        {backgrounds.map(bg => (
                          <option key={bg} value={bg} className="text-gray-800">
                            {bg.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Quality</label>
                      <select 
                        value={formData.quality}
                        onChange={(e) => setFormData({...formData, quality: e.target.value})}
                        className="input-modern"
                      >
                        {qualities.map(quality => (
                          <option key={quality} value={quality} className="text-gray-800">{quality}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Aspect Ratio</label>
                      <select 
                        value={formData.aspectRatio}
                        onChange={(e) => setFormData({...formData, aspectRatio: e.target.value})}
                        className="input-modern"
                      >
                        {aspectRatios.map(ratio => (
                          <option key={ratio} value={ratio} className="text-gray-800">{ratio}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Post Processing</label>
                      <select 
                        value={formData.postProcessing}
                        onChange={(e) => setFormData({...formData, postProcessing: e.target.value})}
                        className="input-modern"
                      >
                        {postProcessings.map(proc => (
                          <option key={proc} value={proc} className="text-gray-800">
                            {proc.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/90 font-medium mb-2">Camera Settings</label>
                      <input
                        type="text"
                        value={formData.cameraSettings}
                        onChange={(e) => setFormData({...formData, cameraSettings: e.target.value})}
                        placeholder="e.g., f/2.8, ISO 100, 85mm lens..."
                        className="input-modern"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Artistic Style</label>
                      <input
                        type="text"
                        value={formData.artisticStyle}
                        onChange={(e) => setFormData({...formData, artisticStyle: e.target.value})}
                        placeholder="e.g., Van Gogh style, minimalist..."
                        className="input-modern"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">Negative Prompt</label>
                    <textarea
                      value={formData.negativePrompt}
                      onChange={(e) => setFormData({...formData, negativePrompt: e.target.value})}
                      placeholder="What you DON'T want in the image..."
                      className="input-modern h-20 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={generateImagePrompt}
              disabled={isGenerating || !formData.subject.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Generating Image Prompt...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <div className="icon-image text-xl mr-2"></div>
                  Generate Image Prompt
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ImagePromptGenerator component error:', error);
    return null;
  }
}
