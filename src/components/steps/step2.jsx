// src/components/steps/step2.jsx
import React, { useState } from 'react'

const Step2 = ({ userData, updateUserData, nextStep, prevStep }) => {
  const [heightUnit, setHeightUnit] = useState('cm')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Height validation
    if (heightUnit === 'cm') {
      if (!userData.heightCm) {
        setError('Please enter your height')
        return
      }
      if (userData.heightCm < 50 || userData.heightCm > 250) {
        setError('Please enter a valid height (50-250 cm)')
        return
      }
    } else {
      if (!userData.heightFeet || !userData.heightInches) {
        setError('Please enter both feet and inches')
        return
      }
      if (userData.heightFeet < 1 || userData.heightFeet > 8) {
        setError('Please enter valid feet (1-8)')
        return
      }
      if (userData.heightInches < 0 || userData.heightInches >= 12) {
        setError('Please enter valid inches (0-11)')
        return
      }
    }

    // Weight validation
    if (weightUnit === 'kg') {
      if (!userData.weightKg) {
        setError('Please enter your weight')
        return
      }
      if (userData.weightKg < 2 || userData.weightKg > 300) {
        setError('Please enter a valid weight (2-300 kg)')
        return
      }
    } else {
      if (!userData.weightLbs) {
        setError('Please enter your weight')
        return
      }
      if (userData.weightLbs < 5 || userData.weightLbs > 660) {
        setError('Please enter a valid weight (5-660 lbs)')
        return
      }
    }

    setError('')
    
    // Format data for storage
    let height, weight
    
    if (heightUnit === 'cm') {
      height = `${userData.heightCm} cm`
    } else {
      height = `${userData.heightFeet}' ${userData.heightInches}"`
    }
    
    if (weightUnit === 'kg') {
      weight = `${userData.weightKg} kg`
    } else {
      weight = `${userData.weightLbs} lbs`
    }

    updateUserData('height', height)
    updateUserData('weight', weight)
    updateUserData('heightUnit', heightUnit)
    updateUserData('weightUnit', weightUnit)
    
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
              Physical Measurements
            </h2>
            <p className="text-gray-600">
              Step 2 of 3 - Enter your height and weight
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Height Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Height
                </label>
                <select 
                  value={heightUnit} 
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cm">cm</option>
                  <option value="feet">ft/in</option>
                </select>
              </div>
              
              {heightUnit === 'cm' ? (
                <input
                  type="number"
                  placeholder="Height in centimeters"
                  value={userData.heightCm || ''}
                  onChange={(e) => updateUserData('heightCm', e.target.value)}
                  className="w-full outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              ) : (
                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Feet"
                    value={userData.heightFeet || ''}
                    onChange={(e) => updateUserData('heightFeet', e.target.value)}
                    className="w-1/2 outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Inches"
                    value={userData.heightInches || ''}
                    onChange={(e) => updateUserData('heightInches', e.target.value)}
                    className="w-1/2 outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              )}
            </div>

            {/* Weight Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <select 
                  value={weightUnit} 
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              
              <input
                type="number"
                step="0.1"
                placeholder={`Weight in ${weightUnit === 'kg' ? 'kilograms' : 'pounds'}`}
                value={weightUnit === 'kg' ? userData.weightKg || '' : userData.weightLbs || ''}
                onChange={(e) => updateUserData(weightUnit === 'kg' ? 'weightKg' : 'weightLbs', e.target.value)}
                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
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

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Step2