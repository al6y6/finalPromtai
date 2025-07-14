function RatingSystem({ promptContent }) {
  try {
    const [rating, setRating] = React.useState(0);
    const [review, setReview] = React.useState('');
    const [hasRated, setHasRated] = React.useState(false);
    const [averageRating, setAverageRating] = React.useState(0);
    const [totalReviews, setTotalReviews] = React.useState(0);

    React.useEffect(() => {
      loadRatings();
    }, [promptContent]);

    const loadRatings = async () => {
      try {
        const ratings = await ratingManager.getRatings(promptContent);
        if (ratings.length > 0) {
          const avg = ratings.reduce((sum, r) => sum + r.objectData.Rating, 0) / ratings.length;
          setAverageRating(avg);
          setTotalReviews(ratings.length);
        }
      } catch (error) {
        console.error('Error loading ratings:', error);
      }
    };

    const submitRating = async () => {
      if (rating === 0) {
        alert('Silakan pilih rating terlebih dahulu');
        return;
      }

      try {
        await ratingManager.saveRating({
          promptContent,
          rating,
          review,
          timestamp: new Date().toISOString()
        });
        setHasRated(true);
        await loadRatings();
        alert('Rating berhasil disimpan!');
      } catch (error) {
        alert('Gagal menyimpan rating');
      }
    };

    const StarRating = ({ value, onChange, readOnly = false }) => {
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star, starIdx) => (
            <button
              key={`star_rating_${star}_${starIdx}`}
              onClick={() => !readOnly && onChange && onChange(star)}
              className={`text-2xl transition-colors duration-200 ${
                star <= value ? 'text-yellow-400' : 'text-white/30'
              } ${!readOnly ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'}`}
              disabled={readOnly}
            >
              ★
            </button>
          ))}
        </div>
      );
    };

    return (
      <div className="mt-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-4 border border-yellow-500/20" data-name="rating-system" data-file="components/RatingSystem.js">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <div className="icon-star text-lg mr-2"></div>
          Rating & Review Prompt
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <StarRating value={averageRating} readOnly />
                <span className="text-white/80">
                  {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {!hasRated && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Berikan Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                
                <div>
                  <label className="block text-white/90 font-medium mb-2">Review (Opsional)</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Bagaimana kualitas prompt ini? Berikan feedback Anda..."
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
                    rows="3"
                  />
                </div>
                
                <button
                  onClick={submitRating}
                  className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-all duration-200"
                >
                  <div className="icon-send text-lg mr-2"></div>
                  Kirim Rating
                </button>
              </div>
            )}

            {hasRated && (
              <div className="text-center py-4">
                <div className="icon-check-circle text-3xl text-green-400 mb-2"></div>
                <p className="text-green-300">Terima kasih atas rating Anda!</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Rating Breakdown</h4>
            <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star, starIndex) => {
                    const count = 0; // Placeholder for actual count
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={`rating_breakdown_${star}_${starIndex}`} className="flex items-center gap-2">
                        <span className="text-white/70 w-4">{star}</span>
                        <div className="icon-star text-yellow-400"></div>
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white/60 text-sm w-8">{count}</span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RatingSystem component error:', error);
    return null;
  }
}