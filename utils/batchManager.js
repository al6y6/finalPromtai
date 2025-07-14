class BatchManager {
  async generateVariation(variation) {
    try {
      const systemPrompt = `You are an expert video prompt generator creating variations of video prompts. 
      Generate unique and creative prompts while maintaining the core concept.
      
      Guidelines:
      - Keep the main topic but vary the execution
      - Adapt style, mood, and technical aspects
      - Make each variation distinct and professional
      - Include specific details for video production`;

      const userPrompt = `Create a ${variation.style} video prompt for:
      - Topic: ${variation.topic}
      - Style: ${variation.style}
      - Duration: ${variation.duration}
      - Mood: ${variation.mood}
      - Quality: ${variation.quality}
      
      Generate a unique variation that maintains the core concept but offers a different creative approach.`;

      const response = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
      return response;
    } catch (error) {
      console.error('Error generating variation:', error);
      throw new Error('Gagal menghasilkan variasi prompt');
    }
  }

  async saveBatchResults(topic, results) {
    try {
      const batchData = {
        Topic: topic,
        Results: JSON.stringify(results),
        TotalVariations: results.length,
        GeneratedAt: new Date().toISOString(),
        Category: 'batch'
      };

      if (typeof trickleCreateObject !== 'undefined') {
        try {
          await trickleCreateObject('batch_generation', batchData);
        } catch (dbError) {
          console.warn('Database save failed, falling back to localStorage:', dbError);
          throw dbError;
        }
      } else {
        throw new Error('Database not available');
      }
    } catch (error) {
      console.error('Error saving batch results:', error);
      // Fallback to localStorage
      try {
        const localBatches = JSON.parse(localStorage.getItem('batchGenerations') || '[]');
        const newBatch = {
          objectId: 'local_batch_' + Date.now(),
          objectData: batchData,
          createdAt: new Date().toISOString()
        };
        localBatches.unshift(newBatch);
        localStorage.setItem('batchGenerations', JSON.stringify(localBatches.slice(0, 20)));
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }
    }
  }

  exportBatch(selectedResults, topic) {
    try {
      const exportData = {
        topic: topic,
        generatedAt: new Date().toISOString(),
        totalVariations: selectedResults.length,
        variations: selectedResults.map(result => ({
          id: result.id,
          style: result.style,
          duration: result.duration,
          mood: result.mood,
          quality: result.quality,
          prompt: result.prompt
        }))
      };

      const content = JSON.stringify(exportData, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `batch_prompts_${topic.replace(/\s+/g, '_')}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`${selectedResults.length} prompt berhasil diekspor!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengekspor batch prompt');
    }
  }

  async getBatchHistory() {
    try {
      if (typeof trickleListObjects !== 'undefined') {
        const result = await trickleListObjects('batch_generation', 20, true, undefined);
        return result.items || [];
      } else {
        const localBatches = JSON.parse(localStorage.getItem('batchGenerations') || '[]');
        return localBatches;
      }
    } catch (error) {
      console.error('Error loading batch history:', error);
      return [];
    }
  }

  generateCombinations(formData) {
    const combinations = [];
    const { styles, durations, moods, qualities } = formData;
    
    for (const style of styles) {
      for (const duration of durations) {
        for (const mood of moods) {
          for (const quality of qualities) {
            combinations.push({ style, duration, mood, quality });
          }
        }
      }
    }
    
    return combinations.slice(0, formData.variations);
  }
}

const batchManager = new BatchManager();