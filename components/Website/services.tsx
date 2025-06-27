import { Phone, Truck, Sparkles, Clock, Shield, HeartHandshake } from "lucide-react"

const services = [
  {
    id: 1,
    title: "Easy Booking",
    description: "Simple whatsapp-based booking system with instant confirmation and flexible scheduling.",
    icon: Phone,
    color: "bg-[#627421]",
  },
  {
    id: 2,
    title: "Free Delivery",
    description: "Complimentary delivery and pickup service within city limits for orders above ₹500.",
    icon: Truck,
    color: "bg-[#627421]",
  },
  {
    id: 3,
    title: "Premium Quality",
    description: "All items are thoroughly cleaned, sanitized, and quality-checked before rental.",
    icon: Sparkles,
    color: "bg-[#627421]",
  },
  {
    id: 4,
    title: "Flexible Duration",
    description: "Rent for hours, days, or weeks. Extend your rental period as needed.",
    icon: Clock,
    color: "bg-[#627421]",
  },
  {
    id: 5,
    title: "Damage Protection",
    description: "Optional damage protection plan available for peace of mind during your event.",
    icon: Shield,
    color: "bg-[#627421]",
  },
  {
    id: 6,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you throughout your rental period.",
    icon: HeartHandshake,
    color: "bg-[#627421]",
  },
]

export default function Services() {
  return (
    <section id="services" className="my-10 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#627421]/10 to-transparent dark:from-[#627421]/20 dark:to-transparent rounded-3xl -z-10"></div>
      
      <div className="relative z-10 py-12">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose
            <span className="text-[#627421] dark:text-[#8ba62f]"> Our Services</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
            We make renting easy, reliable, and hassle-free. From booking to delivery, 
            our comprehensive services ensure your event goes perfectly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#627421]/20 dark:border-[#627421]/50"
            >
              <div className={`${service.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
