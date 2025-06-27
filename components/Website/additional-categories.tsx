"use client"

import { Palette, TreePine, Package } from "lucide-react"

const additionalCategories = [
  {
    id: 1,
    title: "Craft Materials",
    description: "Complete craft supplies for DIY projects and creative activities",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
    items: ["Art Supplies", "Craft Kits", "Decorating Materials", "Creative Accessories"]
  },
  {
    id: 2,
    title: "Artificial Bokka",
    description: "Beautiful artificial bokka arrangements for traditional and modern decor",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    items: ["Traditional Bokka", "Modern Arrangements", "Colored Variants", "Festival Specials"]
  },
  {
    id: 3,
    title: "Aesthetics Items",
    description: "Curated aesthetic pieces to enhance your event's visual appeal",
    icon: Package,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    items: ["Decorative Pieces", "Ambient Lighting", "Background Props", "Aesthetic Arrangements"]
  }
]

export default function AdditionalCategories() {
  return (
    <section id="more-categories" className="my-10">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Explore More
          <span className="text-[#627421] dark:text-[#8ba62f]"> Specialty Items</span>
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
          Discover our specialized collection of unique items to add that perfect finishing touch to your events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {additionalCategories.map((category) => (
          <div
            key={category.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-[#627421] text-white p-2 rounded-full mb-2 w-fit">
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-lg">{category.title}</h3>
              </div>
            </div>
            <div className="p-3 md:p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#627421] rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full bg-[#627421] hover:bg-[#4d5c1a] text-white py-2 rounded-lg transition-colors">
                View Items
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Special feature section */}
      <div className="mt-10 bg-gradient-to-r from-[#627421] to-[#4d5c1a] rounded-2xl p-4 md:p-8 text-white text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Custom Event Packages Available
        </h3>
        <p className="text-white/80 mb-6 text-xs md:text-sm max-w-4xl mx-auto">
          Looking for a complete event setup? We offer custom packages that combine multiple categories 
          to create the perfect atmosphere for your special occasion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#contact" 
            className="bg-white text-[#627421] hover:bg-gray-50 px-3 py-2 rounded-lg font-semibold transition-colors"
          >
            Request Custom Package
          </a>
        </div>
      </div>
    </section>
  )
}