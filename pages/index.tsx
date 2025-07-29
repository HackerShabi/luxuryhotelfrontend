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
      <div className="bg-gray-50 py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Our Premium Hotel Experience</h2>
          <p className="text-gray-600 leading-relaxed">
            Discover luxury and comfort in the heart of the city. Our hotel offers world-class amenities, 
            exceptional service, and unforgettable experiences for both business and leisure travelers.
          </p>
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