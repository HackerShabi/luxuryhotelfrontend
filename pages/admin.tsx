import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  HomeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  CogIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface Room {
  id: string
  name: string
  type: string
  price: number
  maxOccupancy: number
  size: number
  amenities: string[]
  images: string[]
  description: string
  available: boolean
}

interface Booking {
  id: string
  roomId: string
  roomName: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  paymentStatus: 'paid' | 'pending' | 'failed'
  createdAt: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  inquiryType: string
  createdAt: string
  read: boolean
}

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
  totalRooms: number
  pendingBookings: number
  unreadContacts: number
}

const AdminDashboard: React.FC = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [adminKey, setAdminKey] = useState('')
  
  // Data states
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    totalRooms: 0,
    pendingBookings: 0,
    unreadContacts: 0
  })
  
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  
  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState<Booking | null>(null)
  
  // Real-time data states
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  
  // Form states for room editing
  const [roomForm, setRoomForm] = useState<Partial<Room>>({
    name: '',
    type: '',
    price: 0,
    maxOccupancy: 1,
    size: 0,
    amenities: [],
    images: [],
    description: '',
    available: true
  })

  useEffect(() => {
    const { key } = router.query
    if (key === 'admin123') {
      setIsAuthenticated(true)
      loadDashboardData()
    } else if (key) {
      toast.error('Invalid admin key')
      router.push('/')
    }
    setIsLoading(false)
  }, [router.query])

  // Auto-refresh effect
  useEffect(() => {
    if (isAuthenticated && autoRefresh) {
      const interval = setInterval(() => {
        loadDashboardData()
        setLastUpdated(new Date())
      }, 30000) // Refresh every 30 seconds
      
      setRefreshInterval(interval)
      return () => clearInterval(interval)
    } else if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
  }, [isAuthenticated, autoRefresh])

  const handleAdminLogin = () => {
    if (adminKey === 'admin123') {
      setIsAuthenticated(true)
      loadDashboardData()
      router.push('/admin?key=admin123')
    } else {
      toast.error('Invalid admin key')
    }
  }

  const loadDashboardData = () => {
    // Mock data with slight variations to simulate real-time changes
    const baseStats = {
      totalBookings: 156,
      totalRevenue: 45680,
      occupancyRate: 78,
      totalRooms: rooms.length || 24,
      pendingBookings: 8,
      unreadContacts: 5
    }
    
    // Add small random variations to simulate real-time updates
    const variation = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
    setStats({
      ...baseStats,
      totalBookings: baseStats.totalBookings + variation,
      totalRevenue: baseStats.totalRevenue + (variation * 150),
      pendingBookings: Math.max(0, baseStats.pendingBookings + variation)
    })
    
    setRooms([
      {
        id: '1',
        name: 'Deluxe Ocean View Suite',
        type: 'Suite',
        price: 299,
        maxOccupancy: 2,
        size: 450,
        amenities: ['Ocean View', 'King Bed', 'Balcony', 'Mini Bar'],
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32'],
        description: 'Luxurious suite with stunning ocean views',
        available: true
      },
      {
        id: '2',
        name: 'Executive Business Room',
        type: 'Business',
        price: 199,
        maxOccupancy: 2,
        size: 320,
        amenities: ['City View', 'Work Desk', 'High-Speed WiFi', 'Coffee Machine'],
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a'],
        description: 'Perfect for business travelers',
        available: true
      }
    ])
    
    setBookings([
      {
        id: 'BK001',
        roomId: '1',
        roomName: 'Deluxe Ocean View Suite',
        guestName: 'John Smith',
        guestEmail: 'john@example.com',
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        guests: 2,
        totalAmount: 897,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2024-02-10'
      },
      {
        id: 'BK002',
        roomId: '2',
        roomName: 'Executive Business Room',
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah@example.com',
        checkIn: '2024-02-20',
        checkOut: '2024-02-22',
        guests: 1,
        totalAmount: 398,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: '2024-02-12'
      }
    ])
    
    setContacts([
      {
        id: 'C001',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '+1-555-0123',
        subject: 'Wedding Event Inquiry',
        message: 'I would like to inquire about hosting a wedding reception at your hotel.',
        inquiryType: 'Event',
        createdAt: '2024-02-14',
        read: false
      },
      {
        id: 'C002',
        name: 'Lisa Brown',
        email: 'lisa@example.com',
        phone: '+1-555-0456',
        subject: 'Group Booking Discount',
        message: 'Do you offer discounts for group bookings of 10+ rooms?',
        inquiryType: 'Booking',
        createdAt: '2024-02-13',
        read: true
      }
    ])
  }

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ))
    toast.success(`Booking ${status} successfully`)
  }

  const markContactAsRead = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId ? { ...contact, read: true } : contact
    ))
  }

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId))
    toast.success('Room deleted successfully')
    loadDashboardData() // Refresh stats
  }

  // Enhanced CRUD operations
  const handleRoomSubmit = () => {
    if (!roomForm.name || !roomForm.type || !roomForm.price) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingRoom) {
      // Update existing room
      const updatedRoom: Room = {
        ...editingRoom,
        name: roomForm.name,
        type: roomForm.type,
        price: roomForm.price,
        maxOccupancy: roomForm.maxOccupancy,
        size: roomForm.size,
        description: roomForm.description,
        images: roomForm.images || [],
        amenities: roomForm.amenities || [],
        available: roomForm.available
      }
      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? updatedRoom : room
      ))
      toast.success('Room updated successfully')
    } else {
      // Create new room
      const newRoom: Room = {
        id: Date.now().toString(),
        name: roomForm.name,
        type: roomForm.type,
        price: roomForm.price,
        maxOccupancy: roomForm.maxOccupancy,
        size: roomForm.size,
        description: roomForm.description,
        images: roomForm.images || [],
        amenities: roomForm.amenities || [],
        available: roomForm.available
      }
      setRooms(prev => [...prev, newRoom])
      toast.success('Room created successfully')
    }

    setShowRoomModal(false)
    setEditingRoom(null)
    setRoomForm({
      name: '',
      type: '',
      price: 0,
      maxOccupancy: 1,
      size: 0,
      amenities: [],
      images: [],
      description: '',
      available: true
    })
    loadDashboardData() // Refresh stats
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setRoomForm({
      name: room.name,
      type: room.type,
      price: room.price,
      maxOccupancy: room.maxOccupancy,
      size: room.size,
      amenities: room.amenities || [],
      images: room.images || [],
      description: room.description,
      available: room.available
    })
    setShowRoomModal(true)
  }

  const handleAddAmenity = (amenity: string) => {
    if (amenity && !roomForm.amenities?.includes(amenity)) {
      setRoomForm(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenity]
      }))
    }
  }

  const handleRemoveAmenity = (amenity: string) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities?.filter(a => a !== amenity) || []
    }))
  }

  const handleAddImage = (imageUrl: string) => {
    if (imageUrl && !roomForm.images?.includes(imageUrl)) {
      setRoomForm(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl]
      }))
    }
  }

  const handleRemoveImage = (imageUrl: string) => {
    setRoomForm(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== imageUrl) || []
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setRoomForm(prev => ({
          ...prev,
          images: [...(prev.images || []), result]
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
    toast.success(`Auto-refresh ${!autoRefresh ? 'enabled' : 'disabled'}`)
  }

  const manualRefresh = () => {
    loadDashboardData()
    setLastUpdated(new Date())
    toast.success('Data refreshed successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4"
        >
          <h1 className="text-3xl font-serif font-bold text-luxury-dark text-center mb-6">
            Admin <span className="text-luxury-gold">Login</span>
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                placeholder="Enter admin key"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <motion.button
              onClick={handleAdminLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-luxury-gold text-white py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300"
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-serif font-bold text-luxury-dark">
              Hotel <span className="text-luxury-gold">Admin</span>
            </h1>
            <div className="flex items-center space-x-4">
              {/* Real-time controls */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}</span>
              </div>
              <button
                onClick={manualRefresh}
                className="flex items-center space-x-1 text-gray-600 hover:text-luxury-gold transition-colors duration-300"
                title="Manual refresh"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={toggleAutoRefresh}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={`${autoRefresh ? 'Disable' : 'Enable'} auto-refresh`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  autoRefresh ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>Auto-refresh</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-luxury-gold transition-colors duration-300"
              >
                Back to Website
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false)
                  router.push('/')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-lg p-4">
              <ul className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
                  { id: 'rooms', label: 'Rooms', icon: HomeIcon },
                  { id: 'bookings', label: 'Bookings', icon: CalendarDaysIcon },
                  { id: 'contacts', label: 'Contacts', icon: EnvelopeIcon },
                  { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
                  { id: 'settings', label: 'Settings', icon: CogIcon }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-300 ${
                        activeTab === item.id
                          ? 'bg-luxury-gold text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Total Bookings',
                      value: stats.totalBookings,
                      icon: CalendarDaysIcon,
                      color: 'bg-blue-500',
                      change: '+12%'
                    },
                    {
                      title: 'Total Revenue',
                      value: `$${stats.totalRevenue.toLocaleString()}`,
                      icon: CurrencyDollarIcon,
                      color: 'bg-green-500',
                      change: '+8%'
                    },
                    {
                      title: 'Occupancy Rate',
                      value: `${stats.occupancyRate}%`,
                      icon: HomeIcon,
                      color: 'bg-purple-500',
                      change: '+5%'
                    },
                    {
                      title: 'Total Rooms',
                      value: stats.totalRooms,
                      icon: HomeIcon,
                      color: 'bg-orange-500',
                      change: '0%'
                    },
                    {
                      title: 'Pending Bookings',
                      value: stats.pendingBookings,
                      icon: ClockIcon,
                      color: 'bg-yellow-500',
                      change: '+3%'
                    },
                    {
                      title: 'Unread Contacts',
                      value: stats.unreadContacts,
                      icon: EnvelopeIcon,
                      color: 'bg-red-500',
                      change: '-2%'
                    }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-luxury-dark">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        {stat.change.startsWith('+') ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : stat.change.startsWith('-') ? (
                          <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        ) : null}
                        <span className={`text-sm font-medium ${
                          stat.change.startsWith('+') ? 'text-green-500' :
                          stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {stat.change} from last month
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-luxury-dark mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-luxury-dark">{booking.guestName}</p>
                            <p className="text-sm text-gray-600">{booking.roomName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-luxury-gold">${booking.totalAmount}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-luxury-dark mb-4">Recent Contacts</h3>
                    <div className="space-y-4">
                      {contacts.slice(0, 5).map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-luxury-dark">{contact.name}</p>
                            <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!contact.read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rooms' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-bold text-luxury-dark">
                    Room <span className="text-luxury-gold">Management</span>
                  </h2>
                  <motion.button
                    onClick={() => setShowRoomModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-luxury-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Room</span>
                  </motion.button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Room</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Occupancy</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => (
                        <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-medium text-luxury-dark">{room.name}</p>
                                <p className="text-sm text-gray-600">{room.size} sq ft</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{room.type}</td>
                          <td className="py-4 px-4 font-semibold text-luxury-gold">${room.price}/night</td>
                          <td className="py-4 px-4 text-gray-700">{room.maxOccupancy} guests</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {room.available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingRoom(room)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteRoom(room.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  Booking <span className="text-luxury-gold">Management</span>
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Guest</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Room</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Dates</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-luxury-dark">{booking.id}</td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-luxury-dark">{booking.guestName}</p>
                              <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{booking.roomName}</td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <p>In: {new Date(booking.checkIn).toLocaleDateString()}</p>
                              <p>Out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-luxury-gold">${booking.totalAmount}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setShowBookingDetails(booking)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-300"
                                  >
                                    <CheckCircleIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                  >
                                    <XCircleIcon className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'contacts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  Contact <span className="text-luxury-gold">Management</span>
                </h2>
                
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`border rounded-lg p-4 transition-colors duration-300 ${
                        contact.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-semibold text-luxury-dark">{contact.name}</h4>
                            <p className="text-sm text-gray-600">{contact.email} • {contact.phone}</p>
                          </div>
                          {!contact.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                            {contact.inquiryType}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <h5 className="font-medium text-luxury-dark mb-2">{contact.subject}</h5>
                      <p className="text-gray-700 text-sm mb-3">{contact.message}</p>
                      <div className="flex justify-end">
                        {!contact.read && (
                          <button
                            onClick={() => markContactAsRead(contact.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'revenue' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  Revenue <span className="text-luxury-gold">Analytics</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Month</h3>
                    <p className="text-3xl font-bold">$12,450</p>
                    <p className="text-green-100 text-sm">+15% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Quarter</h3>
                    <p className="text-3xl font-bold">$35,680</p>
                    <p className="text-blue-100 text-sm">+8% from last quarter</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Year</h3>
                    <p className="text-3xl font-bold">$142,890</p>
                    <p className="text-purple-100 text-sm">+22% from last year</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-luxury-dark mb-4">Revenue by Room Type</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'Deluxe Suites', revenue: 45680, percentage: 35 },
                      { type: 'Business Rooms', revenue: 32450, percentage: 25 },
                      { type: 'Standard Rooms', revenue: 28900, percentage: 22 },
                      { type: 'Premium Suites', revenue: 23560, percentage: 18 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-luxury-gold rounded-full" />
                          <span className="font-medium text-luxury-dark">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-luxury-gold h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="font-semibold text-luxury-dark w-20 text-right">
                            ${item.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  System <span className="text-luxury-gold">Settings</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-luxury-dark mb-4">Hotel Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                        <input
                          type="text"
                          defaultValue="Luxury Grand Hotel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          defaultValue="info@luxurygrand.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-luxury-dark mb-4">Booking Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Allow online bookings</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Require payment at booking</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Send confirmation emails</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-dark mb-4">Security</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change Admin Password</label>
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        />
                      </div>
                      <button className="bg-luxury-gold text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition-colors duration-300">
                        Update Settings
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-luxury-dark">
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button
                  onClick={() => {
                    setShowRoomModal(false)
                    setEditingRoom(null)
                    setRoomForm({
                      name: '',
                      type: '',
                      price: 0,
                      maxOccupancy: 1,
                      size: 0,
                      amenities: [],
                      images: [],
                      description: '',
                      available: true
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-luxury-dark">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Name *</label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="e.g., Deluxe Ocean View Suite"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                    <select
                      value={roomForm.type}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                    >
                      <option value="">Select room type</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Presidential">Presidential</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night *</label>
                      <input
                        type="number"
                        value={roomForm.price}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="299"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy</label>
                      <input
                        type="number"
                        value={roomForm.maxOccupancy}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, maxOccupancy: Number(e.target.value) }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="2"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Size (sq ft)</label>
                    <input
                      type="number"
                      value={roomForm.size}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, size: Number(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="450"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={roomForm.description}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Describe the room features and amenities..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={roomForm.available}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, available: e.target.checked }))}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Available for booking</label>
                  </div>
                </div>

                {/* Images and Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-luxury-dark">Images & Amenities</h3>
                  
                  {/* Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Images</label>
                    <div className="space-y-2">
                      {roomForm.images?.map((image, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(roomForm.images || [])]
                              newImages[index] = e.target.value
                              setRoomForm(prev => ({ ...prev, images: newImages }))
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                            placeholder="Image URL"
                          />
                          <button
                            onClick={() => handleRemoveImage(image)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddImage('')}
                          className="flex items-center space-x-2 text-luxury-gold hover:text-gold-600 transition-colors duration-300"
                        >
                          <PhotoIcon className="h-5 w-5" />
                          <span>Add Image URL</span>
                        </button>
                        <label className="flex items-center space-x-2 text-luxury-gold hover:text-gold-600 transition-colors duration-300 cursor-pointer">
                          <PhotoIcon className="h-5 w-5" />
                          <span>Upload from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {roomForm.amenities?.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 bg-luxury-gold bg-opacity-10 text-luxury-gold px-3 py-1 rounded-full text-sm"
                          >
                            <span>{amenity}</span>
                            <button
                              onClick={() => handleRemoveAmenity(amenity)}
                              className="text-luxury-gold hover:text-gold-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Balcony', 'Ocean View', 'City View', 'Jacuzzi', 'Fireplace', 'Kitchen'].map((amenity) => (
                          <button
                            key={amenity}
                            onClick={() => handleAddAmenity(amenity)}
                            disabled={roomForm.amenities?.includes(amenity)}
                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-300 ${
                              roomForm.amenities?.includes(amenity)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-50 text-gray-700 hover:bg-luxury-gold hover:text-white'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowRoomModal(false)
                    setEditingRoom(null)
                    setRoomForm({
                      name: '',
                      type: '',
                      price: 0,
                      maxOccupancy: 1,
                      size: 0,
                      amenities: [],
                      images: [],
                      description: '',
                      available: true
                    })
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoomSubmit}
                  className="px-6 py-2 bg-luxury-gold text-white rounded-lg hover:bg-gold-600 transition-colors duration-300"
                >
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard