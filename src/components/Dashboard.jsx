// src/Dashboard.js
import React, { useState, useEffect } from 'react'
import Step1 from './steps/step1'
import Step2 from './steps/step2'
import Step3 from './steps/step3'
import Header from './Layout/Header'
import '../App'

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(1)
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

  return (
    <div>
      <Header />
      <div id="background"></div>
      
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
    </div>
  )
}

export default Dashboard