import React from 'react'
import Layout from '../components/layout/Layout'
import HeroSection from '../components/sections/HeroSection'
import QuickBookingForm from '../components/ui/QuickBookingForm'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import FeaturedRooms from '../components/sections/FeaturedRooms'
import ServicesHighlight from '../components/sections/ServicesHighlight'
import Testimonials from '../components/sections/Testimonials'
import NearbyAttractions from '../components/sections/NearbyAttractions'
import LocationMap from '../components/sections/LocationMap'
import NewsletterSignup from '../components/sections/NewsletterSignup'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <div className="relative z-40">
        <QuickBookingForm />
      </div>
      <div className="bg-gradient-to-br from-luxury-gold/10 via-white to-luxury-gold/5 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-luxury-gold/20 text-luxury-gold font-semibold rounded-full text-sm mb-4">
              ✨ Premium Hospitality Since 1995
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Welcome to Our
              <span className="block text-luxury-gold">Luxury Hotel Experience</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              Discover unparalleled luxury and comfort in the heart of the city. Our hotel offers world-class amenities, 
              exceptional service, and unforgettable experiences for both business and leisure travelers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/30 transition-colors">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Luxury Amenities</h3>
              <p className="text-gray-600">World-class facilities and premium services</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/30 transition-colors">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prime Location</h3>
              <p className="text-gray-600">Located in the heart of the city center</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/30 transition-colors">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Exceptional Service</h3>
              <p className="text-gray-600">24/7 personalized guest experience</p>
            </div>
          </div>
        </div>
      </div>
      <WhyChooseUs />
      <FeaturedRooms />
      <ServicesHighlight />
      <Testimonials />
      <NearbyAttractions />
      <LocationMap />
      <NewsletterSignup />
    </Layout>
  )
}

export default HomePage