import React from 'react'
import { motion } from 'framer-motion'
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

const attractions = [
  {
    id: 1,
    name: 'City Shopping Mall',
    category: 'Shopping',
    distance: '0.5 km',
    walkTime: '5 min walk',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Premium shopping destination with luxury brands and dining options.'
  },
  {
    id: 2,
    name: 'Central Business District',
    category: 'Business',
    distance: '1.2 km',
    walkTime: '12 min walk',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Major business hub with corporate offices and conference centers.'
  },
  {
    id: 3,
    name: 'Historic Museum',
    category: 'Culture',
    distance: '0.8 km',
    walkTime: '8 min walk',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Explore the rich history and cultural heritage of the city.'
  },
  {
    id: 4,
    name: 'Gourmet Restaurant Row',
    category: 'Dining',
    distance: '0.3 km',
    walkTime: '3 min walk',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Fine dining establishments featuring international and local cuisine.'
  },
  {
    id: 5,
    name: 'City Park & Gardens',
    category: 'Recreation',
    distance: '0.7 km',
    walkTime: '7 min walk',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Beautiful green space perfect for morning jogs and evening strolls.'
  },
  {
    id: 6,
    name: 'Entertainment Complex',
    category: 'Entertainment',
    distance: '1.5 km',
    walkTime: '15 min walk',
    image: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Cinema, bowling, and entertainment venues for family fun.'
  },
  {
    id: 7,
    name: 'Financial District',
    category: 'Business',
    distance: '2.0 km',
    walkTime: '20 min walk',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Banking and financial institutions hub with modern architecture.'
  },
  {
    id: 8,
    name: 'Art Gallery District',
    category: 'Culture',
    distance: '1.0 km',
    walkTime: '10 min walk',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Contemporary art galleries and cultural exhibitions.'
  }
]

const categoryColors = {
  Shopping: 'bg-blue-500',
  Business: 'bg-gray-600',
  Culture: 'bg-purple-500',
  Dining: 'bg-red-500',
  Recreation: 'bg-green-500',
  Entertainment: 'bg-yellow-500'
}

const NearbyAttractions: React.FC = () => {
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
            Nearby Attractions & Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the vibrant neighborhood surrounding our hotel. From shopping and dining 
            to cultural attractions and business centers, everything is within walking distance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attractions.map((attraction, index) => (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`${categoryColors[attraction.category as keyof typeof categoryColors]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {attraction.category}
                    </span>
                  </div>
                  
                  {/* Distance Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                      {attraction.name}
                    </h3>
                    <div className="flex items-center justify-between text-white/90 text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{attraction.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{attraction.walkTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {attraction.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transportation Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-luxury-dark to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Transportation & Accessibility
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our prime location offers excellent connectivity to all major city attractions and transportation hubs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Metro Station</h4>
                <p className="text-gray-300">2 minutes walk to Central Metro Station</p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Airport</h4>
                <p className="text-gray-300">25 minutes drive to International Airport</p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">City Center</h4>
                <p className="text-gray-300">Located in the heart of downtown area</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default NearbyAttractions