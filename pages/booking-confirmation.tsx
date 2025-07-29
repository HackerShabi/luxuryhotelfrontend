import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout/Layout'
import { motion } from 'framer-motion'
import { CheckCircleIcon, CalendarDaysIcon, UserGroupIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface BookingDetails {
  roomId: string
  roomName: string
  roomImage: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  pricePerNight: number
  totalPrice: number
  taxes: number
  finalTotal: number
}

interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  specialRequests: string
}

const BookingConfirmationPage = () => {
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null)
  const [confirmationNumber, setConfirmationNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    // Generate confirmation number
    const generateConfirmationNumber = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      let result = ''
      
      // Add 2 letters
      for (let i = 0; i < 2; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      
      // Add 6 numbers
      for (let i = 0; i < 6; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length))
      }
      
      return result
    }

    // Try to get booking data from localStorage or router query
    const storedBookingDetails = localStorage.getItem('bookingDetails')
    const storedGuestInfo = localStorage.getItem('guestInfo')
    const storedPaymentMethod = localStorage.getItem('paymentMethod')

    if (storedBookingDetails && storedGuestInfo) {
      setBookingDetails(JSON.parse(storedBookingDetails))
      setGuestInfo(JSON.parse(storedGuestInfo))
      setPaymentMethod(storedPaymentMethod || 'Credit Card')
      setConfirmationNumber(generateConfirmationNumber())
      
      // Clear the stored data
      localStorage.removeItem('bookingDetails')
      localStorage.removeItem('guestInfo')
      localStorage.removeItem('paymentMethod')
    } else {
      // If no booking data found, redirect to rooms page
      toast.error('No booking information found')
      router.push('/rooms')
    }
  }, [router])

  if (!bookingDetails || !guestInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-luxury-cream via-white to-luxury-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <CheckCircleIcon className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-luxury-dark mb-4">
              Booking <span className="text-luxury-gold">Confirmed!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for choosing our luxury hotel
            </p>
            <p className="text-lg text-gray-500">
              Confirmation Number: <span className="font-bold text-luxury-gold">{confirmationNumber}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                Booking <span className="text-luxury-gold">Details</span>
              </h2>
              
              {/* Room Image */}
              <div className="mb-6">
                <img
                  src={bookingDetails.roomImage}
                  alt={bookingDetails.roomName}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold text-luxury-dark mt-4">
                  {bookingDetails.roomName}
                </h3>
              </div>

              {/* Stay Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Check-in: {new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
                    <p className="font-medium">Check-out: {new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <UserGroupIcon className="h-5 w-5" />
                  <span className="font-medium">{bookingDetails.guests} Guest{bookingDetails.guests > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <span className="font-medium">{bookingDetails.nights} Night{bookingDetails.nights > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-6 mt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>${bookingDetails.pricePerNight}/night × {bookingDetails.nights} nights</span>
                  <span>${bookingDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>${bookingDetails.taxes}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-luxury-dark">
                  <span>Total Paid</span>
                  <span>${bookingDetails.finalTotal}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Payment Method: {paymentMethod}
                </div>
              </div>
            </motion.div>

            {/* Guest Information & Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Guest Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  Guest <span className="text-luxury-gold">Information</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Guest Name</p>
                    <p className="font-semibold text-luxury-dark">{guestInfo.firstName} {guestInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-luxury-dark">{guestInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-luxury-dark">{guestInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-semibold text-luxury-dark">{guestInfo.country}</p>
                  </div>
                  {guestInfo.specialRequests && (
                    <div>
                      <p className="text-sm text-gray-500">Special Requests</p>
                      <p className="font-semibold text-luxury-dark">{guestInfo.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  Contact <span className="text-luxury-gold">Information</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-luxury-gold" />
                    <div>
                      <p className="font-semibold text-luxury-dark">Hotel Address</p>
                      <p className="text-gray-600">123 Luxury Avenue, Paradise City, PC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-luxury-gold" />
                    <div>
                      <p className="font-semibold text-luxury-dark">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-luxury-gold" />
                    <div>
                      <p className="font-semibold text-luxury-dark">Email</p>
                      <p className="text-gray-600">reservations@luxuryhotel.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-luxury-gold bg-opacity-10 border border-luxury-gold rounded-xl p-6">
                <h3 className="text-lg font-semibold text-luxury-dark mb-4">Important Information</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Check-in time: 3:00 PM</li>
                  <li>• Check-out time: 11:00 AM</li>
                  <li>• Please bring a valid ID for check-in</li>
                  <li>• Confirmation email has been sent to your email address</li>
                  <li>• For any changes or cancellations, please contact us at least 24 hours in advance</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <button
              onClick={() => router.push('/')}
              className="bg-luxury-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300"
            >
              Return to Home
            </button>
            <button
              onClick={() => router.push('/rooms')}
              className="bg-white text-luxury-gold border-2 border-luxury-gold px-8 py-3 rounded-lg font-semibold hover:bg-luxury-gold hover:text-white transition-colors duration-300"
            >
              Book Another Room
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default BookingConfirmationPage