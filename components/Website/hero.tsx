
export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-[#627421]/10 to-[#627421]/20 dark:from-[#627421]/20 dark:to-[#627421]/30 my-8 rounded-2xl shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8ba62f] rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9bc53d] rounded-full translate-y-24 -translate-x-24"></div>
      </div>
      
      <div className="relative p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center min-h-[500px]">
        {/* Text content */}
        <div className="w-full lg:w-1/2 z-10 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Make Your Events
            <span className="block text-[#627421] dark:text-[#8ba62f]">Unforgettable</span>
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-lg">
            From baby shoots to grand celebrations, we provide premium rental items that transform your special moments into lasting memories.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a href="#categories" className="bg-[#627421] hover:bg-[#4d5c1a] text-white px-3 py-2 rounded-lg font-semibold transition-colors text-lg shadow-lg">
              Browse Categories
            </a>
            <a href="#contact" className="border-2 border-[#627421] text-[#627421] hover:bg-[#627421] hover:text-white px-3 py-2 rounded-lg font-semibold transition-colors text-lg">
              Get Quote
            </a>
          </div>
        </div>

        {/* Images Grid */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 z-10">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800  p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751110700385-ChatGPT Image Jun 28, 2025, 05_08_11 PM.png"
                  alt="Baby Props"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Baby Props</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751110621621-ChatGPT Image Jun 28, 2025, 05_05_46 PM.png"
                  alt="Party Accessories"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Party Items</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751110890004-ChatGPT Image Jun 28, 2025, 05_11_18 PM.png"
                  alt="Gift Hampers"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Gift Hampers</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751111079578-ChatGPT Image Jun 28, 2025, 05_14_30 PM.png"
                  alt="Artificial Flowers"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Flowers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
