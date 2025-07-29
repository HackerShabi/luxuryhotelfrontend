import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import {
  CreditCardIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
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
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  specialRequests: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZip: string
  paymentMethod: 'credit' | 'debit' | 'paypal' | 'arrival'
}

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    specialRequests: ''
  })
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    paymentMethod: 'credit'
  })

  useEffect(() => {
    // Get booking details from router query or localStorage
    const { roomId, roomName, checkIn, checkOut, guests } = router.query
    
    if (roomId && roomName && checkIn && checkOut && guests) {
      const checkInDate = new Date(checkIn as string)
      const checkOutDate = new Date(checkOut as string)
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      const pricePerNight = 299 // This would come from the room data
      const subtotal = nights * pricePerNight
      const taxes = subtotal * 0.12 // 12% tax
      const finalTotal = subtotal + taxes
      
      setBookingDetails({
        roomId: roomId as string,
        roomName: roomName as string,
        roomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        checkIn: checkIn as string,
        checkOut: checkOut as string,
        guests: parseInt(guests as string),
        nights,
        pricePerNight,
        totalPrice: subtotal,
        taxes,
        finalTotal
      })
    } else {
      // Try to get booking details from localStorage
      try {
        const storedBookingDetails = localStorage.getItem('bookingDetails')
        if (storedBookingDetails) {
          const bookingData = JSON.parse(storedBookingDetails)
          const checkInDate = new Date(bookingData.checkInDate)
          const checkOutDate = new Date(bookingData.checkOutDate)
          const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
          const pricePerNight = bookingData.roomPrice || 299
          const subtotal = nights * pricePerNight
          const taxes = subtotal * 0.12 // 12% tax
          const finalTotal = subtotal + taxes
          
          setBookingDetails({
            roomId: bookingData.roomId || '1',
            roomName: bookingData.roomType || 'Luxury Suite',
            roomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            checkIn: bookingData.checkInDate,
            checkOut: bookingData.checkOutDate,
            guests: bookingData.guests || 2,
            nights,
            pricePerNight,
            totalPrice: subtotal,
            taxes,
            finalTotal
          })
        } else {
          // Redirect to rooms page if no booking details found
          router.push('/rooms')
        }
      } catch (error) {
        console.error('Error parsing booking details:', error)
        router.push('/rooms')
      }
    }
  }, [router])

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setGuestInfo(prev => ({ ...prev, [name]: value }))
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPaymentInfo(prev => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    return required.every(field => guestInfo[field as keyof GuestInfo].trim() !== '')
  }

  const validateStep2 = () => {
    if (paymentInfo.paymentMethod === 'arrival') {
      return true // No card details required for pay on arrival
    }
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName']
    return required.every(field => paymentInfo[field as keyof PaymentInfo].trim() !== '')
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 1) {
      toast.error('Please fill in all required guest information fields')
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBookingSubmit = async () => {
    if (!validateStep2()) {
      toast.error('Please fill in all required payment information fields')
      return
    }

    setIsProcessing(true)
    
    try {
      // Store booking data in localStorage for confirmation page
      localStorage.setItem('bookingDetails', JSON.stringify({
        ...bookingDetails,
        roomImage: `https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`
      }))
      localStorage.setItem('guestInfo', JSON.stringify(guestInfo))
      
      // Store payment method info
      const paymentMethodLabels = {
        credit: 'Credit Card',
        debit: 'Debit Card', 
        paypal: 'PayPal',
        arrival: 'Pay on Arrival'
      }
      localStorage.setItem('paymentMethod', paymentMethodLabels[paymentInfo.paymentMethod])
      
      // Simulate payment processing (skip for pay on arrival)
      if (paymentInfo.paymentMethod !== 'arrival') {
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Here you would typically send the booking data to your backend
      const bookingData = {
        ...bookingDetails,
        guestInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: paymentInfo.paymentMethod !== 'arrival' ? paymentInfo.cardNumber.slice(-4) : '' // Only store last 4 digits for card payments
        }
      }
      
      console.log('Booking submitted:', bookingData)
      
      const successMessage = paymentInfo.paymentMethod === 'arrival' 
        ? 'Booking confirmed! You can pay at the hotel upon arrival.'
        : 'Booking confirmed! Payment processed successfully.'
      
      toast.success(successMessage)
      
      // Redirect to confirmation page
      setTimeout(() => {
        router.push('/booking-confirmation')
      }, 2000)
      
    } catch (error) {
      const errorMessage = paymentInfo.paymentMethod === 'arrival'
        ? 'Booking failed. Please try again.'
        : 'Payment failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!bookingDetails) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step ? 'bg-luxury-gold text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      step
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step ? 'text-luxury-gold' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Guest Info' : step === 2 ? 'Payment' : 'Confirmation'}
                  </span>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-4 ${
                      currentStep > step ? 'bg-luxury-gold' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-3xl font-serif font-bold text-luxury-dark mb-6">
                    Guest <span className="text-luxury-gold">Information</span>
                  </h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={guestInfo.firstName}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={guestInfo.lastName}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={guestInfo.email}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={guestInfo.phone}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={guestInfo.address}
                        onChange={handleGuestInfoChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={guestInfo.city}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={guestInfo.state}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={guestInfo.zipCode}
                          onChange={handleGuestInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={guestInfo.country}
                        onChange={handleGuestInfoChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={guestInfo.specialRequests}
                        onChange={handleGuestInfoChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent resize-none"
                        placeholder="Any special requests or preferences..."
                      />
                    </div>
                  </form>
                  
                  <div className="flex justify-end mt-8">
                    <motion.button
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-luxury-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300"
                    >
                      Continue to Payment
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-3xl font-serif font-bold text-luxury-dark mb-6">
                    Payment <span className="text-luxury-gold">Information</span>
                  </h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'credit', label: 'Credit Card', icon: CreditCardIcon },
                        { value: 'debit', label: 'Debit Card', icon: CreditCardIcon },
                        { value: 'paypal', label: 'PayPal', icon: ShieldCheckIcon },
                        { value: 'arrival', label: 'Pay on Arrival', icon: ShieldCheckIcon }
                      ].map((method) => (
                        <label key={method.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentInfo.paymentMethod === method.value}
                            onChange={handlePaymentInfoChange}
                            className="sr-only"
                          />
                          <div className={`relative border-2 rounded-lg p-4 transition-all duration-300 flex items-center space-x-3 ${
                            paymentInfo.paymentMethod === method.value
                              ? 'border-luxury-gold bg-gold-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            <method.icon className="h-6 w-6 text-gray-600" />
                            <span className="text-base font-medium text-gray-900">{method.label}</span>
                            {paymentInfo.paymentMethod === method.value && (
                              <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {paymentInfo.paymentMethod === 'arrival' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <ShieldCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Pay on Arrival</h3>
                      <p className="text-blue-700">
                        You can pay for your reservation when you arrive at the hotel. 
                        We accept cash, credit cards, and debit cards at the front desk.
                      </p>
                      <p className="text-sm text-blue-600 mt-2">
                        Note: Your reservation will be held for 24 hours after check-in time.
                      </p>
                    </div>
                  ) : (
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={paymentInfo.cardholderName}
                          onChange={handlePaymentInfoChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentInfoChange}
                        required
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentInfoChange}
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentInfoChange}
                          required
                          maxLength={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </form>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    <motion.button
                      onClick={handlePreviousStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handleBookingSubmit}
                      disabled={isProcessing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-luxury-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="h-5 w-5" />
                          <span>Complete Booking</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
              >
                <h3 className="text-2xl font-serif font-bold text-luxury-dark mb-6">
                  Booking <span className="text-luxury-gold">Summary</span>
                </h3>
                
                {/* Room Details */}
                <div className="mb-6">
                  <img
                    src={bookingDetails.roomImage}
                    alt={bookingDetails.roomName}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h4 className="text-lg font-semibold text-luxury-dark mb-2">
                    {bookingDetails.roomName}
                  </h4>
                </div>
                
                {/* Booking Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <div>
                      <p className="text-sm">Check-in: {new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
                      <p className="text-sm">Check-out: {new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <UserGroupIcon className="h-5 w-5" />
                    <span className="text-sm">{bookingDetails.guests} Guest{bookingDetails.guests > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span className="text-sm">{bookingDetails.nights} Night{bookingDetails.nights > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>${bookingDetails.pricePerNight}/night × {bookingDetails.nights} nights</span>
                    <span>${bookingDetails.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees</span>
                    <span>${bookingDetails.taxes}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-luxury-dark">
                    <span>Total</span>
                    <span>${bookingDetails.finalTotal}</span>
                  </div>
                </div>
                
                {/* Security Notice */}
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-semibold text-green-800 mb-1">
                        Secure Payment
                      </h5>
                      <p className="text-xs text-green-700">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cancellation Policy */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-semibold text-yellow-800 mb-1">
                        Cancellation Policy
                      </h5>
                      <p className="text-xs text-yellow-700">
                        Free cancellation up to 24 hours before check-in. After that, the first night is non-refundable.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CheckoutPage