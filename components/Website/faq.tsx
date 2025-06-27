"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "How do I book rental items?",
    answer:
      "Simply browse our categories, select the items you need, and contact us through our booking form or phone. We'll confirm availability and provide you with a detailed quote including delivery arrangements.",
  },
  {
    id: 2,
    question: "What is your delivery and pickup service area?",
    answer:
      "We provide free delivery and pickup within the city limits for orders above ₹500. For orders below this amount or outside city limits, delivery charges may apply. Contact us for specific location details.",
  },
  {
    id: 3,
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 3-7 days in advance, especially for popular items during peak season. For last-minute bookings, please call us directly and we'll check availability.",
  },
  {
    id: 4,
    question: "What are your rental rates and payment terms?",
    answer:
      "Rental rates vary by item and duration. We typically require a 50% advance payment to confirm booking, with the balance due on delivery. We accept cash, UPI, and bank transfers.",
  },
  {
    id: 5,
    question: "What if an item gets damaged during my event?",
    answer:
      "We offer optional damage protection for an additional fee. Minor wear and tear is expected, but significant damage will be charged based on repair or replacement costs. We'll assess any damage during pickup.",
  },
  {
    id: 6,
    question: "Do you provide setup and installation services?",
    answer:
      "For certain items like party decorations and larger setups, we offer installation services for an additional fee. Please mention your setup requirements when booking so we can provide appropriate assistance.",
  },
  {
    id: 7,
    question: "Can I extend my rental period?",
    answer:
      "Yes, you can extend your rental period subject to availability. Please contact us at least 24 hours before your scheduled return to arrange an extension. Additional charges will apply for the extended period.",
  },
  {
    id: 8,
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 48 hours before the delivery date receive a full refund. Cancellations within 24-48 hours incur a 25% cancellation fee. Same-day cancellations are non-refundable.",
  },
]

export default function Faq() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <section id="faq">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-8  shadow-xl border border-green-100 dark:border-green-800">
        <div className="mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked
            <span className="text-green-600 dark:text-green-400"> Questions</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 max-w-3xl">
            Have questions about our rental services? Find answers to the most common questions 
            about booking, delivery, payments, and more.
          </p>
        </div>

        <div className="space-y-2 md:space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(faq.id)}
                className="flex justify-between items-center w-full text-left p-3 md:p-6 font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
                aria-expanded={openItem === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="font-semibold text-sm md:text-base pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 flex-shrink-0 transition-transform ${
                    openItem === faq.id ? "rotate-180 text-green-600" : "text-gray-400"
                  }`}
                />
              </button>
              {openItem === faq.id && (
                <div id={`faq-answer-${faq.id}`} className="px-3 pb-3 md:px-6 md:pb-6">
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs md:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
