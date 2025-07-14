class OptimizationManager {
  constructor() {
    this.presets = this.loadPresets();
    this.history = this.loadHistory();
  }

  // Preset Management
  loadPresets() {
    try {
      return JSON.parse(localStorage.getItem('optimizationPresets') || '[]');
    } catch {
      return [];
    }
  }

  savePreset(preset) {
    try {
      const presets = this.loadPresets();
      const newPreset = {
        id: Date.now().toString(),
        name: preset.name,
        optimizationLevel: preset.optimizationLevel,
        targetAudience: preset.targetAudience,
        creativityLevel: preset.creativityLevel,
        createdAt: new Date().toISOString()
      };
      presets.push(newPreset);
      localStorage.setItem('optimizationPresets', JSON.stringify(presets));
      this.presets = presets;
      return newPreset;
    } catch (error) {
      throw new Error('Gagal menyimpan preset');
    }
  }

  deletePreset(presetId) {
    try {
      const presets = this.loadPresets();
      const filtered = presets.filter(p => p.id !== presetId);
      localStorage.setItem('optimizationPresets', JSON.stringify(filtered));
      this.presets = filtered;
      return true;
    } catch (error) {
      throw new Error('Gagal menghapus preset');
    }
  }

  // History Management
  loadHistory() {
    try {
      return JSON.parse(localStorage.getItem('optimizationHistory') || '[]');
    } catch {
      return [];
    }
  }

  saveToHistory(historyItem) {
    try {
      const history = this.loadHistory();
      const newItem = {
        id: Date.now().toString(),
        originalPrompt: historyItem.originalPrompt,
        optimizedPrompt: historyItem.optimizedPrompt,
        settings: historyItem.settings,
        score: historyItem.score,
        variant: historyItem.variant,
        rating: null,
        feedback: '',
        createdAt: new Date().toISOString()
      };
      history.unshift(newItem);
      // Keep only last 50 items
      const trimmed = history.slice(0, 50);
      localStorage.setItem('optimizationHistory', JSON.stringify(trimmed));
      this.history = trimmed;
      return newItem;
    } catch (error) {
      throw new Error('Gagal menyimpan ke history');
    }
  }

  // Rating and Feedback
  saveRating(historyId, rating, feedback) {
    try {
      const history = this.loadHistory();
      const item = history.find(h => h.id === historyId);
      if (item) {
        item.rating = rating;
        item.feedback = feedback;
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('optimizationHistory', JSON.stringify(history));
        this.history = history;
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Gagal menyimpan rating');
    }
  }

  getAverageRating() {
    const ratedItems = this.history.filter(h => h.rating !== null);
    if (ratedItems.length === 0) return 0;
    const sum = ratedItems.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratedItems.length).toFixed(1);
  }

  getTopPerformingSettings() {
    const ratedItems = this.history.filter(h => h.rating >= 4);
    const settingsCount = {};
    
    ratedItems.forEach(item => {
      const key = `${item.settings.optimizationLevel}-${item.settings.targetAudience}`;
      settingsCount[key] = (settingsCount[key] || 0) + 1;
    });

    return Object.entries(settingsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([key, count]) => ({ settings: key, count }));
  }
}

const optimizationManager = new OptimizationManager();