'use client'

import { useState, useEffect } from 'react'
import { supabase, WebinarLink, Registration } from '@/lib/supabase'

// Icons as inline SVGs for better performance
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

// Color mapping for different course types
const courseColors: { [key: number]: string } = {
  1: 'from-purple-500 to-indigo-600',    // Professionals
  2: 'from-emerald-500 to-teal-600',     // School
  3: 'from-blue-500 to-cyan-600',        // College
  4: 'from-orange-500 to-amber-600',     // Tech
  5: 'from-rose-500 to-pink-600',        // Leaders
}

const courseIcons: { [key: number]: string } = {
  1: '💼',  // Professionals
  2: '📚',  // School
  3: '🎓',  // College
  4: '💻',  // Tech
  5: '🏆',  // Leaders
}

// Profession choices for the form
const professionChoices = [
  { value: 'school_student', label: 'School Student' },
  { value: 'college_student', label: 'College Student' },
  { value: 'job_seeker', label: 'Job Seeker' },
  { value: 'working_professional', label: 'Working Professional' },
  { value: 'tech_developer', label: 'Tech Developer' },
  { value: 'data_engineer_scientist', label: 'Data Engineer / Data Scientist' },
  { value: 'home_maker', label: 'Home Maker' },
  { value: 'other', label: 'Other' },
]

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

// Format time for display
function formatTime(timeStr: string, timezone: string): string {
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm} ${timezone}`
}

// Get UTM parameters from URL
function getUTMParams(): { [key: string]: string } {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  }
}

// Detect device type
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

// Detect browser
function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  if (ua.includes('Opera')) return 'Opera'
  return 'Other'
}

export default function Home() {
  const [webinars, setWebinars] = useState<WebinarLink[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarLink | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registeredData, setRegisteredData] = useState<{name: string, date: string, time: string, timezone: string} | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    date_of_birth: '',
    profession_choice: '',
    other_profession_description: '',
    marketing_consent: true,
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  // Fetch webinars on mount
  useEffect(() => {
    fetchWebinars()
  }, [])

  async function fetchWebinars() {
    try {
      const { data, error } = await supabase
        .from('QR_landing_webinar_links')
        .select('*')
        .eq('is_active', true)
        .order('course_order', { ascending: true })

      if (error) throw error
      setWebinars(data || [])
    } catch (error) {
      console.error('Error fetching webinars:', error)
      // Set sample data for demo if fetch fails
      setWebinars([
        {
          id: '1',
          course_id: 1,
          course_name: 'Agentic AI Certification for Working Professionals',
          course_short_name: 'Agentic AI - Professionals',
          duration_minutes: 90,
          target_audience: 'Working Professionals across all industries',
          age_group: '24 to 60 years',
          webinar_date: '2025-01-19',
          webinar_time: '11:00:00',
          timezone: 'IST',
          registration_link: null,
          ms_teams_link: null,
          is_active: true,
          max_registrations: 500,
          current_registrations: 0,
          course_description: 'Master Agentic AI concepts',
          benefits: ['Official AI Certification', 'Hands-on Training', 'Career Guidance'],
          course_order: 1
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function validateForm(): boolean {
    const errors: {[key: string]: string} = {}
    
    if (!formData.full_name.trim()) errors.full_name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.mobile.trim()) errors.mobile = 'Mobile is required'
    else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.mobile.replace(/\s/g, ''))) errors.mobile = 'Invalid mobile number'
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required'
    if (!formData.profession_choice) errors.profession_choice = 'Please select your profession'
    if (formData.profession_choice === 'other' && !formData.other_profession_description.trim()) {
      errors.other_profession_description = 'Please describe your profession'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm() || !selectedWebinar) return
    
    setSubmitting(true)
    
    try {
      const utmParams = getUTMParams()
      
      const registrationData: Registration = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        date_of_birth: formData.date_of_birth,
        profession_choice: formData.profession_choice,
        other_profession_description: formData.profession_choice === 'other' ? formData.other_profession_description.trim() : undefined,
        course_id: selectedWebinar.course_id,
        course_name: selectedWebinar.course_name,
        webinar_date: selectedWebinar.webinar_date,
        webinar_time: selectedWebinar.webinar_time,
        timezone: selectedWebinar.timezone,
        marketing_consent: formData.marketing_consent,
        ...utmParams,
        referrer_url: typeof document !== 'undefined' ? document.referrer : undefined,
        landing_page_url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        device_type: getDeviceType(),
        browser: getBrowser(),
      }

      const { error } = await supabase
        .from('QR_landing_registrations')
        .insert([registrationData])

      if (error) throw error

      setRegisteredData({
        name: formData.full_name,
        date: formatDate(selectedWebinar.webinar_date),
        time: formatTime(selectedWebinar.webinar_time, selectedWebinar.timezone),
        timezone: selectedWebinar.timezone
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again or contact AI@withArijit.com')
    } finally {
      setSubmitting(false)
    }
  }

  function openRegistrationModal(webinar: WebinarLink) {
    setSelectedWebinar(webinar)
    setShowModal(true)
    setSubmitted(false)
    setFormData({
      full_name: '',
      email: '',
      mobile: '',
      date_of_birth: '',
      profession_choice: '',
      other_profession_description: '',
      marketing_consent: true,
    })
    setFormErrors({})
  }

  function closeModal() {
    setShowModal(false)
    setSelectedWebinar(null)
    setSubmitted(false)
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-4 pb-2 px-4">
        <div className="max-w-lg mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                AI
              </div>
              <span className="text-xl font-bold text-gray-800">WithArijit.com</span>
            </div>
          </div>
          
          {/* Hero Section */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold mb-2 shadow-sm">
              <SparklesIcon />
              <span>100% FREE Certification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              Get <span className="gradient-text">AI Certified</span> in
              <br />90 Minutes
            </h1>
            <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
              Boost your resume, LinkedIn & career prospects with industry-recognized AI certification
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-3 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Live Sessions
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Expert Trainers
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Certificate
            </span>
          </div>
        </div>
      </header>

      {/* Course Cards Section */}
      <section className="relative z-10 px-3 pb-24">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Choose Your Track
          </h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shimmer h-24" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {webinars.map((webinar) => (
                <div
                  key={webinar.course_id}
                  className={`webinar-card ${expandedCard === webinar.course_id ? 'expanded' : ''}`}
                >
                  {/* Main card content */}
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => setExpandedCard(expandedCard === webinar.course_id ? null : webinar.course_id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Course icon/emoji */}
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${courseColors[webinar.course_order] || courseColors[1]} flex items-center justify-center text-lg shadow-md flex-shrink-0`}>
                        {courseIcons[webinar.course_order] || '🎯'}
                      </div>
                      
                      {/* Course info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 pr-6">
                          {webinar.course_short_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ClockIcon />
                            {webinar.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon />
                            {formatDate(webinar.webinar_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            {formatTime(webinar.webinar_time, webinar.timezone)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Expand indicator */}
                      <div className={`transition-transform duration-300 ${expandedCard === webinar.course_id ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expandedCard === webinar.course_id && (
                    <div className="px-3 pb-3 animate-fade-in">
                      <div className="pt-2 border-t border-gray-100">
                        {/* Age group & target audience */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-primary flex items-center gap-1">
                              <UsersIcon />
                              {webinar.age_group}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {webinar.target_audience}
                          </p>
                        </div>

                        {/* Benefits */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            What You Get
                          </h4>
                          <ul className="space-y-1.5">
                            {(Array.isArray(webinar.benefits) ? webinar.benefits : []).slice(0, 5).map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckIcon />
                                </span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Register button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openRegistrationModal(webinar)
                          }}
                          className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm bg-gradient-to-r ${courseColors[webinar.course_order] || courseColors[1]} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]`}
                        >
                          Register Now - FREE
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Collapsed register button */}
                  {expandedCard !== webinar.course_id && (
                    <div className="px-3 pb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openRegistrationModal(webinar)
                        }}
                        className={`w-full py-2 rounded-lg font-semibold text-white text-sm bg-gradient-to-r ${courseColors[webinar.course_order] || courseColors[1]} shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]`}
                      >
                        Register FREE
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-2 px-4 z-40">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-gray-500">
            © 2025 <span className="font-semibold">AIwithArijit.com</span> | Powered by Star Analytix & oStaran
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919930051053?text=Hi%20Arijit%2C%20I%20want%20to%20know%20more%20about%20the%20AI%20Certification%20Webinar"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      {/* Registration Modal */}
      {showModal && selectedWebinar && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`sticky top-0 bg-gradient-to-r ${courseColors[selectedWebinar.course_order] || courseColors[1]} text-white p-4 rounded-t-2xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Register Now</h3>
                    <p className="text-sm opacity-90">{selectedWebinar.course_short_name}</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="p-5">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Course info badge */}
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">You are registering for</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedWebinar.course_name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDate(selectedWebinar.webinar_date)} at {formatTime(selectedWebinar.webinar_time, selectedWebinar.timezone)}
                      </p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.full_name ? 'border-red-400 focus:ring-red-500' : ''}`}
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      />
                      {formErrors.full_name && <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className={`form-input ${formErrors.email ? 'border-red-400 focus:ring-red-500' : ''}`}
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        className={`form-input ${formErrors.mobile ? 'border-red-400 focus:ring-red-500' : ''}`}
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      />
                      {formErrors.mobile && <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        className={`form-input ${formErrors.date_of_birth ? 'border-red-400 focus:ring-red-500' : ''}`}
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      />
                      {formErrors.date_of_birth && <p className="text-red-500 text-xs mt-1">{formErrors.date_of_birth}</p>}
                    </div>

                    {/* Profession Choice */}
                    <div>
                      <label className="form-label">I am a... *</label>
                      <select
                        className={`form-input ${formErrors.profession_choice ? 'border-red-400 focus:ring-red-500' : ''}`}
                        value={formData.profession_choice}
                        onChange={(e) => setFormData({...formData, profession_choice: e.target.value})}
                      >
                        <option value="">Select your profession</option>
                        {professionChoices.map((choice) => (
                          <option key={choice.value} value={choice.value}>{choice.label}</option>
                        ))}
                      </select>
                      {formErrors.profession_choice && <p className="text-red-500 text-xs mt-1">{formErrors.profession_choice}</p>}
                    </div>

                    {/* Other profession description */}
                    {formData.profession_choice === 'other' && (
                      <div>
                        <label className="form-label">Please describe *</label>
                        <input
                          type="text"
                          className={`form-input ${formErrors.other_profession_description ? 'border-red-400 focus:ring-red-500' : ''}`}
                          placeholder="Describe your profession"
                          value={formData.other_profession_description}
                          onChange={(e) => setFormData({...formData, other_profession_description: e.target.value})}
                        />
                        {formErrors.other_profession_description && <p className="text-red-500 text-xs mt-1">{formErrors.other_profession_description}</p>}
                      </div>
                    )}

                    {/* Consent checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        className="custom-checkbox mt-1"
                        checked={formData.marketing_consent}
                        onChange={(e) => setFormData({...formData, marketing_consent: e.target.checked})}
                      />
                      <label htmlFor="consent" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                        You authorize <span className="font-semibold">AIwithArijit, Star Analytix, oStaran</span> to send you AI course related communications via email, SMS, and WhatsApp.
                      </label>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r ${courseColors[selectedWebinar.course_order] || courseColors[1]} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </form>
                ) : (
                  /* Success message */
                  <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center success-icon">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      🎉 Registration Successful!
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Thank you <span className="font-semibold text-gray-800">{registeredData?.name}</span> for your registration for the AI Webinar on{' '}
                      <span className="font-semibold text-gray-800">{registeredData?.date}</span> at{' '}
                      <span className="font-semibold text-gray-800">{registeredData?.time}</span>.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        📧 You shall soon receive a <span className="font-semibold">Live Session Registration Link</span> in your email & WhatsApp to proceed further.
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      For any queries, email us at{' '}
                      <a href="mailto:AI@withArijit.com" className="text-primary-600 font-semibold hover:underline">
                        AI@withArijit.com
                      </a>
                    </p>
                    <button
                      onClick={closeModal}
                      className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
