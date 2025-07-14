function SceneBuilder({ scenes, onScenesChange }) {
  try {
    const [activeScene, setActiveScene] = React.useState(0);

    const addScene = () => {
      const newScene = {
        id: Date.now(),
        title: `Adegan ${scenes.length + 1}`,
        duration: '5s',
        description: '',
        cameraAngle: 'medium-shot',
        lighting: 'natural',
        action: '',
        dialogue: '',
        transition: 'cut'
      };
      onScenesChange([...scenes, newScene]);
    };

    const updateScene = (index, field, value) => {
      const updated = scenes.map((scene, i) => 
        i === index ? { ...scene, [field]: value } : scene
      );
      onScenesChange(updated);
    };

    const removeScene = (index) => {
      const updated = scenes.filter((_, i) => i !== index);
      onScenesChange(updated);
      if (activeScene >= updated.length) {
        setActiveScene(Math.max(0, updated.length - 1));
      }
    };

    const cameraAngles = ['close-up', 'medium-shot', 'wide-shot', 'extreme-close-up', 'bird-eye', 'low-angle', 'high-angle'];
    const transitions = ['cut', 'fade', 'dissolve', 'wipe', 'zoom', 'slide'];

    return (
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-500/20" data-name="scene-builder" data-file="components/SceneBuilder.js">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold flex items-center">
            <div className="icon-film text-lg mr-2"></div>
            Scene Builder - Adegan per Adegan
          </h3>
          <button
            onClick={addScene}
            className="btn-primary px-3 py-1 text-sm"
          >
            <div className="icon-plus text-lg mr-1"></div>
            Tambah Adegan
          </button>
        </div>

        <div className="flex gap-4">
          <div className="w-1/4">
            <div className="space-y-2">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveScene(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeScene === index 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <div className="font-medium">{scene.title}</div>
                  <div className="text-xs opacity-70">{scene.duration}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {scenes.length > 0 && scenes[activeScene] && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={scenes[activeScene].title}
                    onChange={(e) => updateScene(activeScene, 'title', e.target.value)}
                    className="input-modern flex-1 mr-4"
                    placeholder="Judul adegan..."
                  />
                  <button
                    onClick={() => removeScene(activeScene)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <div className="icon-trash-2 text-lg"></div>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Durasi</label>
                    <select 
                      value={scenes[activeScene].duration}
                      onChange={(e) => updateScene(activeScene, 'duration', e.target.value)}
                      className="input-modern"
                    >
                      {['3s', '5s', '10s', '15s', '30s'].map(d => (
                        <option key={d} value={d} className="text-gray-800">{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">Sudut Kamera</label>
                    <select 
                      value={scenes[activeScene].cameraAngle}
                      onChange={(e) => updateScene(activeScene, 'cameraAngle', e.target.value)}
                      className="input-modern"
                    >
                      {cameraAngles.map(angle => (
                        <option key={angle} value={angle} className="text-gray-800">
                          {angle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">Transisi</label>
                    <select 
                      value={scenes[activeScene].transition}
                      onChange={(e) => updateScene(activeScene, 'transition', e.target.value)}
                      className="input-modern"
                    >
                      {transitions.map(trans => (
                        <option key={trans} value={trans} className="text-gray-800">
                          {trans.charAt(0).toUpperCase() + trans.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Deskripsi Visual</label>
                  <textarea
                    value={scenes[activeScene].description}
                    onChange={(e) => updateScene(activeScene, 'description', e.target.value)}
                    placeholder="Deskripsikan visual untuk adegan ini..."
                    className="input-modern h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Aksi/Gerakan</label>
                    <textarea
                      value={scenes[activeScene].action}
                      onChange={(e) => updateScene(activeScene, 'action', e.target.value)}
                      placeholder="Aksi yang terjadi dalam adegan..."
                      className="input-modern h-16 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">Dialog</label>
                    <textarea
                      value={scenes[activeScene].dialogue}
                      onChange={(e) => updateScene(activeScene, 'dialogue', e.target.value)}
                      placeholder="Dialog atau narasi..."
                      className="input-modern h-16 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {scenes.length === 0 && (
              <div className="text-center py-8">
                <div className="icon-film text-4xl text-white/30 mb-4"></div>
                <p className="text-white/70">Belum ada adegan. Klik "Tambah Adegan" untuk memulai.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SceneBuilder component error:', error);
    return null;
  }
}