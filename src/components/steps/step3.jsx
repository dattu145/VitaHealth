// src/components/steps/step3.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const Step3 = ({ userData, prevStep }) => {
  const [bmiData, setBmiData] = useState({})
  const [healthProblem, setHealthProblem] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [medicineResponse, setMedicineResponse] = useState('')
  const [organicResponse, setOrganicResponse] = useState('')
  const [hospitalResponse, setHospitalResponse] = useState('')
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [typingComplete, setTypingComplete] = useState({
    health: false,
    medicine: false,
    organic: false,
    hospitals: false
  })

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  const { saveHealthRecord } = useAuth()

  useEffect(() => {
    calculateBMI()
    getLocation()
  }, [])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setLocation(loc)
        },
        (error) => {
          console.error('Location access denied:', error)
        }
      )
    }
  }

  const calculateBMI = () => {
    let height, weight

    if (userData.heightUnit === 'cm') {
      height = parseFloat(userData.heightCm) / 100
    } else {
      const feet = parseFloat(userData.heightFeet) || 0
      const inches = parseFloat(userData.heightInches) || 0
      height = ((feet * 12) + inches) * 0.0254
    }

    if (userData.weightUnit === 'kg') {
      weight = parseFloat(userData.weightKg)
    } else {
      weight = parseFloat(userData.weightLbs) * 0.453592
    }

    if (!height || !weight) return

    const bmi = (weight / (height * height)).toFixed(1)
    let category, healthyMin, healthyMax, advice

    if (bmi < 18.5) {
      category = "Underweight"
      healthyMin = (18.5 * height * height).toFixed(1)
      healthyMax = (24.9 * height * height).toFixed(1)
      advice = `You should gain at least ${(healthyMin - weight).toFixed(1)} kg to be in the healthy range.`
    } else if (bmi < 24.9) {
      category = "Normal Weight"
      healthyMin = healthyMax = "You're already in the healthy range!"
      advice = "Great job! Maintain your current weight."
    } else if (bmi < 29.9) {
      category = "Overweight"
      healthyMin = (18.5 * height * height).toFixed(1)
      healthyMax = (24.9 * height * height).toFixed(1)
      advice = `You should lose at least ${(weight - healthyMax).toFixed(1)} kg to be in the healthy range.`
    } else {
      category = "Obese"
      healthyMin = (18.5 * height * height).toFixed(1)
      healthyMax = (24.9 * height * height).toFixed(1)
      advice = `You should lose at least ${(weight - healthyMax).toFixed(1)} kg to be in the healthy range.`
    }

    setBmiData({ bmi, category, healthyMin, healthyMax, advice })
  }

  const callGeminiAPI = async (prompt) => {
    if (!API_KEY) {
      throw new Error("Gemini API key not found. Please check your environment variables.")
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      
      if (data.candidates && data.candidates.length > 0) {
        let responseText = data.candidates[0].content.parts[0].text

        // Preserve bold formatting but clean up other markdown
        responseText = responseText
          .replace(/\*\s*/g, "")    // Remove single asterisks (bullets)
          .replace(/\n+/g, "\n")    // Remove extra newlines
          .replace(/•\s*/g, "")     // Remove bullet points (•)

        return responseText
      } else {
        throw new Error("No response received from AI")
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      throw error
    }
  }

  const typeText = (text, setter, type) => {
    let index = 0
    let currentText = ''
    
    function typeCharacter() {
      if (index < text.length) {
        currentText += text[index]
        setter(currentText)
        index++
        setTimeout(typeCharacter, 20)
      } else {
        setTypingComplete(prev => ({ ...prev, [type]: true }))
      }
    }
    typeCharacter()
  }

  // Function to render formatted text with bold titles
  const renderFormattedText = (text) => {
    if (!text) return null
    
    // Split by lines and process each line
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <br key={index} />
      
      // Check if line has the format "Title: Description"
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const title = line.substring(0, colonIndex).trim()
        const description = line.substring(colonIndex + 1).trim()
        
        return (
          <div key={index} className="mb-2">
            <span className="font-semibold text-gray-900">{title}:</span>
            <span className="text-gray-700"> {description}</span>
          </div>
        )
      }
      
      // Regular line without colon format
      return (
        <div key={index} className="text-gray-700 mb-2">
          {line}
        </div>
      )
    })
  }

  const saveHealthData = async () => {
    setSaving(true)
    try {
      const healthData = {
        bmi: parseFloat(bmiData.bmi),
        bmiCategory: bmiData.category,
        symptoms: healthProblem,
        aiHealthAdvice: aiResponse,
        medicineSuggestions: medicineResponse,
        organicRemedies: organicResponse,
        nearbyHospitals: hospitalResponse,
        location: location ? `${location.latitude}, ${location.longitude}` : null
      }

      const { error } = await saveHealthRecord(healthData)
      
      if (error) throw error
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving health data:', error)
      alert('Failed to save health record. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const sendToAI = async () => {
    if (!healthProblem.trim()) {
      alert("Please enter your symptoms.")
      return
    }

    if (!API_KEY) {
      setAiResponse("Error: API key not configured. Please contact support.")
      return
    }

    setLoading(true)
    setAiResponse("")
    setMedicineResponse("")
    setOrganicResponse("")
    setHospitalResponse("")
    setSaveSuccess(false)
    setTypingComplete({
      health: false,
      medicine: false,
      organic: false,
      hospitals: false
    })

    try {
      const healthPrompt = `
        Provide a **brief** health recommendation for ${userData.name} use nick name or first name, aged ${userData.age}, gender ${userData.gender}, based on this symptom: ${healthProblem}.  
        Keep it under 3-4 sentences. Avoid disclaimers, subtopics, or questions.
      `

      const healthResult = await callGeminiAPI(healthPrompt)
      typeText(healthResult, setAiResponse, 'health')

      await getMedicineSuggestions(healthProblem)
      await getOrganicSuggestions(healthProblem)

      if (location) {
        await getNearbyHospitals(location.latitude, location.longitude)
      }

    } catch (error) {
      setAiResponse("Error fetching response. Please try again.")
      setTypingComplete(prev => ({ ...prev, health: true }))
    } finally {
      setLoading(false)
    }
  }

  const getMedicineSuggestions = async (userInput) => {
    try {
      const medicinePrompt = `
        Suggest tablets and medicines (brand names only, like Dolo 650, Crocin, etc.) suitable for a person aged ${userData.age} for the condition: ${userInput}.  
        Ensure the response is in this exact format, without any introductory text and give no examples:  
                
        **Medicine Name**: Dosage Instructions.  
        **Medicine Name**: Dosage Instructions.
                
        **Medicine Name**: Dosage & when to take it.  
        Keep it simple and to the point. Avoid disclaimers, subtopics, or questions.
      `

      const medicineResult = await callGeminiAPI(medicinePrompt)
      typeText(medicineResult, setMedicineResponse, 'medicine')
    } catch (error) {
      setMedicineResponse("Error fetching medicine suggestions.")
      setTypingComplete(prev => ({ ...prev, medicine: true }))
    }
  }

  const getOrganicSuggestions = async (userInput) => {
    try {
      const organicPrompt = `
        Suggest natural home remedies for a person aged ${userData.age} with the condition: ${userInput}.  
        List remedies in this exact format without any introduction and don't mention 'Remedy Name' or 'Description' in answer:  

        **Remedy Name**: Description.  
        **Remedy Name**: Description.  

        Keep it simple and to the point. Avoid disclaimers, subtopics, or questions.
      `

      const organicResult = await callGeminiAPI(organicPrompt)
      typeText(organicResult, setOrganicResponse, 'organic')
    } catch (error) {
      setOrganicResponse("Error fetching organic remedies.")
      setTypingComplete(prev => ({ ...prev, organic: true }))
    }
  }

  const getNearbyHospitals = async (lat, lon) => {
    try {
      const hospitalPrompt = `
        List the top nearby hospitals for a person located at Latitude: ${lat}, Longitude: ${lon}.
        Provide the hospital name, address in this exact format:

          **Hospital Name**,
          Address: Full Address.

        Do not add extra text, disclaimers, or subtopics. Just return the hospitals in this structured format.
      `

      const hospitalResult = await callGeminiAPI(hospitalPrompt)
      typeText(hospitalResult, setHospitalResponse, 'hospitals')
    } catch (error) {
      setHospitalResponse("Error fetching nearby hospitals.")
      setTypingComplete(prev => ({ ...prev, hospitals: true }))
    }
  }

  const getBmiColor = (bmi) => {
    if (!bmi) return 'text-blue-600'
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return 'text-yellow-600'
    if (bmiValue < 24.9) return 'text-green-600'
    if (bmiValue < 29.9) return 'text-orange-600'
    return 'text-red-600'
  }

  const getBmiBgColor = (bmi) => {
    if (!bmi) return 'bg-blue-50 border-blue-200'
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return 'bg-yellow-50 border-yellow-200'
    if (bmiValue < 24.9) return 'bg-green-50 border-green-200'
    if (bmiValue < 29.9) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  const canSaveRecord = () => {
    return aiResponse && medicineResponse && organicResponse && !saving
  }

  return (
    <div 
      className="min-h-screen flex pt-10 items-center justify-center p-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="max-w-6xl w-full space-y-6">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Health Analysis
            </h2>
            <p className="text-gray-600">
              Step 3 of 3 - Get personalized health insights
            </p>
          </div>

          {/* Enhanced BMI Card */}
          <div className={`border rounded-xl p-6 mb-6 transition-all duration-300 ${getBmiBgColor(bmiData.bmi)}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Health Report :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  <span className={getBmiColor(bmiData.bmi)}>
                    {bmiData.bmi || '--'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">BMI Score</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">
                  <span className={getBmiColor(bmiData.bmi)}>
                    {bmiData.category || 'Calculating...'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Category</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">
                  <span className="text-blue-600">
                    {bmiData.healthyMin !== bmiData.healthyMax ? 
                      `${bmiData.healthyMin} - ${bmiData.healthyMax} kg` : 
                      bmiData.healthyMin || '--'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Healthy Range</p>
              </div>
              <div className="text-center">
                <div className="text-sm mb-2">
                  <span className="text-gray-700">
                    {bmiData.advice || 'Loading advice...'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Recommendation</p>
              </div>
            </div>
          </div>

          {/* Health Problem Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="healthProblem" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Health Problem
              </label>
              <textarea
                id="healthProblem"
                value={healthProblem}
                onChange={(e) => setHealthProblem(e.target.value)}
                rows="4"
                placeholder="Describe your symptoms (e.g., 'I have had a severe headache for 7 days')"
                disabled={loading}
                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                required
              />
            </div>

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
                type="button"
                onClick={sendToAI}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Health Insights'
                )}
              </button>
            </div>

            {/* Save Record Button */}
            {canSaveRecord() && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={saveHealthData}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Health Record</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Save Success Message */}
            {saveSuccess && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
                <div className="flex items-center justify-center text-green-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Health record saved successfully!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Responses in Flex Wrap Grid */}
        <div className="flex flex-wrap gap-6 justify-start">
          {/* Health Response */}
          {aiResponse && (
            <div className="flex-1 min-w-[300px] max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Health Response</h3>
              </div>
              <div className="leading-relaxed min-h-[120px]">
                {renderFormattedText(aiResponse)}
                {!typingComplete.health && (
                  <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>
          )}

          {/* Medicine Suggestions */}
          {medicineResponse && (
            <div className="flex-1 min-w-[300px] max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Medicines</h3>
              </div>
              <div className="leading-relaxed min-h-[120px]">
                {renderFormattedText(medicineResponse)}
                {!typingComplete.medicine && (
                  <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>
          )}

          {/* Organic Remedies */}
          {organicResponse && (
            <div className="flex-1 min-w-[300px] max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Natural Remedies</h3>
              </div>
              <div className="leading-relaxed min-h-[120px]">
                {renderFormattedText(organicResponse)}
                {!typingComplete.organic && (
                  <span className="inline-block w-2 h-4 bg-yellow-500 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>
          )}

          {/* Nearby Hospitals */}
          {hospitalResponse && (
            <div className="flex-1 min-w-[300px] max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Nearby Hospitals</h3>
              </div>
              <div className="leading-relaxed min-h-[120px]">
                {renderFormattedText(hospitalResponse)}
                {!typingComplete.hospitals && (
                  <span className="inline-block w-2 h-4 bg-red-500 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step3