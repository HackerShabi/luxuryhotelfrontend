import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  inquiryType: string
}

interface ContactInfo {
  icon: React.ComponentType<any>
  title: string
  details: string[]
  color: string
}

const contactInfo: ContactInfo[] = [
  {
    icon: PhoneIcon,
    title: 'Phone Numbers',
    details: ['+1 (555) 123-4567', '+1 (555) 123-4568', 'Toll Free: 1-800-LUXURY'],
    color: 'text-blue-600'
  },
  {
    icon: EnvelopeIcon,
    title: 'Email Addresses',
    details: ['info@luxuryhotel.com', 'reservations@luxuryhotel.com', 'concierge@luxuryhotel.com'],
    color: 'text-green-600'
  },
  {
    icon: MapPinIcon,
    title: 'Address',
    details: ['123 Luxury Avenue', 'Downtown District', 'New York, NY 10001'],
    color: 'text-red-600'
  },
  {
    icon: ClockIcon,
    title: 'Business Hours',
    details: ['Reception: 24/7', 'Concierge: 6:00 AM - 12:00 AM', 'Restaurant: 6:00 AM - 11:00 PM'],
    color: 'text-purple-600'
  }
]

const departments = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'reservations', label: 'Reservations' },
  { value: 'events', label: 'Events & Meetings' },
  { value: 'concierge', label: 'Concierge Services' },
  { value: 'feedback', label: 'Feedback & Complaints' },
  { value: 'careers', label: 'Careers' }
]

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your backend
      console.log('Contact form submitted:', formData)
      
      toast.success('Thank you for your message! We\'ll get back to you within 24 hours.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-luxury-dark text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/90 to-luxury-dark/70" />
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Contact Us"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                Contact <span className="text-luxury-gold">Us</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                We're here to help make your stay exceptional. Reach out to us anytime.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Contact Info */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-serif font-bold text-luxury-dark mb-6">
                Get in <span className="text-luxury-gold">Touch</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Multiple ways to reach us for any questions, reservations, or assistance you may need
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className={`w-12 h-12 ${info.color} bg-current/10 rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-luxury-dark mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-16 bg-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-3xl font-serif font-bold text-luxury-dark mb-6">
                  Send us a <span className="text-luxury-gold">Message</span>
                </h3>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                      >
                        {departments.map(dept => (
                          <option key={dept.value} value={dept.value}>{dept.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-luxury-gold text-white py-4 px-6 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
              
              {/* Map & Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Map */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-64 bg-gray-200 relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635959655932!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hotel Location"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-luxury-dark mb-3">Our Location</h4>
                    <p className="text-gray-600 mb-4">
                      Located in the heart of downtown, our hotel offers easy access to major attractions, 
                      business districts, and transportation hubs.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-luxury-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 flex items-center space-x-2"
                    >
                      <MapPinIcon className="h-5 w-5" />
                      <span>Get Directions</span>
                    </motion.button>
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-red-800 mb-3 flex items-center space-x-2">
                    <PhoneIcon className="h-6 w-6" />
                    <span>Emergency Contact</span>
                  </h4>
                  <p className="text-red-700 mb-2">24/7 Emergency Hotline</p>
                  <p className="text-2xl font-bold text-red-800">+1 (555) 911-HELP</p>
                  <p className="text-red-600 text-sm mt-2">
                    For urgent matters outside business hours or emergencies during your stay.
                  </p>
                </div>
                
                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-xl font-semibold text-luxury-dark mb-4">Follow Us</h4>
                  <p className="text-gray-600 mb-4">
                    Stay connected with us on social media for the latest updates, offers, and behind-the-scenes content.
                  </p>
                  <div className="flex space-x-4">
                    {[
                      { name: 'Facebook', color: 'bg-blue-600' },
                      { name: 'Instagram', color: 'bg-pink-600' },
                      { name: 'Twitter', color: 'bg-blue-400' },
                      { name: 'LinkedIn', color: 'bg-blue-700' }
                    ].map((social, index) => (
                      <motion.button
                        key={social.name}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`${social.color} text-white w-12 h-12 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300`}
                      >
                        <GlobeAltIcon className="h-6 w-6" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-serif font-bold text-luxury-dark mb-6">
                Frequently Asked <span className="text-luxury-gold">Questions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick answers to common questions about our hotel and services
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: 'What are your check-in and check-out times?',
                  answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request.'
                },
                {
                  question: 'Do you offer airport transportation?',
                  answer: 'Yes, we provide complimentary airport shuttle service. Please contact our concierge to arrange pickup times.'
                },
                {
                  question: 'Is parking available at the hotel?',
                  answer: 'We offer both valet and self-parking options. Valet parking is $35/night and self-parking is $25/night.'
                },
                {
                  question: 'What dining options are available?',
                  answer: 'We have three restaurants, a rooftop bar, 24-hour room service, and a coffee shop in the lobby.'
                },
                {
                  question: 'Do you allow pets?',
                  answer: 'Yes, we are pet-friendly! We welcome dogs and cats with a $75 pet fee per stay. Please inform us during booking.'
                },
                {
                  question: 'What amenities are included?',
                  answer: 'All rooms include free WiFi, fitness center access, business center, and concierge services. Pool and spa access may vary by room type.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-luxury-dark mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default ContactPage