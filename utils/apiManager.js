class APIManager {
  constructor() {
    this.settings = this.loadSettings();
    this.isConnected = false;
    this.currentVendor = this.settings.defaultVendor;
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('videoPromptSettings');
      return saved ? JSON.parse(saved) : {
        defaultVendor: 'google',
        apiKeys: {
          openai: '',
          anthropic: '',
          google: 'AIzaSyDEAgWWNsqHRLGrI18t2LNywau9yiMXy1Y',
          custom: '',
          trickle: 'built-in'
        },
        preferences: { autoSave: true, darkMode: true, notifications: true }
      };
    } catch {
      return { 
        defaultVendor: 'google', 
        apiKeys: {
          openai: '',
          anthropic: '',
          google: 'AIzaSyDEAgWWNsqHRLGrI18t2LNywau9yiMXy1Y',
          custom: '',
          trickle: 'built-in'
        }, 
        preferences: { autoSave: true, darkMode: true, notifications: true } 
      };
    }
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('videoPromptSettings', JSON.stringify(this.settings));
  }

  async testConnection(vendor = null) {
    const testVendor = vendor || this.currentVendor;
    try {
      if (testVendor === 'trickle') {
        // Test built-in Trickle AI
        const testResponse = await invokeAIAgent(
          'You are a test AI. Respond with "Connection successful"',
          'Test connection'
        );
        this.isConnected = testResponse.includes('successful') || testResponse.length > 0;
        return { success: true, message: 'Trickle AI connected successfully' };
      } else if (testVendor === 'google') {
        // Test Google Gemini API
        const apiKey = this.settings.apiKeys.google;
        if (!apiKey || apiKey.trim() === '') {
          return { success: false, message: 'Google Gemini API key required' };
        }
        const result = await this.testGoogleGemini(apiKey);
        return result;
      } else if (testVendor === 'openai') {
        // Test OpenAI API
        const apiKey = this.settings.apiKeys.openai;
        if (!apiKey || apiKey.trim() === '') {
          return { success: false, message: 'OpenAI API key required' };
        }
        const result = await this.testOpenAI(apiKey);
        return result;
      } else {
        // Other external APIs
        return { success: false, message: `${testVendor} API not implemented yet` };
      }
    } catch (error) {
      this.isConnected = false;
      return { success: false, message: error.message };
    }
  }

  async generatePrompt(systemPrompt, userPrompt, options = {}) {
    try {
      // Always use Google Gemini as primary with retry logic
      const response = await this.callGoogleGemini(systemPrompt, userPrompt);
      this.isConnected = true;
      return response;
    } catch (error) {
      console.error('Google Gemini API Error:', error);
      
      // If it's an overload error, inform user and try fallback
      if (error.message.includes('overloaded') || error.message.includes('503')) {
        console.log('Google Gemini is overloaded, trying Trickle AI fallback...');
      }
      
      // Fallback to Trickle AI if Google fails
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AI request timeout')), 30000);
        });
        
        const responsePromise = invokeAIAgent(systemPrompt, userPrompt);
        const response = await Promise.race([responsePromise, timeoutPromise]);
        
        if (!response || response.trim().length === 0) {
          throw new Error('Empty response from AI');
        }
        
        this.isConnected = true;
        return response;
      } catch (fallbackError) {
        console.error('Fallback AI also failed:', fallbackError);
        this.isConnected = false;
        return this.getFallbackResponse(userPrompt, options);
      }
    }
  }

  getFallbackResponse(userPrompt, options = {}) {
    const { topic, style = 'cinematic', duration = '30s', mood = 'energetic', quality = '4K' } = options;
    
    if (topic || userPrompt.includes('video')) {
      return `Professional ${style} video featuring ${topic || 'the specified subject'}. 
Duration: ${duration} with ${quality} quality resolution. 
${mood.charAt(0).toUpperCase() + mood.slice(1)} mood with professional camera work, 
dynamic lighting, and engaging composition. Modern video production techniques 
with attention to detail and visual storytelling. Smooth camera movements and 
professional grade cinematography.`;
    }
    
    return `High-quality video production with professional cinematography, 
dynamic camera work, and engaging visual storytelling. Modern techniques 
with attention to detail and creative composition.`;
  }

  getVendorInfo() {
    return {
      trickle: { name: 'Trickle AI (Built-in)', status: this.isConnected ? 'connected' : 'available', recommended: true },
      openai: { name: 'OpenAI GPT', status: 'available', external: true },
      anthropic: { name: 'Anthropic Claude', status: 'available', external: true },
      google: { name: 'Google Gemini', status: 'available', external: true },
      custom: { name: 'Custom API', status: 'configurable', external: true }
    };
  }

  async testGoogleGemini(apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test connection. Respond with "Google Gemini connected successfully"'
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
            topK: 40,
            topP: 0.95
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        this.isConnected = true;
        return { success: true, message: 'Google Gemini connected successfully' };
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      return { success: false, message: `Google Gemini connection failed: ${error.message}` };
    }
  }

  async callGoogleGemini(systemPrompt, userPrompt, retryCount = 0) {
    const apiKey = this.settings.apiKeys.google;
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    
    if (!apiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Google Gemini API Error:', errorData);
        
        // Handle 503 Service Unavailable with retry logic
        if (response.status === 503 && retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
          console.log(`API overloaded, retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.callGoogleGemini(systemPrompt, userPrompt, retryCount + 1);
        }
        
        // Handle other errors or max retries reached
        if (response.status === 503) {
          throw new Error('Google Gemini API is currently overloaded. Please try again later.');
        }
        
        throw new Error(`Google Gemini API error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Google Gemini API call failed:', error);
      
      // If it's a network error and we haven't exhausted retries, try again
      if (error.name === 'TypeError' && error.message.includes('fetch') && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Network error, retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callGoogleGemini(systemPrompt, userPrompt, retryCount + 1);
      }
      
      throw error;
    }
  }

  async testOpenAI(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Test connection. Respond with "OpenAI connected successfully"' }
          ],
          max_tokens: 50
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.isConnected = true;
      return { success: true, message: 'OpenAI connected successfully' };
    } catch (error) {
      return { success: false, message: `OpenAI connection failed: ${error.message}` };
    }
  }

  async callOpenAI(systemPrompt, userPrompt) {
    const apiKey = this.settings.apiKeys.openai;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      currentVendor: this.currentVendor,
      vendorName: this.getVendorInfo()[this.currentVendor]?.name || 'Unknown'
    };
  }

  switchVendor(vendor) {
    this.currentVendor = vendor;
    this.settings.defaultVendor = vendor;
    this.saveSettings(this.settings);
    return this.testConnection(vendor);
  }
}

const apiManager = new APIManager();
