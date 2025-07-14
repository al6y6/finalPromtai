function ExportPanel({ prompt, formData }) {
  try {
    const [exportFormat, setExportFormat] = React.useState('json');
    const [fileName, setFileName] = React.useState('video_prompt');

    const exportFormats = [
      { id: 'json', label: 'JSON', icon: 'code', description: 'Structured data for APIs' },
      { id: 'csv', label: 'CSV', icon: 'table', description: 'Spreadsheet compatible' },
      { id: 'txt', label: 'Text', icon: 'file-text', description: 'Plain text format' },
      { id: 'pdf', label: 'PDF', icon: 'file-text', description: 'Professional document' },
      { id: 'docx', label: 'Word', icon: 'file-text', description: 'Microsoft Word format' }
    ];

    const handleExport = () => {
      if (!prompt) {
        alert('Tidak ada prompt untuk diekspor');
        return;
      }

      try {
        exportManager.exportPrompt(prompt, formData, exportFormat, fileName);
      } catch (error) {
        alert('Gagal mengekspor file');
      }
    };

    return (
      <div className="space-y-6" data-name="export-panel" data-file="components/ExportPanel.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-download text-2xl mr-3"></div>
            Export Prompt
          </h2>
          
          {!prompt ? (
            <div className="text-center py-8">
              <div className="icon-file-x text-4xl text-white/30 mb-4"></div>
              <p className="text-white/70">Generate prompt terlebih dahulu untuk mengekspor</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-medium mb-3">Nama File</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Masukkan nama file..."
                  className="input-modern"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-3">Format Export</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {exportFormats.map(format => (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id)}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        exportFormat === format.id
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <div className={`icon-${format.icon} text-xl mb-2`}></div>
                      <h3 className="font-semibold">{format.label}</h3>
                      <p className="text-sm opacity-80">{format.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">Preview Export:</h3>
                <p className="text-white/70 text-sm">{prompt.substring(0, 150)}...</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-cyan-500/30 text-cyan-200 rounded text-xs">
                    {formData?.style || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs">
                    {formData?.duration || 'N/A'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="btn-primary w-full"
              >
                <span className="flex items-center justify-center">
                  <div className="icon-download text-xl mr-2"></div>
                  Export sebagai {exportFormat.toUpperCase()}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ExportPanel component error:', error);
    return null;
  }
}