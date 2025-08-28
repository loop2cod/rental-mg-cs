import { Heart, Gift, Baby, Sparkles, Crown, Cake } from "lucide-react"

const eventTypes = [
  {
    id: 1,
    title: "Wedding Events",
    description: "Create magical moments with our premium wedding rental collection",
    icon: Heart,
    color: "from-[#627421] to-[#8ba62f]",
    bgColor: "bg-[#627421]/10 dark:bg-[#8ba62f]/20",
    borderColor: "border-[#627421]/20 dark:border-[#8ba62f]/70",
    featuredItems: [
      {
        name: "Product 1",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
        {
        name: "Product 2",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
         {
        name: "Product 3",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
    ]
  },
  {
    id: 2,
    title: "Birthday Celebrations",
    description: "Make every birthday unforgettable with our fun party essentials",
    icon: Cake,
    color: "from-[#627421] to-[#8ba62f]",
    bgColor: "bg-[#627421]/10 dark:bg-[#8ba62f]/20",
    borderColor: "border-[#627421]/20 dark:border-[#8ba62f]/70",
    featuredItems: [
     {
        name: "Product 1",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
        {
        name: "Product 2",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
         {
        name: "Product 3",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
    ]
  },
  {
    id: 3,
    title: "Baby Showers & Gender Reveals",
    description: "Celebrate new beginnings with our adorable baby celebration items",
    icon: Baby,
    color: "from-[#627421] to-[#8ba62f]",
    bgColor: "bg-[#627421]/10 dark:bg-[#8ba62f]/20",
    borderColor: "border-[#627421]/20 dark:border-[#8ba62f]/70",
    featuredItems: [
       {
        name: "Product 1",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
        {
        name: "Product 2",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
         {
        name: "Product 3",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop&crop=center",
        price: "₹150/day"
      },
    ]
  }
]

export default function EventRentals() {
  return (
    <section id="event-rentals" className="my-10 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#627421]/5 via-transparent to-[#627421]/10 dark:from-[#627421]/10 dark:to-[#627421]/20 rounded-3xl -z-10"></div>
      
      <div className="relative z-10 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#627421] dark:text-[#8ba62f] mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Event Rentals
            </h2>
            <Sparkles className="w-8 h-8 text-[#627421] dark:text-[#8ba62f] ml-3" />
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We specialize in making your special occasions extraordinary. From intimate celebrations to grand events, 
            our curated rental collections bring your vision to life.
          </p>
        </div>

        <div className="space-y-8">
          {eventTypes.map((eventType, index) => (
            <div key={eventType.id} className={`${eventType.bgColor} ${eventType.borderColor} border rounded-2xl p-3 md:p-8 shadow-lg`}>
              <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-8">
                {/* Event Type Info */}
                <div className="lg:w-1/3 text-center lg:text-left">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${eventType.color} flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg`}>
                    <eventType.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {eventType.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    {eventType.description}
                  </p>
                  <button className="bg-[#627421] hover:bg-[#4d5c1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
                    View All Items
                  </button>
                </div>

                {/* Featured Items */}
                <div className="w-full lg:w-2/3">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center lg:text-left">
                    Featured Rental Items
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {eventType.featuredItems.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {item.name}
                          </h5>
                          <div className="flex items-center justify-between">
                            <span className="text-[#627421] dark:text-[#8ba62f] font-bold">
                              {item.price}
                            </span>
                            <button className="text-sm bg-[#627421] hover:bg-[#4d5c1a] text-white px-3 py-1 rounded-md transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-gradient-to-r from-[#627421] to-[#8ba62f] rounded-2xl p-8 text-white shadow-xl">
          <Crown className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Planning a Special Event?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Let us help you create unforgettable moments with our premium rental collection. 
            Get a personalized quote for your event today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#627421] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors shadow-md">
              Get Custom Quote
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#627421] px-6 py-3 rounded-lg font-semibold transition-colors">
              Browse All Items
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}