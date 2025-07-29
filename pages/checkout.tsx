import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Calendar, Users, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  specialRequests: string;
}

interface PaymentInfo {
  method: 'credit_card' | 'paypal' | 'bank_transfer' | 'digital_wallet' | 'pay_on_arrival';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { roomId, checkIn, checkOut, guests, roomType, price } = router.query;
  
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    specialRequests: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'credit_card'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    const basePrice = parseFloat(price as string) || 0;
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
    
    setIsLoading(true);
    
    try {
      const bookingData = {
        roomId,
        roomType,
        checkIn,
        checkOut,
        guests: parseInt(guests as string),
        guestInfo,
        paymentInfo,
        totalAmount: calculateTotal().total
      };
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      if (response.ok) {
        const booking = await response.json();
        router.push(`/booking-confirmation?bookingId=${booking.id}`);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

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
                        Address
                      </label>
                      <input
                        type="text"
                        value={guestInfo.address}
                        onChange={(e) => handleGuestInfoChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={guestInfo.city}
                        onChange={(e) => handleGuestInfoChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={guestInfo.country}
                        onChange={(e) => handleGuestInfoChange('country', e.target.value)}
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
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Complete Booking'}
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
                    <h3 className="font-semibold text-gray-900 mb-2">{roomType}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Room rate × {calculateNights()} nights</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & fees</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
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