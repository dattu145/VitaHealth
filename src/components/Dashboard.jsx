// src/Dashboard.js
import React, { useState, useEffect } from 'react'
import Step1 from './steps/step1'
import Step2 from './steps/step2'
import Step3 from './steps/step3'
import HealthHistory from './HealthHistory'
import Header from './Layout/Header'
import '../App'

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentView, setCurrentView] = useState('analysis') // 'analysis' or 'history'
  const [userData, setUserData] = useState({})
  const backgrounds = [
    "https://images.squarespace-cdn.com/content/v1/559ed917e4b0811bfe9ad3b8/1527627221257-CU0NMNQ1LQ0L4EZ7W2Q8/iStock-654167354.jpg?format=1500w",
    "https://img.freepik.com/free-photo/health-still-life-with-copy-space_23-2148854031.jpg?semt=ais_hybrid", 
    "https://lead-genie.co.uk/wp-content/uploads/2024/09/Mis-Sold-Investments-18-1024x682.jpg"  
  ]

  useEffect(() => {
    const backgroundEl = document.getElementById("background")
    if (backgroundEl) {
      backgroundEl.style.backgroundImage = `url('${backgrounds[currentStep - 1]}')`
    }
  }, [currentStep])

  const updateUserData = (key, value) => {
    setUserData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const nextStep = () => setCurrentStep(prev => prev + 1)
  const prevStep = () => setCurrentStep(prev => prev - 1)

  const resetAnalysis = () => {
    setCurrentStep(1)
    setUserData({})
    setCurrentView('analysis')
  }

  return (
    <div>
      <Header />
      <div id="background"></div>
      
      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('analysis')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Health Analysis
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Health History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentView === 'analysis' ? (
        <>
          {currentStep === 1 && (
            <Step1 
              userData={userData} 
              updateUserData={updateUserData} 
              nextStep={nextStep} 
            />
          )}
          
          {currentStep === 2 && (
            <Step2 
              userData={userData} 
              updateUserData={updateUserData} 
              nextStep={nextStep} 
              prevStep={prevStep} 
            />
          )}
          
          {currentStep === 3 && (
            <Step3 
              userData={userData} 
              prevStep={prevStep} 
            />
          )}
        </>
      ) : (
        <HealthHistory />
      )}

      {/* Start New Analysis Button (shown in history view) */}
      {currentView === 'history' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={resetAnalysis}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Analysis</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard