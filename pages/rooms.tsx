import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  StarIcon,
  WifiIcon,
  TvIcon,
  HomeIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Room {
  id: number
  name: string
  type: string
  price: number
  originalPrice?: number
  maxOccupancy: number
  size: string
  description: string
  images: string[]
  amenities: string[]
  rating: number
  reviewCount: number
  isAvailable: boolean
  isPopular?: boolean
  discount?: number
}

const rooms: Room[] = [
  {
    id: 1,
    name: 'Deluxe King Room',
    type: 'deluxe',
    price: 299,
    originalPrice: 349,
    maxOccupancy: 2,
    size: '35 sqm',
    description: 'Spacious room with king-size bed, city view, and modern amenities for the perfect urban retreat.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['King Bed', 'City View', 'WiFi', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Private Bathroom', 'Toilet'],
    rating: 4.8,
    reviewCount: 124,
    isAvailable: true,
    isPopular: true,
    discount: 15
  },
  {
    id: 2,
    name: 'Executive Suite',
    type: 'suite',
    price: 599,
    maxOccupancy: 4,
    size: '65 sqm',
    description: 'Luxurious suite with separate living area, premium amenities, and panoramic city views.',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Separate Living Room', 'Panoramic View', 'WiFi', 'Mini Bar', 'Jacuzzi', 'Butler Service', 'Private Bathroom', 'Toilet'],
    rating: 4.9,
    reviewCount: 89,
    isAvailable: true,
    isPopular: true
  },
  {
    id: 3,
    name: 'Standard Double Room',
    type: 'standard',
    price: 199,
    maxOccupancy: 2,
    size: '25 sqm',
    description: 'Comfortable room with modern amenities, perfect for business travelers and couples.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Double Bed', 'WiFi', 'TV', 'Air Conditioning', 'Work Desk', 'Room Service', 'Private Bathroom', 'Toilet'],
    rating: 4.5,
    reviewCount: 156,
    isAvailable: true
  },
  {
    id: 4,
    name: 'Presidential Suite',
    type: 'presidential',
    price: 1299,
    maxOccupancy: 6,
    size: '120 sqm',
    description: 'Ultimate luxury with private terrace, dining area, and exclusive concierge service.',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Terrace', 'Dining Area', 'WiFi', 'Mini Bar', 'Jacuzzi', 'Personal Concierge', 'Private Bathroom', 'Toilet'],
    rating: 5.0,
    reviewCount: 45,
    isAvailable: true,
    isPopular: true
  },
  {
    id: 5,
    name: 'Family Room',
    type: 'family',
    price: 399,
    maxOccupancy: 4,
    size: '45 sqm',
    description: 'Spacious family room with connecting beds and child-friendly amenities.',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Family Beds', 'Kids Area', 'WiFi', 'TV', 'Mini Fridge', 'Baby Cot Available', 'Private Bathroom', 'Toilet'],
    rating: 4.7,
    reviewCount: 98,
    isAvailable: true
  },
  {
    id: 6,
    name: 'Business Class Room',
    type: 'business',
    price: 349,
    maxOccupancy: 2,
    size: '40 sqm',
    description: 'Professional workspace with high-speed internet and business amenities.',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Work Station', 'High-Speed WiFi', 'Printer Access', 'Meeting Space', 'Coffee Machine', 'Express Checkout', 'Private Bathroom', 'Toilet'],
    rating: 4.6,
    reviewCount: 73,
    isAvailable: false
  }
]

const RoomsPage: React.FC = () => {
  const router = useRouter()
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    occupancy: 'all',
    availability: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('price-low')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms')
        const data = await response.json()
        
        if (data.success) {
          // Map backend data to frontend format
          const mappedRooms = data.data.map((room: any) => ({
            id: room._id,
            name: room.name,
            type: room.type,
            price: room.price,
            originalPrice: room.originalPrice,
            maxOccupancy: room.maxOccupancy,
            size: room.size,
            description: room.description,
            images: room.images,
            amenities: room.amenities,
            rating: room.rating || 4.5,
            reviewCount: room.reviewCount || 0,
            isAvailable: room.isAvailable !== false,
            isPopular: room.isPopular,
            discount: room.discount
          }))
          setAllRooms(mappedRooms)
        } else {
          // Fallback to static data if API fails
          setAllRooms(rooms)
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
        // Fallback to static data if API fails
        setAllRooms(rooms)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  useEffect(() => {
    let filtered = allRooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filters.type === 'all' || room.type === filters.type
      const matchesPrice = filters.priceRange === 'all' || 
                          (filters.priceRange === 'budget' && room.price <= 250) ||
                          (filters.priceRange === 'mid' && room.price > 250 && room.price <= 500) ||
                          (filters.priceRange === 'luxury' && room.price > 500)
      const matchesOccupancy = filters.occupancy === 'all' || 
                              (filters.occupancy === '1-2' && room.maxOccupancy <= 2) ||
                              (filters.occupancy === '3-4' && room.maxOccupancy >= 3 && room.maxOccupancy <= 4) ||
                              (filters.occupancy === '5+' && room.maxOccupancy >= 5)
      const matchesAvailability = filters.availability === 'all' || 
                                 (filters.availability === 'available' && room.isAvailable) ||
                                 (filters.availability === 'unavailable' && !room.isAvailable)
      
      return matchesSearch && matchesType && matchesPrice && matchesOccupancy && matchesAvailability
    })

    // Sort rooms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
        default:
          return 0
      }
    })

    setFilteredRooms(filtered)
  }, [allRooms, filters, searchTerm, sortBy])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const clearFilters = () => {
    setFilters({
      type: 'all',
      priceRange: 'all',
      occupancy: 'all',
      availability: 'all'
    })
    setSearchTerm('')
    setSortBy('price-low')
  }

  const openRoomModal = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const closeRoomModal = () => {
    setSelectedRoom(null)
    setIsModalOpen(false)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-luxury-dark to-gray-800 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                Our Luxury Rooms & Suites
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover comfort and elegance in our carefully designed accommodations, 
                each offering unique amenities and breathtaking views.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white shadow-sm border-b">
          <div className="container-custom py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="family">Family</option>
                  <option value="business">Business</option>
                  <option value="presidential">Presidential</option>
                </select>

                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Under $250</option>
                  <option value="mid">$250 - $500</option>
                  <option value="luxury">Above $500</option>
                </select>

                <select
                  value={filters.occupancy}
                  onChange={(e) => handleFilterChange('occupancy', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                >
                  <option value="all">All Occupancy</option>
                  <option value="1-2">1-2 Guests</option>
                  <option value="3-4">3-4 Guests</option>
                  <option value="5+">5+ Guests</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="px-4 py-3 text-gray-600 hover:text-luxury-gold transition-colors duration-300"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="section-padding">
          <div className="container-custom">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
                <span className="ml-4 text-lg text-luxury-dark">Loading rooms...</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold text-luxury-dark">
                    {filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''} Available
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => room.isAvailable && openRoomModal(room)}
                >
                  <div className="relative">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {room.isPopular && (
                        <span className="bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Popular
                        </span>
                      )}
                      {room.discount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {room.discount}% OFF
                        </span>
                      )}
                      {!room.isAvailable && (
                        <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Unavailable
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold">{room.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-luxury-dark">{room.name}</h3>
                      <div className="text-right">
                        {room.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${room.originalPrice}</p>
                        )}
                        <p className="text-2xl font-bold text-luxury-gold">${room.price}</p>
                        <p className="text-sm text-gray-500">per night</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserGroupIcon className="h-4 w-4" />
                        <span>Up to {room.maxOccupancy} guests</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HomeIcon className="h-4 w-4" />
                        <span>{room.size}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-gray-500 text-xs">+{room.amenities.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <StarIconSolid className="h-4 w-4 text-yellow-400" />
                        <span>{room.rating} ({room.reviewCount} reviews)</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          room.isAvailable && openRoomModal(room);
                        }}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          room.isAvailable
                            ? 'bg-luxury-gold text-white hover:bg-gold-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!room.isAvailable}
                      >
                        {room.isAvailable ? 'View Details' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
                </div>

                {filteredRooms.length === 0 && (
                  <div className="text-center py-16">
                    <FunnelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="bg-luxury-gold text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition-colors duration-300"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Room Details Modal */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeRoomModal}></div>
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-luxury-dark">{selectedRoom.name}</h3>
                <button
                  onClick={closeRoomModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-4">
                  <img
                    src={selectedRoom.images[0]}
                    alt={selectedRoom.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {selectedRoom.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRoom.images.slice(1).map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`${selectedRoom.name} ${idx + 2}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">Room Details</h4>
                    <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4 text-luxury-gold" />
                        <span className="text-gray-700">Up to {selectedRoom.maxOccupancy} guests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HomeIcon className="h-4 w-4 text-luxury-gold" />
                        <span className="text-gray-700">{selectedRoom.size}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StarIconSolid className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-700">{selectedRoom.rating} ({selectedRoom.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRoom.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        {selectedRoom.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${selectedRoom.originalPrice}</p>
                        )}
                        <p className="text-3xl font-bold text-luxury-gold">${selectedRoom.price}</p>
                        <p className="text-sm text-gray-500">per night</p>
                      </div>
                      {selectedRoom.discount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {selectedRoom.discount}% OFF
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => {
                        // Get search params from localStorage
                        const searchParams = JSON.parse(localStorage.getItem('searchParams') || '{}')
                        
                        // Create booking details with selected room
                        const bookingDetails = {
                          checkInDate: searchParams.checkInDate || '',
                          checkOutDate: searchParams.checkOutDate || '',
                          guests: searchParams.guests || 2,
                          roomType: selectedRoom.name,
                          roomPrice: selectedRoom.price,
                          roomId: selectedRoom.id
                        }
                        
                        // Store booking details for checkout
                        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))
                        
                        // Redirect to checkout with query params
                        router.push({
                          pathname: '/checkout',
                          query: {
                            roomId: selectedRoom.id,
                            checkIn: bookingDetails.checkInDate,
                            checkOut: bookingDetails.checkOutDate,
                            guests: bookingDetails.guests
                          }
                        })
                      }}
                      className="w-full bg-luxury-gold text-white py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
                    >
                      Book This Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default RoomsPage