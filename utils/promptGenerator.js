async function generateVideoPrompt(formData) {
  try {
    const { topic, style, duration, mood, quality } = formData;
    
    const systemPrompt = `You are an expert video prompt engineer specializing in creating professional video prompts for 2025 standards. Your task is to generate a detailed, creative video prompt based on the user's requirements.

Guidelines:
- Create prompts that are specific, detailed, and actionable
- Include camera movements, lighting, composition, and visual elements
- Consider modern video trends and techniques for 2025
- Make the prompt suitable for AI video generation tools
- Include technical specifications when relevant
- Ensure the prompt matches the specified style, mood, and quality

Format the output as a comprehensive video prompt that could be used directly with video generation AI tools.`;

    const userPrompt = `Create a professional video prompt for:
- Topic: ${topic}
- Style: ${style}
- Duration: ${duration}
- Mood: ${mood}
- Quality: ${quality}

Generate a detailed video prompt that includes visual descriptions, camera work, lighting, and any specific elements that would create an engaging ${duration} ${style} video with a ${mood} mood in ${quality} quality.`;

    // Use Google Gemini API directly for real-time generation
    const response = await apiManager.callGoogleGemini(systemPrompt, userPrompt);
    
    // Save to history
    try {
      await historyManager.saveToHistory({
        title: `${topic} - ${style}`,
        content: response,
        formData: formData,
        category: style
      });
    } catch (error) {
      console.error('Failed to save history:', error);
    }
    
    return response;
  } catch (error) {
    console.error('Error generating video prompt:', error);
    throw error; // Let the component handle the error display
  }
}
