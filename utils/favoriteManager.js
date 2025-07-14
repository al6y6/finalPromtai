class FavoriteManager {
  async saveFavorite(promptData) {
    try {
      const favoriteData = {
        Title: promptData.title || `Prompt ${new Date().toLocaleDateString()}`,
        Content: promptData.content,
        Category: promptData.category || 'general',
        Tags: JSON.stringify(promptData.tags || []),
        Style: promptData.style || '',
        Duration: promptData.duration || '',
        Quality: promptData.quality || ''
      };

      // Try database first
      if (typeof trickleCreateObject !== 'undefined') {
        try {
          const result = await trickleCreateObject('prompt_favorite', favoriteData);
          return result;
        } catch (dbError) {
          console.warn('Database save failed, falling back to localStorage:', dbError);
          throw dbError; // Let it fall through to localStorage fallback
        }
      } else {
        throw new Error('Database not available');
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      // Try localStorage as final fallback
      try {
        const localFavorites = JSON.parse(localStorage.getItem('videoPromptFavorites') || '[]');
        const newItem = {
          objectId: 'local_' + Date.now(),
          objectData: favoriteData,
          createdAt: new Date().toISOString()
        };
        localFavorites.unshift(newItem);
        localStorage.setItem('videoPromptFavorites', JSON.stringify(localFavorites.slice(0, 50)));
        return newItem;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        throw new Error('Gagal menyimpan ke favorit');
      }
    }
  }

  async getFavorites() {
    try {
      const result = await trickleListObjects('prompt_favorite', 50, true, undefined);
      return result.items || [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  async deleteFavorite(objectId) {
    try {
      await trickleDeleteObject('prompt_favorite', objectId);
      return true;
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw new Error('Gagal menghapus favorit');
    }
  }

  async updateFavorite(objectId, updateData) {
    try {
      const result = await trickleUpdateObject('prompt_favorite', objectId, updateData);
      return result;
    } catch (error) {
      console.error('Error updating favorite:', error);
      throw new Error('Gagal mengupdate favorit');
    }
  }
}

const favoriteManager = new FavoriteManager();