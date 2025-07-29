import React from 'react'
import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-dark text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hotel Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-luxury-gold to-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <h3 className="text-xl font-serif font-bold">Luxury Hotel</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Experience luxury beyond imagination at our premium hotel. We offer world-class amenities, 
                exceptional service, and unforgettable memories.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-luxury-gold hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-luxury-gold hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-luxury-gold hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-luxury-gold hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.007 0C5.373 0 0 5.373 0 12.007s5.373 12.007 12.007 12.007 12.007-5.373 12.007-12.007S18.641.001 12.007.001zM8.442 18.654H5.595V8.868h2.847v9.786zM7.018 7.526c-.914 0-1.654-.74-1.654-1.654s.74-1.654 1.654-1.654 1.654.74 1.654 1.654-.74 1.654-1.654 1.654zm11.636 11.128h-2.847v-4.764c0-1.063-.019-2.433-1.482-2.433-1.482 0-1.71 1.158-1.71 2.355v4.842H9.768V8.868h2.734v1.338h.039c.381-.722 1.312-1.482 2.7-1.482 2.886 0 3.419 1.9 3.419 4.369v5.561z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-luxury-gold">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-luxury-gold transition-colors">Home</Link></li>
                <li><Link href="/rooms" className="text-gray-300 hover:text-luxury-gold transition-colors">Rooms & Suites</Link></li>
                <li><Link href="/services" className="text-gray-300 hover:text-luxury-gold transition-colors">Services</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-luxury-gold transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-luxury-gold transition-colors">Contact</Link></li>
                <li><Link href="/checkout" className="text-gray-300 hover:text-luxury-gold transition-colors">Book Now</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-luxury-gold">Our Services</h3>
              <ul className="space-y-2">
                <li className="text-gray-300">24/7 Room Service</li>
                <li className="text-gray-300">Concierge Service</li>
                <li className="text-gray-300">Spa & Wellness</li>
                <li className="text-gray-300">Business Center</li>
                <li className="text-gray-300">Airport Transfer</li>
                <li className="text-gray-300">Laundry Service</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-luxury-gold">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-luxury-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">123 Luxury Avenue</p>
                    <p className="text-gray-300">City Center, State 12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-luxury-gold flex-shrink-0" />
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-luxury-gold flex-shrink-0" />
                  <p className="text-gray-300">info@luxuryhotel.com</p>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-luxury-gold mb-2">Newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-l-lg focus:outline-none focus:border-luxury-gold"
                  />
                  <button className="px-4 py-2 bg-luxury-gold text-white rounded-r-lg hover:bg-gold-600 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="text-gray-400 text-sm">
                © 2024 Luxury Hotel. All rights reserved.
              </div>
              <div className="text-gray-500 text-xs">
                WEBSITE DEVELOPED BY{' '}
                <a 
                  href="https://wa.me/923290091255" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-luxury-gold hover:text-gold-400 transition-colors font-medium"
                >
                  DALIWEB
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-luxury-gold text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-luxury-gold text-sm transition-colors">
                Terms of Service
              </Link>
              {/* Admin Access - Less prominent */}
              <Link 
                href="/admin" 
                className="text-gray-700 hover:text-gray-500 text-xs transition-colors opacity-50"
                title="Admin Panel"
              >
                •
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer