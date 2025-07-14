function PromptAnalyzer({ prompt, onAnalysisComplete }) {
  try {
    const [analysis, setAnalysis] = React.useState(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    const analyzePrompt = async () => {
      if (!prompt?.trim()) return;
      
      setIsAnalyzing(true);
      try {
        const sentimentAnalysis = await analyzeSentiment(prompt);
        const keywordAnalysis = analyzeKeywords(prompt);
        const qualityMetrics = calculateQualityMetrics(prompt);
        
        const analysisResult = {
          sentiment: sentimentAnalysis,
          keywords: keywordAnalysis,
          quality: qualityMetrics,
          insights: generateInsights(sentimentAnalysis, keywordAnalysis, qualityMetrics)
        };
        
        setAnalysis(analysisResult);
        if (onAnalysisComplete) onAnalysisComplete(analysisResult);
      } catch (error) {
        console.error('Analysis error:', error);
        // Don't show alert, just provide basic analysis
        const basicAnalysis = {
          sentiment: { overall: 'neutral', confidence: 0.5, emotions: [], tone: 'neutral' },
          keywords: analyzeKeywords(prompt),
          quality: calculateQualityMetrics(prompt),
          insights: [{ type: 'info', text: 'Analisis dasar tersedia - koneksi AI terbatas' }]
        };
        setAnalysis(basicAnalysis);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const analyzeSentiment = async (text) => {
      try {
        const systemPrompt = `Analyze the sentiment and emotional tone of this video prompt. Return JSON with:
{
  "overall": "positive/neutral/negative",
  "confidence": 0.0-1.0,
  "emotions": ["emotion1", "emotion2"],
  "tone": "professional/casual/dramatic/etc"
}`;

        const response = await apiManager.callGoogleGemini(systemPrompt, `Analyze sentiment: ${text}`);
        return JSON.parse(response.replace(/```json|```/g, ''));
      } catch (error) {
        console.warn('Sentiment analysis failed, using fallback:', error);
        // Fallback sentiment analysis
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'beautiful', 'stunning'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'ugly', 'poor'];
        
        const lowerText = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
        
        let overall = 'neutral';
        if (positiveCount > negativeCount) overall = 'positive';
        else if (negativeCount > positiveCount) overall = 'negative';
        
        return { 
          overall, 
          confidence: 0.7, 
          emotions: [overall], 
          tone: 'professional' 
        };
      }
    };

    const analyzeKeywords = (text) => {
      const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const frequency = {};
      words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
      
      const sorted = Object.entries(frequency).sort(([,a], [,b]) => b - a);
      const totalWords = words.length;
      
      return {
        totalWords,
        uniqueWords: Object.keys(frequency).length,
        density: (Object.keys(frequency).length / totalWords * 100).toFixed(1),
        topKeywords: sorted.slice(0, 10).map(([word, count]) => ({
          word,
          count,
          percentage: (count / totalWords * 100).toFixed(1)
        }))
      };
    };

    const calculateQualityMetrics = (text) => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
      
      const technicalTerms = ['camera', 'lighting', 'shot', 'angle', 'movement', 'resolution', '4K', '8K', 'cinematic'];
      const technicalCount = technicalTerms.filter(term => 
        text.toLowerCase().includes(term.toLowerCase())
      ).length;
      
      return {
        length: text.length,
        sentences: sentences.length,
        avgSentenceLength: avgSentenceLength.toFixed(1),
        technicalTerms: technicalCount,
        readabilityScore: Math.min(100, Math.max(0, 100 - (avgSentenceLength - 15) * 2)),
        completeness: Math.min(100, (text.length / 200) * 100)
      };
    };

    const generateInsights = (sentiment, keywords, quality) => {
      const insights = [];
      
      if (sentiment.confidence < 0.6) {
        insights.push({ type: 'warning', text: 'Sentiment analysis confidence rendah - prompt mungkin ambigu' });
      }
      
      if (keywords.density < 5) {
        insights.push({ type: 'suggestion', text: 'Keyword density rendah - tambahkan lebih banyak detail spesifik' });
      }
      
      if (quality.technicalTerms < 3) {
        insights.push({ type: 'improvement', text: 'Kurang istilah teknis - tambahkan spesifikasi kamera dan lighting' });
      }
      
      if (quality.completeness < 70) {
        insights.push({ type: 'warning', text: 'Prompt terlalu singkat - pertimbangkan menambah detail' });
      }
      
      if (sentiment.overall === 'positive' && quality.technicalTerms >= 5) {
        insights.push({ type: 'success', text: 'Prompt berkualitas tinggi dengan tone positif dan detail teknis yang baik' });
      }
      
      return insights;
    };

    React.useEffect(() => {
      if (prompt?.trim()) {
        analyzePrompt();
      }
    }, [prompt]);

    if (!analysis) {
      return (
        <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20" data-name="prompt-analyzer" data-file="components/PromptAnalyzer.js">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <div className="icon-brain text-lg mr-2"></div>
            Prompt Analysis
          </h4>
          {isAnalyzing ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto"></div>
              <p className="text-white/70 mt-2 text-sm">Analyzing prompt...</p>
            </div>
          ) : (
            <p className="text-white/70 text-sm">Masukkan prompt untuk melihat analisis</p>
          )}
        </div>
      );
    }

    return (
      <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20" data-name="prompt-analyzer" data-file="components/PromptAnalyzer.js">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <div className="icon-brain text-lg mr-2"></div>
          Analisis Prompt Mendalam
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <h5 className="text-white font-medium mb-2">Sentiment Analysis</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Overall:</span>
                <span className={`font-medium ${
                  analysis.sentiment.overall === 'positive' ? 'text-green-400' :
                  analysis.sentiment.overall === 'negative' ? 'text-red-400' : 'text-yellow-400'
                }`}>{analysis.sentiment.overall}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Confidence:</span>
                <span className="text-white">{(analysis.sentiment.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tone:</span>
                <span className="text-white">{analysis.sentiment.tone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <h5 className="text-white font-medium mb-2">Keyword Density</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Total Words:</span>
                <span className="text-white">{analysis.keywords.totalWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Unique Words:</span>
                <span className="text-white">{analysis.keywords.uniqueWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Density:</span>
                <span className="text-white">{analysis.keywords.density}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <h5 className="text-white font-medium mb-2">Quality Metrics</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Length:</span>
              <span className="text-white">{analysis.quality.length} chars</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Sentences:</span>
              <span className="text-white">{analysis.quality.sentences}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Avg Sentence:</span>
              <span className="text-white">{analysis.quality.avgSentenceLength} words</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Technical Terms:</span>
              <span className="text-white">{analysis.quality.technicalTerms}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <h5 className="text-white font-medium mb-2">AI Insights</h5>
          <div className="space-y-2">
            {analysis.insights.map((insight, index) => (
              <div key={`insight_${index}_${insight.type}`} className={`p-2 rounded text-sm ${
                insight.type === 'success' ? 'bg-green-500/20 text-green-200' :
                insight.type === 'warning' ? 'bg-yellow-500/20 text-yellow-200' :
                insight.type === 'suggestion' ? 'bg-blue-500/20 text-blue-200' :
                'bg-purple-500/20 text-purple-200'
              }`}>
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PromptAnalyzer error:', error);
    return null;
  }
}