import React, { useState } from 'react'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import { CalendarIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import 'react-datepicker/dist/react-datepicker.css'

const QuickBookingForm: React.FC = () => {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | null>(new Date())
  const [checkOut, setCheckOut] = useState<Date | null>(new Date(Date.now() + 24 * 60 * 60 * 1000))
  const [guests, setGuests] = useState(2)
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)

  const handleSearch = () => {
    const searchParams = {
      checkInDate: checkIn?.toISOString().split('T')[0] || '',
      checkOutDate: checkOut?.toISOString().split('T')[0] || '',
      guests: guests
    }
    
    // Store search parameters in localStorage for room selection
    localStorage.setItem('searchParams', JSON.stringify(searchParams))
    
    router.push('/rooms')
  }

  return (
    <div className="absolute top-full left-0 right-0 transform -translate-y-1/2 z-30">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-2xl p-6 mx-4 md:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Check-in Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Check-in Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent pl-10"
                  placeholderText="Select date"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Check-out Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn || new Date()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent pl-10"
                  placeholderText="Select date"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Guests
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent pl-10 text-left bg-white"
                >
                  {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </button>
                <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                {isGuestsOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Adults</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{guests}</span>
                          <button
                            type="button"
                            onClick={() => setGuests(Math.min(8, guests + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsGuestsOpen(false)}
                        className="w-full mt-3 px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-gold-600 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-luxury-gold to-gold-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Search Rooms</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickBookingForm