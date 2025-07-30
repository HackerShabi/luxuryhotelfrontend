import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Calendar, Users, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  specialRequests: string;
}

interface PaymentInfo {
  method: 'credit_card' | 'paypal' | 'bank_transfer' | 'digital_wallet' | 'pay_on_arrival';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  maxOccupancy: number;
  images: string[];
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { roomId, roomName, checkIn, checkOut, guests } = router.query;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    specialRequests: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch room details
  useEffect(() => {
    if (router.isReady) {
      let currentRoomId = router.query.roomId as string;
      let currentCheckIn = router.query.checkIn as string;
      let currentCheckOut = router.query.checkOut as string;
      let currentGuests = router.query.guests as string;
      
      // If no URL params, try to get from localStorage (for rooms page booking)
      if (!currentRoomId) {
        const bookingDetails = localStorage.getItem('bookingDetails');
        if (bookingDetails) {
          const details = JSON.parse(bookingDetails);
          currentRoomId = details.roomId?.toString();
          currentCheckIn = details.checkInDate;
          currentCheckOut = details.checkOutDate;
          currentGuests = details.guests?.toString();
          
          // Update router query to maintain consistency
          router.replace({
            pathname: '/checkout',
            query: {
              roomId: currentRoomId,
              checkIn: currentCheckIn,
              checkOut: currentCheckOut,
              guests: currentGuests
            }
          }, undefined, { shallow: true });
        }
      }
      
      if (currentRoomId) {
        const fetchRoomDetails = async () => {
          try {
            const response = await fetch(`/api/rooms?id=${currentRoomId}`);
            const data = await response.json();
            
            if (data.success) {
              setRoom(data.data);
            } else {
              toast.error('Failed to load room details');
              router.push('/rooms');
            }
          } catch (error) {
            console.error('Error fetching room:', error);
            toast.error('Failed to load room details');
            router.push('/rooms');
          } finally {
            setLoading(false);
          }
        };

        fetchRoomDetails();
      } else {
        toast.error('Please select a room first');
        router.push('/rooms');
      }
    }
  }, [router.isReady, router]);

  const paymentMethodLabels = {
    credit_card: 'Credit/Debit Card (Visa, MasterCard, American Express)',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer (Chase, Bank of America, Wells Fargo)',
    digital_wallet: 'Digital Wallet (Apple Pay, Google Pay)',
    pay_on_arrival: 'Pay at Hotel (Cash, Card, or Bank Transfer at Front Desk)'
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn as string);
    const end = new Date(checkOut as string);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = room?.price || 0;
    const subtotal = basePrice * nights;
    const tax = subtotal * 0.1; // 10% tax
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const handleGuestInfoChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!guestInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!guestInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!guestInfo.email.trim()) newErrors.email = 'Email is required';
    if (!guestInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    
    if (paymentInfo.method === 'credit_card') {
      if (!paymentInfo.cardNumber?.trim()) newErrors.cardNumber = 'Card number is required';
      if (!paymentInfo.expiryDate?.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentInfo.cvv?.trim()) newErrors.cvv = 'CVV is required';
      if (!paymentInfo.cardholderName?.trim()) newErrors.cardholderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        roomId: parseInt(roomId as string),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: parseInt(guests as string),
        guestInfo: {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestInfo.email,
          phone: guestInfo.phone,
          address: `${guestInfo.address.street}, ${guestInfo.address.city}, ${guestInfo.address.state} ${guestInfo.address.zipCode}, ${guestInfo.address.country}`
        },
        paymentInfo: {
          method: paymentInfo.method,
          ...(paymentInfo.method === 'credit_card' && {
            cardNumber: paymentInfo.cardNumber,
            expiryDate: paymentInfo.expiryDate,
            cvv: paymentInfo.cvv,
            cardholderName: paymentInfo.cardholderName
          })
        },
        specialRequests: guestInfo.specialRequests || ''
      };
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast.success('Booking confirmed successfully!');
        router.push(`/booking-confirmation?bookingId=${result.data._id}`);
      } else {
        throw new Error(result.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Room not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600 mt-2">Just a few more details to confirm your reservation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Guest Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="mr-2" size={20} />
                    Guest Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={guestInfo.firstName}
                        onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={guestInfo.lastName}
                        onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={guestInfo.address.street}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={guestInfo.address.city}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={guestInfo.address.state}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter state/province"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        value={guestInfo.address.zipCode}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter ZIP/postal code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={guestInfo.address.country}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter country"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        value={guestInfo.specialRequests}
                        onChange={(e) => handleGuestInfoChange('specialRequests', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any special requests or preferences..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Payment Information
                  </h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    
                    {/* Online Payment Options */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Online Payment</h3>
                      <div className="space-y-2">
                        {(['credit_card', 'paypal', 'bank_transfer', 'digital_wallet'] as const).map((method) => (
                          <label key={method} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={paymentInfo.method === method}
                              onChange={(e) => handlePaymentInfoChange('method', e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-sm text-gray-700">{paymentMethodLabels[method]}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Payment on Arrival */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Payment on Arrival</h3>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_on_arrival"
                          checked={paymentInfo.method === 'pay_on_arrival'}
                          onChange={(e) => handlePaymentInfoChange('method', e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">{paymentMethodLabels.pay_on_arrival}</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Credit Card Details */}
                  {paymentInfo.method === 'credit_card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardholderName || ''}
                          onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter cardholder name"
                        />
                        {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber || ''}
                          onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate || ''}
                          onChange={(e) => handlePaymentInfoChange('expiryDate', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv || ''}
                          onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Booking'}
                  </button>
                </div>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    <span className="text-sm">
                      {checkIn} - {checkOut} ({calculateNights()} nights)
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="mr-2" size={16} />
                    <span className="text-sm">{guests} guests</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    {room.images && room.images.length > 0 && (
                      <img 
                        src={room.images[0]} 
                        alt={room.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{room.type}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{checkOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nights:</span>
                        <span className="font-medium">{calculateNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Occupancy:</span>
                        <span className="font-medium">{room.maxOccupancy} guests</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Room Rate (${room.price}/night × {calculateNights()} nights)</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;