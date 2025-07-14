class ExportManager {
  exportPrompt(prompt, formData, format, fileName) {
    try {
      let content;
      let mimeType;
      let fileExtension;

      switch (format) {
        case 'json':
          content = JSON.stringify({
            prompt: prompt,
            metadata: {
              topic: formData?.topic || '',
              style: formData?.style || '',
              duration: formData?.duration || '',
              mood: formData?.mood || '',
              quality: formData?.quality || '',
              generatedAt: new Date().toISOString()
            }
          }, null, 2);
          mimeType = 'application/json';
          fileExtension = 'json';
          break;

        case 'csv':
          content = `Title,Prompt,Style,Duration,Quality,Generated At\n"${formData?.topic || 'Video Prompt'}","${prompt.replace(/"/g, '""')}","${formData?.style || ''}","${formData?.duration || ''}","${formData?.quality || ''}","${new Date().toISOString()}"`;
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;

        case 'txt':
          content = `Video Prompt Generated on ${new Date().toLocaleDateString()}\n\nTopic: ${formData?.topic || 'N/A'}\nStyle: ${formData?.style || 'N/A'}\nDuration: ${formData?.duration || 'N/A'}\nQuality: ${formData?.quality || 'N/A'}\n\nPrompt:\n${prompt}`;
          mimeType = 'text/plain';
          fileExtension = 'txt';
          break;

        case 'pdf':
          content = this.generatePDFContent(prompt, formData);
          this.downloadPDF(content, fileName);
          return;

        case 'docx':
          content = this.generateWordContent(prompt, formData);
          this.downloadWord(content, fileName);
          return;

        default:
          throw new Error('Format tidak didukung');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Gagal mengekspor file');
    }
  }

  generatePDFContent(prompt, formData) {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
            .content { margin: 20px 0; }
            .metadata { background: #f8f9fa; padding: 15px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Video Prompt Generator</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="metadata">
            <h3>Metadata</h3>
            <p><strong>Topic:</strong> ${formData?.topic || formData?.concept || 'N/A'}</p>
            <p><strong>Style:</strong> ${formData?.style || formData?.customStyle || 'N/A'}</p>
            <p><strong>Duration:</strong> ${formData?.duration || 'N/A'}</p>
            <p><strong>Quality:</strong> ${formData?.quality || formData?.resolution || 'N/A'}</p>
          </div>
          <div class="content">
            <h3>Generated Prompt</h3>
            <p>${prompt}</p>
          </div>
        </body>
      </html>
    `;
  }

  downloadPDF(content, fileName) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }

  generateWordContent(prompt, formData) {
    return `
      Video Prompt Document
      Generated on: ${new Date().toLocaleDateString()}
      
      Metadata:
      - Topic: ${formData?.topic || formData?.concept || 'N/A'}
      - Style: ${formData?.style || formData?.customStyle || 'N/A'}
      - Duration: ${formData?.duration || 'N/A'}
      - Quality: ${formData?.quality || formData?.resolution || 'N/A'}
      
      Generated Prompt:
      ${prompt}
    `;
  }

  downloadWord(content, fileName) {
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

const exportManager = new ExportManager();
