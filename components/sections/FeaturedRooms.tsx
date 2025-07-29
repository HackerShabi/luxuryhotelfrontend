import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserIcon, WifiIcon, TvIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const featuredRooms = [
  {
    id: 1,
    name: 'Deluxe Suite',
    price: 299,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    amenities: ['King Bed', 'City View', 'WiFi', 'Mini Bar'],
    description: 'Spacious suite with panoramic city views and premium amenities for the ultimate luxury experience.'
  },
  {
    id: 2,
    name: 'Executive Room',
    price: 199,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Queen Bed', 'Work Desk', 'WiFi', 'Coffee Machine'],
    description: 'Perfect for business travelers with modern amenities and a comfortable workspace.'
  },
  {
    id: 3,
    name: 'Premium Double',
    price: 149,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Double Bed', 'Balcony', 'WiFi', 'Smart TV'],
    description: 'Comfortable room with modern design and all essential amenities for a pleasant stay.'
  },
  {
    id: 4,
    name: 'Family Suite',
    price: 399,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    amenities: ['2 Bedrooms', 'Living Area', 'WiFi', 'Kitchenette'],
    description: 'Spacious family accommodation with separate living area and all the comforts of home.'
  }
]

const FeaturedRooms: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-dark mb-6">
            Featured Rooms & Suites
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of rooms and suites, each designed to provide 
            the perfect blend of comfort, luxury, and modern amenities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {featuredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${room.price}/night
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="bg-white text-luxury-dark px-6 py-2 rounded-lg font-semibold hover:bg-luxury-gold hover:text-white transition-colors duration-300 inline-flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-luxury-dark mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {room.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.map((amenity, amenityIndex) => (
                      <span
                        key={amenityIndex}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span className="text-sm">2-4 Guests</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <WifiIcon className="h-4 w-4" />
                        <span className="text-sm">Free WiFi</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-luxury-gold">
                        ${room.price}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-luxury-gold to-gold-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Explore All Rooms</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedRooms