function FeatureCard({ icon, title, description }) {
  try {
    return (
      <div className="card-glass text-center" data-name="feature-card" data-file="components/FeatureCard.js">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
          <div className={`icon-${icon} text-xl sm:text-2xl text-white`}></div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed">{description}</p>
      </div>
    );
  } catch (error) {
    console.error('FeatureCard component error:', error);
    return null;
  }
}

function FeaturesSection() {
  try {
    const features = [
      {
        icon: 'brain',
        title: 'AI Terdepan',
        description: 'Teknologi AI generasi terbaru untuk prompt berkualitas tinggi'
      },
      {
        icon: 'palette',
        title: 'Multi Gaya',
        description: 'Berbagai gaya video dari cinematic hingga commercial'
      },
      {
        icon: 'zap',
        title: 'Instant Generate',
        description: 'Dapatkan prompt profesional dalam hitungan detik'
      },
      {
        icon: 'award',
        title: 'Standar 2025',
        description: 'Mengikuti tren dan standar industri video terkini'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0" data-name="features-section" data-file="components/FeatureCard.js">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('FeaturesSection component error:', error);
    return null;
  }
}