// src/components/steps/step1.jsx
import React, { useState } from 'react'

const Step1 = ({ userData, updateUserData, nextStep }) => {
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!userData.name || !userData.age || !userData.gender) {
      setError('Please fill in all fields')
      return
    }

    if (userData.name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (userData.age < 1 || userData.age > 120) {
      setError('Please enter a valid age (1-120)')
      return
    }

    setError('')
    nextStep()
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Basic Information
            </h2>
            <p className="text-gray-600">
              Step 1 of 3 - Tell us about yourself
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={userData.name || ''}
                onChange={(e) => updateUserData('name', e.target.value)}
                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Age Field */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={userData.age || ''}
                onChange={(e) => updateUserData('age', e.target.value)}
                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gender
              </label>
              <div className="space-y-3">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <label key={gender} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={userData.gender === gender}
                      onChange={(e) => updateUserData('gender', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Step1