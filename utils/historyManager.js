class HistoryManager {
  async saveToHistory(promptData) {
    try {
      const historyData = {
        Title: promptData.title || `Prompt ${new Date().toLocaleDateString()}`,
        Content: promptData.content,
        FormData: JSON.stringify(promptData.formData || {}),
        GeneratedAt: new Date().toISOString(),
        Category: promptData.category || 'general',
        VoiceLanguage: promptData.formData?.voiceLanguage || 'indonesian',
        CustomStyle: promptData.formData?.customStyle || '',
        CharacterConsistency: promptData.formData?.characterConsistency || false,
        Platform: promptData.platform || 'general'
      };

      // Try database first
      if (typeof trickleCreateObject !== 'undefined') {
        try {
          const result = await trickleCreateObject('prompt_history', historyData);
          return result;
        } catch (dbError) {
          console.warn('Database save failed, falling back to localStorage:', dbError);
          throw dbError; // Let it fall through to localStorage fallback
        }
      } else {
        throw new Error('Database not available');
      }
    } catch (error) {
      console.error('Error saving history:', error);
      // Try localStorage as final fallback
      try {
        const localHistory = JSON.parse(localStorage.getItem('videoPromptHistory') || '[]');
        const newItem = {
          objectId: 'local_' + Date.now(),
          objectData: {
            Title: promptData.title || `Prompt ${new Date().toLocaleDateString()}`,
            Content: promptData.content,
            FormData: JSON.stringify(promptData.formData || {}),
            GeneratedAt: new Date().toISOString(),
            Category: promptData.category || 'general'
          },
          createdAt: new Date().toISOString()
        };
        localHistory.unshift(newItem);
        localStorage.setItem('videoPromptHistory', JSON.stringify(localHistory.slice(0, 50)));
        return newItem;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        throw new Error('Gagal menyimpan ke history');
      }
    }
  }

  async getHistory() {
    try {
      const result = await trickleListObjects('prompt_history', 50, true, undefined);
      return result.items || [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  async deleteHistory(objectId) {
    try {
      await trickleDeleteObject('prompt_history', objectId);
      return true;
    } catch (error) {
      console.error('Error deleting history:', error);
      throw new Error('Gagal menghapus history');
    }
  }

  async saveVeo3History(promptData) {
    try {
      const veo3Data = {
        Title: promptData.title || `Veo 3 - ${new Date().toLocaleDateString()}`,
        Content: promptData.content,
        FormData: JSON.stringify(promptData.formData || {}),
        GeneratedAt: new Date().toISOString(),
        Category: 'veo3',
        Platform: 'veo3',
        Resolution: promptData.formData?.resolution || '8K',
        Duration: promptData.formData?.duration || '5s',
        CameraMovement: promptData.formData?.cameraMovement || 'smooth-pan',
        VoiceLanguage: promptData.formData?.voiceLanguage || 'indonesian',
        CharacterConsistency: promptData.formData?.characterConsistency || false,
        CustomStyle: promptData.formData?.customStyle || ''
      };

      if (typeof trickleCreateObject !== 'undefined') {
        try {
          const result = await trickleCreateObject('veo3_history', veo3Data);
          return result;
        } catch (dbError) {
          console.warn('Database save failed, falling back to localStorage:', dbError);
          throw dbError;
        }
      } else {
        throw new Error('Database not available');
      }
    } catch (error) {
      console.error('Error saving Veo 3 history:', error);
      try {
        const localHistory = JSON.parse(localStorage.getItem('veo3PromptHistory') || '[]');
        const newItem = {
          objectId: 'local_veo3_' + Date.now(),
          objectData: veo3Data,
          createdAt: new Date().toISOString()
        };
        localHistory.unshift(newItem);
        localStorage.setItem('veo3PromptHistory', JSON.stringify(localHistory.slice(0, 50)));
        return newItem;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        throw new Error('Gagal menyimpan ke Veo 3 history');
      }
    }
  }

  async getVeo3History() {
    try {
      if (typeof trickleListObjects !== 'undefined') {
        const result = await trickleListObjects('veo3_history', 50, true, undefined);
        return result.items || [];
      } else {
        const localHistory = JSON.parse(localStorage.getItem('veo3PromptHistory') || '[]');
        return localHistory;
      }
    } catch (error) {
      console.error('Error loading Veo 3 history:', error);
      return [];
    }
  }

  async clearAllHistory() {
    try {
      const history = await this.getHistory();
      for (const item of history) {
        await trickleDeleteObject('prompt_history', item.objectId);
      }
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      throw new Error('Gagal menghapus semua history');
    }
  }

  async clearVeo3History() {
    try {
      const history = await this.getVeo3History();
      for (const item of history) {
        if (item.objectId.startsWith('local_')) {
          // Local storage item
          continue;
        } else {
          await trickleDeleteObject('veo3_history', item.objectId);
        }
      }
      // Clear local storage too
      localStorage.removeItem('veo3PromptHistory');
      return true;
    } catch (error) {
      console.error('Error clearing Veo 3 history:', error);
      throw new Error('Gagal menghapus semua Veo 3 history');
    }
  }
}

const historyManager = new HistoryManager();