class RatingManager {
  async saveRating(ratingData) {
    try {
      const data = {
        PromptHash: this.hashPrompt(ratingData.promptContent),
        Rating: ratingData.rating,
        Review: ratingData.review || '',
        Timestamp: ratingData.timestamp,
        UserAgent: navigator.userAgent.substring(0, 100)
      };

      if (typeof trickleCreateObject !== 'undefined') {
        const result = await trickleCreateObject('prompt_rating', data);
        return result;
      } else {
        // Fallback to localStorage
        const localRatings = JSON.parse(localStorage.getItem('videoPromptRatings') || '[]');
        const newRating = {
          objectId: 'local_' + Date.now(),
          objectData: data,
          createdAt: new Date().toISOString()
        };
        localRatings.push(newRating);
        localStorage.setItem('videoPromptRatings', JSON.stringify(localRatings));
        return newRating;
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      throw new Error('Gagal menyimpan rating');
    }
  }

  async getRatings(promptContent) {
    try {
      const promptHash = this.hashPrompt(promptContent);
      
      if (typeof trickleListObjects !== 'undefined') {
        const result = await trickleListObjects('prompt_rating', 50, true, undefined);
        return (result.items || []).filter(item => 
          item.objectData.PromptHash === promptHash
        );
      } else {
        // Fallback to localStorage
        const localRatings = JSON.parse(localStorage.getItem('videoPromptRatings') || '[]');
        return localRatings.filter(item => 
          item.objectData.PromptHash === promptHash
        );
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
      return [];
    }
  }

  hashPrompt(promptContent) {
    // Simple hash function for prompt content
    let hash = 0;
    for (let i = 0; i < promptContent.length; i++) {
      const char = promptContent.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  async getAverageRating(promptContent) {
    try {
      const ratings = await this.getRatings(promptContent);
      if (ratings.length === 0) return 0;
      
      const sum = ratings.reduce((total, rating) => total + rating.objectData.Rating, 0);
      return sum / ratings.length;
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }
}

const ratingManager = new RatingManager();