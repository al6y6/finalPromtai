function PromptDisplay({ prompt, onCopy, formData, onBack }) {
  try {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(prompt);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = prompt;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onCopy) onCopy();
      } catch (error) {
        console.error('Failed to copy text:', error);
        // Try fallback method
        try {
          const textArea = document.createElement('textarea');
          textArea.value = prompt;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          if (onCopy) onCopy();
        } catch (fallbackError) {
          console.error('Fallback copy also failed:', fallbackError);
          alert('Gagal menyalin teks. Silakan salin manual.');
        }
      }
    };

    const saveFavorite = async (promptContent) => {
      try {
        await favoriteManager.saveFavorite({
          content: promptContent,
          title: `${formData?.topic || formData?.concept || 'Generated'} - ${formData?.style || formData?.customStyle || 'Video'}`,
          category: 'generated',
          tags: [formData?.style, formData?.mood, formData?.voiceLanguage, formData?.customStyle].filter(Boolean),
          style: formData?.style || formData?.customStyle,
          duration: formData?.duration,
          quality: formData?.quality || formData?.resolution,
          voiceLanguage: formData?.voiceLanguage,
          characterConsistency: formData?.characterConsistency
        });
        alert('Prompt berhasil disimpan ke favorit!');
      } catch (error) {
        alert(error.message);
      }
    };

    if (!prompt) {
      return (
        <div className="card-glass mb-4 sm:mb-8" data-name="prompt-display" data-file="components/PromptDisplay.js">
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="icon-file-text text-4xl sm:text-6xl text-white/30 mb-3 sm:mb-4"></div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Belum Ada Prompt</h3>
            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">Generate prompt terlebih dahulu untuk melihat hasil</p>
            {onBack && (
              <button
                onClick={onBack}
                className="btn-primary w-full sm:w-auto"
              >
                <div className="icon-arrow-left text-base sm:text-lg mr-2"></div>
                Kembali ke Generator
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6" data-name="prompt-display" data-file="components/PromptDisplay.js">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-all duration-200 mb-4 sm:mb-0"
          >
            <div className="icon-arrow-left text-base sm:text-lg mr-2"></div>
            <span className="text-sm sm:text-base">Kembali ke Generator</span>
          </button>
        )}
        
        <div className="card-glass">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <div className="icon-file-text text-xl sm:text-2xl mr-2 sm:mr-3"></div>
              <span className="leading-tight">Prompt Video yang Dihasilkan</span>
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 sm:px-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 text-sm sm:text-base"
              >
                <div className={`icon-${copied ? 'check' : 'copy'} text-base sm:text-lg mr-1 sm:mr-2`}></div>
                <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin'}</span>
                <span className="sm:hidden">{copied ? 'OK' : 'Copy'}</span>
              </button>
              <button
                onClick={() => saveFavorite(prompt)}
                className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 sm:px-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-200 transition-all duration-200 text-sm sm:text-base"
              >
                <div className="icon-heart text-base sm:text-lg mr-1 sm:mr-2"></div>
                <span className="hidden sm:inline">Favorit</span>
                <span className="sm:hidden">Fav</span>
              </button>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 mb-4 sm:mb-6">
            <p className="text-white/90 leading-relaxed whitespace-pre-wrap font-mono text-xs sm:text-sm break-words">
              {prompt}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <span className="px-2 py-1 sm:px-3 bg-indigo-500/30 text-indigo-200 rounded-full text-xs sm:text-sm">
              AI Generated
            </span>
            <span className="px-2 py-1 sm:px-3 bg-purple-500/30 text-purple-200 rounded-full text-xs sm:text-sm">
              2025 Standard
            </span>
            <span className="px-2 py-1 sm:px-3 bg-cyan-500/30 text-cyan-200 rounded-full text-xs sm:text-sm">
              Professional Quality
            </span>
          </div>
          
          <RatingSystem promptContent={prompt} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('PromptDisplay component error:', error);
    return null;
  }
}