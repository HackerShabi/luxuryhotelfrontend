import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import io from 'socket.io-client'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

// Types
interface Room {
  _id: string
  name: string
  type: string
  price: number
  maxOccupancy: number
  size: number
  amenities: string[]
  images: string[]
  description: string
  available: boolean
  createdAt: string
  updatedAt: string
}

interface Booking {
  _id: string
  room: {
    _id: string
    name: string
    type: string
    price: number
  }
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
}

interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  inquiryType: string
  read: boolean
  createdAt: string
}

interface Stats {
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
  totalRooms: number
  pendingBookings: number
  unreadContacts: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://luxuryhotelbackend.onrender.com/api'
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://luxuryhotelbackend.onrender.com'

export default function AdminPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Data states
  const [stats, setStats] = useState<Stats>({
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
  
  // UI states
  const [activeTab, setActiveTab] = useState('dashboard')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  // Load data on mount
  useEffect(() => {
    loadDashboardData()
    setLoading(false)
  }, [])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadDashboardData()
      }, 30000) // 30 seconds
      setRefreshInterval(interval)
      return () => clearInterval(interval)
    } else if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
  }, [autoRefresh])

  // Socket.IO connection for real-time updates
  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
      newSocket.emit('join-admin')
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('new-booking', (data) => {
      console.log('New booking received:', data)
      toast.success(`New booking from ${data.booking.guestInfo.firstName} ${data.booking.guestInfo.lastName}`)
      // Refresh bookings data
      loadDashboardData()
    })

    newSocket.on('booking-updated', (data: { booking: Booking }) => {
      console.log('Booking updated:', data)
      toast.success(`Booking ${data.booking._id} status updated to ${data.booking.status}`)
      // Refresh bookings data
      loadDashboardData()
    })

    newSocket.on('new-contact', (data) => {
      console.log('New contact received:', data)
      toast.success(`New contact message from ${data.contact.name}`)
      // Refresh contacts data
      loadDashboardData()
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'x-admin-key': 'admin123' // Add admin key for additional auth
      }

      // Load all data in parallel
      const [statsRes, roomsRes, bookingsRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers }),
        fetch(`${API_BASE_URL}/admin/rooms`, { headers }),
        fetch(`${API_BASE_URL}/admin/bookings`, { headers }),
        fetch(`${API_BASE_URL}/admin/contacts`, { headers })
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data)
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json()
        setRooms(roomsData.data)
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData.data)
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        setContacts(contactsData.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    }
  }

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? { ...booking, status } : booking
        ))
        toast.success(`Booking ${status} successfully`)
        loadDashboardData() // Refresh stats
      } else {
        toast.error('Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Failed to update booking status')
    }
  }

  const markContactAsRead = async (contactId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${contactId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setContacts(prev => prev.map(contact => 
          contact._id === contactId ? { ...contact, read: true } : contact
        ))
        loadDashboardData() // Refresh stats
      }
    } catch (error) {
      console.error('Error marking contact as read:', error)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Luxury <span className="text-luxury-gold">Hotel</span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Auto-refresh:</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? 'bg-luxury-gold' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={loadDashboardData}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
              { id: 'bookings', name: 'Bookings', icon: BuildingOfficeIcon },
              { id: 'rooms', name: 'Rooms', icon: BuildingOfficeIcon },
              { id: 'contacts', name: 'Contacts', icon: EnvelopeIcon },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-luxury-gold text-luxury-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRooms}</p>
                  </div>
                  <BuildingOfficeIcon className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread Contacts</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.unreadContacts}</p>
                  </div>
                  <EnvelopeIcon className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.user.firstName} {booking.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{booking.room.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${booking.totalAmount}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((contact) => (
                    <div key={contact._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!contact.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
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
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Bookings Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user.firstName} {booking.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.room.name}</div>
                        <div className="text-sm text-gray-500">{booking.room.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">{booking.guests} guests</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${booking.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'completed')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <div key={contact._id} className={`p-6 ${!contact.read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                        {!contact.read && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {contact.email}
                        </span>
                        {contact.phone && (
                          <span className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            {contact.phone}
                          </span>
                        )}
                        <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-900">{contact.subject}</h4>
                        <p className="mt-1 text-gray-700">{contact.message}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {!contact.read && (
                        <button
                          onClick={() => markContactAsRead(contact._id)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}