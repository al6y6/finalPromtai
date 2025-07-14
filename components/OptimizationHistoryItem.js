function OptimizationHistoryItem({ item, onRate, onSelect }) {
  try {
    const [showRating, setShowRating] = React.useState(false);
    const [rating, setRating] = React.useState(item.rating || 0);
    const [feedback, setFeedback] = React.useState(item.feedback || '');

    const submitRating = () => {
      onRate(item.id, rating, feedback);
      setShowRating(false);
    };

    return (
      <div className="bg-white/5 rounded-lg p-3 border border-white/10" data-name="optimization-history-item" data-file="components/OptimizationHistoryItem.js">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-white text-sm font-medium">{item.variant} - {item.settings.optimizationLevel}</h5>
          <div className="flex gap-2">
            {item.rating && (
              <span className="text-yellow-400 text-xs">★ {item.rating}</span>
            )}
            <span className="text-green-400 text-xs">Score: {item.score}</span>
          </div>
        </div>
        
        <p className="text-white/70 text-xs mb-2 line-clamp-2">
          {item.optimizedPrompt.substring(0, 80)}...
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onSelect(item.optimizedPrompt)}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Use
            </button>
            <button
              onClick={() => setShowRating(!showRating)}
              className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
            >
              {item.rating ? 'Edit' : 'Rate'}
            </button>
          </div>
        </div>

        {showRating && (
          <div className="mt-3 p-2 bg-white/10 rounded">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={`star_${item.id}_${star}`}
                  onClick={() => setRating(star)}
                  className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-white/30'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Feedback (opsional)..."
              className="w-full px-2 py-1 bg-white/20 rounded text-white text-xs"
              rows="2"
            />
            <div className="flex gap-1 mt-2">
              <button onClick={submitRating} className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                Submit
              </button>
              <button onClick={() => setShowRating(false)} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('OptimizationHistoryItem error:', error);
    return null;
  }
}