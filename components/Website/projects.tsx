"use client"

import { useState } from "react"
import { ShoppingBag, Gift, Baby, Flower, Sparkles, Coffee } from "lucide-react"

const categories = [
  {
    id: 1,
    title: "Baby Shoot Props",
    description: "Adorable props and accessories for memorable baby photoshoots",
    icon: Baby,
    image: "https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751114841561-ChatGPT Image Jun 28, 2025, 06_16_52 PM.png",
    items: ["Props Sets", "Blankets", "Baskets", "Headbands", "Costumes"]
  },
  {
    id: 2,
    title: "Gift Hampers",
    description: "Beautifully curated gift hampers for every occasion",
    icon: Gift,
    image: "https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751111924397-ChatGPT Image Jun 28, 2025, 05_28_32 PM.png",
    items: ["Birthday Hampers", "Festival Gifts", "Corporate Gifts", "Wedding Favors"]
  },
  {
    id: 3,
    title: "Party Accessories",
    description: "Complete party setups to make your celebrations spectacular",
    icon: Sparkles,
    image: "https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751111591326-ChatGPT Image Jun 28, 2025, 05_22_56 PM.png",
    items: ["Balloons", "Banners", "Table Decor", "Lighting", "Photo Booth Props"]
  },
  {
    id: 4,
    title: "Artificial Flowers",
    description: "Premium artificial flowers that look stunning and last forever",
    icon: Flower,
    image: "https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751112244069-ChatGPT Image Jun 28, 2025 at 05_33_49 PM.png",
    items: ["Bouquets", "Arrangements", "Wall Decor", "Table Centerpieces"]
  },
  {
    id: 5,
    title: "Premium Dry Fruits",
    description: "High-quality dry fruits and nuts for gifts and occasions",
    icon: Coffee,
    image: "https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751112413078-ChatGPT Image Jun 28, 2025 at 05_36_34 PM.png",
    items: ["Mixed Nuts", "Dates", "Dried Fruits", "Gift Boxes"]
  },
  {
    id: 6,
    title: "Imported Chocolates",
    description: "Exquisite imported chocolates for luxury gifting",
    icon: ShoppingBag,
    image: "https://pub-1095c2d8125541debb599ae3d7654951.r2.dev/uploads/1751112619515-ChatGPT Image Jun 28, 2025 at 05_39_56 PM.png",
    items: ["Luxury Boxes", "Truffles", "Artisan Chocolates", "Seasonal Collections"]
  }
]

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)

  const openCategoryModal = (category: any) => {
    setSelectedCategory(category)
  }

  const closeCategoryModal = () => {
    setSelectedCategory(null)
  }

  return (
    <section id="categories" className="my-20">
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-start">
          Our Rental
          <span className="text-[#627421] dark:text-[#8ba62f]"> Categories</span>
        </h2>
        <p className="text-sm md:tex-base text-gray-700 dark:text-gray-300 max-w-3xl">
          Discover our extensive collection of rental items, carefully curated to make your events special. 
          From intimate baby shoots to grand celebrations, we have everything you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
            onClick={() => openCategoryModal(category)}
          >
            <div className="relative overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-[#627421] text-white p-2 rounded-full">
                <category.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="p-3 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#627421] transition-colors">
                {category.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.items.slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#627421]/10 dark:bg-[#627421]/20 text-[#627421] dark:text-[#8ba62f] text-xs rounded-full"
                  >
                    {item}
                  </span>
                ))}
                {category.items.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{category.items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedCategory.image}
                alt={selectedCategory.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeCategoryModal}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#627421] text-white p-3 rounded-full">
                  <selectedCategory.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {selectedCategory.description}
              </p>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Available Items:
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {selectedCategory.items.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#627421] rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-[#627421] hover:bg-[#4d5c1a] text-white py-3 rounded-lg font-semibold transition-colors">
                  Get Quote
                </button>
                <button 
                  onClick={closeCategoryModal}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
