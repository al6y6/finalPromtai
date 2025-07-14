class TemplateManager {
  constructor() {
    this.presets = [
      // Marketing & Iklan
      {
        id: 'marketing_product_launch',
        category: 'marketing',
        title: 'Peluncuran Produk',
        description: 'Template untuk video peluncuran produk baru dengan gaya cinematic',
        style: 'cinematic',
        duration: '60s',
        quality: '4K',
        promptTemplate: 'Cinematic product launch video featuring [PRODUCT_NAME]. Dynamic camera movements showcasing product features with dramatic lighting and modern aesthetic. Professional voiceover in Indonesian explaining key benefits.',
        autoSettings: {
          cameraMovement: 'dolly-zoom',
          lighting: 'dramatic',
          mood: 'energetic',
          voiceLanguage: 'indonesian'
        }
      },
      {
        id: 'marketing_social_media',
        category: 'marketing',
        title: 'Konten Media Sosial',
        description: 'Video pendek untuk platform media sosial dengan gaya modern',
        style: 'modern',
        duration: '15s',
        quality: '4K',
        promptTemplate: 'Short-form social media video with vibrant colors and quick cuts. Trendy music and text overlays. Perfect for Instagram, TikTok, and YouTube Shorts.',
        autoSettings: {
          cameraMovement: 'handheld',
          lighting: 'vibrant',
          mood: 'playful'
        }
      },
      // Edukasi
      {
        id: 'education_tutorial',
        category: 'education',
        title: 'Tutorial Pembelajaran',
        description: 'Video tutorial edukatif dengan penjelasan step-by-step',
        style: 'educational',
        duration: '120s',
        quality: '4K',
        promptTemplate: 'Educational tutorial video with clear step-by-step instructions. Clean background with professional lighting. Indonesian voiceover explaining each step clearly.',
        autoSettings: {
          cameraMovement: 'steady',
          lighting: 'soft',
          mood: 'professional',
          voiceLanguage: 'indonesian'
        }
      },
      {
        id: 'education_explainer',
        category: 'education',
        title: 'Video Penjelasan',
        description: 'Video edukatif dengan animasi dan grafik untuk menjelaskan konsep',
        style: 'animated',
        duration: '90s',
        quality: '4K',
        promptTemplate: 'Animated explainer video with colorful graphics and smooth transitions. Indonesian narrator explaining complex concepts in simple terms.',
        autoSettings: {
          cameraMovement: 'animated',
          lighting: 'bright',
          mood: 'engaging'
        }
      },
      // Entertainment
      {
        id: 'entertainment_music_video',
        category: 'entertainment',
        title: 'Music Video',
        description: 'Video musik dengan visual yang menarik dan sinkronisasi audio',
        style: 'artistic',
        duration: '180s',
        quality: '8K',
        promptTemplate: 'Dynamic music video with artistic visuals and perfect audio synchronization. Creative camera work and vibrant colors.',
        autoSettings: {
          cameraMovement: 'dynamic',
          lighting: 'dramatic',
          mood: 'energetic'
        }
      },
      // Corporate
      {
        id: 'corporate_presentation',
        category: 'corporate',
        title: 'Presentasi Korporat',
        description: 'Video presentasi profesional untuk keperluan bisnis',
        style: 'professional',
        duration: '120s',
        quality: '4K',
        promptTemplate: 'Professional corporate presentation with clean design and authoritative Indonesian voiceover. Business-appropriate visuals.',
        autoSettings: {
          cameraMovement: 'steady',
          lighting: 'professional',
          mood: 'serious',
          voiceLanguage: 'indonesian'
        }
      },
      // Social Media
      {
        id: 'social_instagram_reel',
        category: 'social',
        title: 'Instagram Reel',
        description: 'Video pendek untuk Instagram dengan gaya trendy',
        style: 'trendy',
        duration: '30s',
        quality: '4K',
        promptTemplate: 'Trendy Instagram Reel with quick cuts, vibrant colors, and catchy music. Optimized for mobile viewing.',
        autoSettings: {
          cameraMovement: 'handheld',
          lighting: 'vibrant',
          mood: 'playful'
        }
      },
      // Tutorial
      {
        id: 'tutorial_how_to',
        category: 'tutorial',
        title: 'Tutorial How-To',
        description: 'Video tutorial step-by-step dengan instruksi jelas',
        style: 'instructional',
        duration: '180s',
        quality: '4K',
        promptTemplate: 'Step-by-step how-to tutorial with clear instructions in Indonesian. Clean visuals and easy-to-follow demonstrations.',
        autoSettings: {
          cameraMovement: 'steady',
          lighting: 'clear',
          mood: 'instructional',
          voiceLanguage: 'indonesian'
        }
      }
    ];
  }

  async getPresets() {
    return this.presets;
  }

  async applyPreset(presetId) {
    const preset = this.presets.find(p => p.id === presetId);
    if (!preset) {
      throw new Error('Preset tidak ditemukan');
    }

    return {
      concept: preset.title,
      style: preset.style,
      duration: preset.duration,
      quality: preset.quality,
      ...preset.autoSettings
    };
  }

  getPresetsByCategory(category) {
    return this.presets.filter(p => p.category === category);
  }
}

const templateManager = new TemplateManager();
