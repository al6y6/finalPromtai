function AudioEffects({ audioSettings, onAudioChange }) {
  try {
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const audioTypes = ['music', 'sfx', 'ambience', 'voice', 'silence'];
    const musicGenres = ['cinematic', 'electronic', 'orchestral', 'ambient', 'rock', 'jazz', 'classical'];
    const sfxCategories = ['nature', 'urban', 'mechanical', 'fantasy', 'sci-fi', 'horror'];
    const voiceStyles = ['narrator', 'character', 'documentary', 'commercial', 'casual'];
    const audioQualities = ['studio', 'broadcast', 'podcast', 'phone', 'radio'];
    const spatialEffects = ['stereo', 'surround', '3d-spatial', 'binaural', 'mono'];
    const dynamicEffects = ['compression', 'limiter', 'gate', 'expander', 'none'];
    const timeEffects = ['reverb', 'delay', 'echo', 'chorus', 'flanger'];

    const updateAudio = (field, value) => {
      onAudioChange({ ...audioSettings, [field]: value });
    };

    return (
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-4 border border-green-500/20" data-name="audio-effects" data-file="components/AudioEffects.js">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold flex items-center">
            <div className="icon-volume-2 text-lg mr-2"></div>
            Advanced Audio Effects
          </h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white/80 hover:text-white"
          >
            <div className={`icon-chevron-${showAdvanced ? 'up' : 'down'} text-lg`}></div>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/90 font-medium mb-2">Tipe Audio</label>
              <select 
                value={audioSettings.type || 'music'}
                onChange={(e) => updateAudio('type', e.target.value)}
                className="input-modern"
              >
                {audioTypes.map(type => (
                  <option key={type} value={type} className="text-gray-800">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Volume Level</label>
              <input
                type="range"
                min="0"
                max="100"
                value={audioSettings.volume || 70}
                onChange={(e) => updateAudio('volume', e.target.value)}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white/70 text-sm">{audioSettings.volume || 70}%</span>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Fade In/Out</label>
              <select 
                value={audioSettings.fade || 'none'}
                onChange={(e) => updateAudio('fade', e.target.value)}
                className="input-modern"
              >
                <option value="none" className="text-gray-800">None</option>
                <option value="fade-in" className="text-gray-800">Fade In</option>
                <option value="fade-out" className="text-gray-800">Fade Out</option>
                <option value="both" className="text-gray-800">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2">Audio Quality</label>
              <select 
                value={audioSettings.quality || 'studio'}
                onChange={(e) => updateAudio('quality', e.target.value)}
                className="input-modern"
              >
                {audioQualities.map(quality => (
                  <option key={quality} value={quality} className="text-gray-800">
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {audioSettings.type === 'music' && (
            <div>
              <label className="block text-white/90 font-medium mb-2">Genre Musik</label>
              <select 
                value={audioSettings.genre || 'cinematic'}
                onChange={(e) => updateAudio('genre', e.target.value)}
                className="input-modern"
              >
                {musicGenres.map(genre => (
                  <option key={genre} value={genre} className="text-gray-800">
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {audioSettings.type === 'sfx' && (
            <div>
              <label className="block text-white/90 font-medium mb-2">Kategori SFX</label>
              <select 
                value={audioSettings.sfxCategory || 'nature'}
                onChange={(e) => updateAudio('sfxCategory', e.target.value)}
                className="input-modern"
              >
                {sfxCategories.map(cat => (
                  <option key={cat} value={cat} className="text-gray-800">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showAdvanced && (
            <div className="space-y-4 border-t border-white/20 pt-4">
              <h4 className="text-white font-medium">Advanced Effects</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Spatial Audio</label>
                  <select 
                    value={audioSettings.spatial || 'stereo'}
                    onChange={(e) => updateAudio('spatial', e.target.value)}
                    className="input-modern"
                  >
                    {spatialEffects.map(effect => (
                      <option key={effect} value={effect} className="text-gray-800">
                        {effect.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Dynamic Processing</label>
                  <select 
                    value={audioSettings.dynamics || 'compression'}
                    onChange={(e) => updateAudio('dynamics', e.target.value)}
                    className="input-modern"
                  >
                    {dynamicEffects.map(effect => (
                      <option key={effect} value={effect} className="text-gray-800">
                        {effect.charAt(0).toUpperCase() + effect.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Time-based Effects</label>
                  <select 
                    value={audioSettings.timeEffect || 'reverb'}
                    onChange={(e) => updateAudio('timeEffect', e.target.value)}
                    className="input-modern"
                  >
                    {timeEffects.map(effect => (
                      <option key={effect} value={effect} className="text-gray-800">
                        {effect.charAt(0).toUpperCase() + effect.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Audio Description</label>
                <textarea
                  value={audioSettings.description || ''}
                  onChange={(e) => updateAudio('description', e.target.value)}
                  placeholder="Deskripsikan audio yang diinginkan secara detail..."
                  className="input-modern h-20 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('AudioEffects component error:', error);
    return null;
  }
}