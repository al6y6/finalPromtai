function Header() {
  try {
    return (
      <header className="text-center mb-6 sm:mb-8 lg:mb-12 px-4" data-name="header" data-file="components/Header.js">
        <div className="mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-xl">
            <div className="icon-video text-2xl sm:text-3xl text-white"></div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
          Video Prompt Generator
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Buat prompt video yang menakjubkan dengan AI terdepan untuk era 2025
        </p>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}