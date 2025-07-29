import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    review: 'Absolutely stunning hotel with exceptional service. The staff went above and beyond to make our anniversary celebration perfect. The room was luxurious and the amenities were top-notch.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Singapore',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    review: 'Perfect location for business travel. The executive room had everything I needed for work, and the 24/7 room service was incredibly convenient. Will definitely stay here again.'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    location: 'Madrid, Spain',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    review: 'The family suite was spacious and comfortable for our vacation. Kids loved the amenities and the staff was so friendly and accommodating. Great value for money!'
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'London, UK',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    review: 'Outstanding hospitality and attention to detail. The concierge helped us plan the perfect itinerary. The hotel\'s location made it easy to explore all the city attractions.'
  },
  {
    id: 5,
    name: 'Lisa Park',
    location: 'Seoul, South Korea',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    review: 'Luxurious experience from check-in to check-out. The spa services were incredible and the restaurant food was exceptional. This hotel exceeded all our expectations.'
  }
]

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-luxury-gold' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="section-padding bg-luxury-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Read authentic reviews from our valued guests who have experienced 
            the luxury and hospitality that defines our hotel.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Display */}
          <div className="relative h-96 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto text-center">
                  <div className="mb-6">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-luxury-gold"
                    />
                    <div className="flex justify-center mb-4">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonials[currentIndex].review}"
                  </blockquote>
                  
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-luxury-dark mb-1">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-500">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-luxury-gold scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold text-luxury-gold mb-2">4.9/5</div>
              <div className="text-gray-300">Average Rating</div>
              <div className="flex justify-center mt-2">
                {renderStars(5)}
              </div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold text-luxury-gold mb-2">1,200+</div>
              <div className="text-gray-300">Happy Reviews</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold text-luxury-gold mb-2">98%</div>
              <div className="text-gray-300">Recommend Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials