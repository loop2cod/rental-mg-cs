import Image from "next/image"

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 my-8 rounded-2xl shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-300 rounded-full translate-y-24 -translate-x-24"></div>
      </div>
      
      <div className="relative p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center min-h-[500px]">
        {/* Text content */}
        <div className="w-full lg:w-1/2 z-10 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Make Your Events
            <span className="block text-green-600 dark:text-green-400">Unforgettable</span>
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-lg">
            From baby shoots to grand celebrations, we provide premium rental items that transform your special moments into lasting memories.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a href="#categories" className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-lg shadow-lg">
              Browse Categories
            </a>
            <a href="#contact" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg font-semibold transition-colors text-lg">
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
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop&crop=center"
                  alt="Baby Props"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Baby Props</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop&crop=center"
                  alt="Party Accessories"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Party Items</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center"
                  alt="Gift Hampers"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">Gift Hampers</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center"
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
