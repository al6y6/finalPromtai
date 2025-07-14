function StyleTransfer({ prompt, onStyleTransfer }) {
  try {
    const [selectedStyle, setSelectedStyle] = React.useState('');
    const [isTransferring, setIsTransferring] = React.useState(false);

    const styles = [
      { id: 'anime', name: 'Anime Style', desc: 'Japanese animation style' },
      { id: 'pixar', name: 'Pixar/3D', desc: '3D animated movie style' },
      { id: 'noir', name: 'Film Noir', desc: 'Classic black and white dramatic' },
      { id: 'vintage', name: 'Vintage', desc: 'Retro aesthetic' },
      { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Futuristic neon style' },
      { id: 'minimalist', name: 'Minimalist', desc: 'Clean and simple' }
    ];

    const transferStyle = async () => {
      if (!prompt || !selectedStyle) return;
      
      setIsTransferring(true);
      try {
        const systemPrompt = `You are a style transfer expert. Transform video prompts to match specific visual styles while maintaining the core concept.`;
        
        const userPrompt = `Transform this prompt to ${selectedStyle} style: ${prompt}`;
        
        const result = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
        onStyleTransfer(result);
      } catch (error) {
        alert('Style transfer failed');
      } finally {
        setIsTransferring(false);
      }
    };

    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20">
        <h3 className="text-white font-semibold mb-4">Style Transfer</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {styles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-2 rounded text-sm ${selectedStyle === style.id ? 'bg-purple-600' : 'bg-white/10'}`}
            >
              {style.name}
            </button>
          ))}
        </div>
        <button onClick={transferStyle} disabled={isTransferring} className="btn-primary w-full">
          Transfer Style
        </button>
      </div>
    );
  } catch (error) {
    console.error('StyleTransfer error:', error);
    return null;
  }
}