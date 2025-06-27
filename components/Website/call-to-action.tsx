import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function CallToAction() {
  return (
    <section id="contact" className="my-5">
      {/* Main CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl mb-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32"></div>
        </div>
        
        <div className="relative p-4 md:p-8  lg:p-16 flex flex-col lg:flex-row items-center">
          {/* Text content */}
          <div className="w-full lg:w-2/3 text-center lg:text-left text-white z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Make Your Event
              <span className="block text-green-200">Spectacular?</span>
            </h2>
            <p className="text-base text-green-100 mb-8 max-w-2xl">
              Get in touch with us today for a custom quote. Our team is ready to help you 
              create unforgettable moments with our premium rental collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="tel:+1234567890" 
                className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-semibold transition-colors text-lg inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a 
                href="mailto:info@eventrentals.com" 
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-lg font-semibold transition-colors text-lg inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </div>

          {/* Images */}
          <div className="w-full lg:w-1/3 mt-12 lg:mt-0 z-10">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=150&h=150&fit=crop&crop=center"
                  alt="Event Setup"
                  className="w-full h-20 object-cover rounded-lg shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop&crop=center"
                  alt="Party Decorations"
                  className="w-full h-20 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=150&h=150&fit=crop&crop=center"
                  alt="Baby Props"
                  className="w-full h-20 object-cover rounded-lg shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop&crop=center"
                  alt="Gift Items"
                  className="w-full h-20 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
