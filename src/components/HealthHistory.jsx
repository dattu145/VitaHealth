// src/components/HealthHistory.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const HealthHistory = () => {
  const [healthRecords, setHealthRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const { getHealthRecords, deleteHealthRecord } = useAuth()

  useEffect(() => {
    loadHealthRecords()
  }, [])

  const loadHealthRecords = async () => {
    try {
      const { data, error } = await getHealthRecords()
      
      if (error) throw error
      setHealthRecords(data || [])
    } catch (error) {
      console.error('Error loading health records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this health record?')) {
      return
    }

    try {
      const { error } = await deleteHealthRecord(recordId)
      
      if (error) throw error
      
      // Remove from local state
      setHealthRecords(prev => prev.filter(record => record.id !== recordId))
      if (selectedRecord?.id === recordId) {
        setSelectedRecord(null)
      }
    } catch (error) {
      console.error('Error deleting health record:', error)
      alert('Failed to delete health record. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBmiColor = (bmi) => {
    if (!bmi) return 'text-gray-600'
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return 'text-yellow-600'
    if (bmiValue < 24.9) return 'text-green-600'
    if (bmiValue < 29.9) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Health History</h2>
        <p className="text-gray-600">Your previous health analysis records</p>
      </div>

      {healthRecords.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Health Records Yet</h3>
          <p className="text-gray-600">Your health analysis records will appear here after you generate insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Records</h3>
            {healthRecords.map((record) => (
              <div
                key={record.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedRecord?.id === record.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {record.symptoms?.substring(0, 50)}...
                    </h4>
                    <p className="text-sm text-gray-500">{formatDate(record.created_at)}</p>
                  </div>
                  <div className={`text-sm font-semibold ${getBmiColor(record.bmi)}`}>
                    BMI: {record.bmi}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {record.bmi_category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRecord(record.id)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Record Details */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Analysis</h3>
                    <p className="text-gray-500">{formatDate(selectedRecord.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getBmiColor(selectedRecord.bmi)}`}>
                      BMI: {selectedRecord.bmi}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {selectedRecord.bmi_category}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                      {selectedRecord.symptoms}
                    </p>
                  </div>

                  {/* Health Advice */}
                  {selectedRecord.ai_health_advice && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Health Response</h4>
                      <div className="text-gray-700 bg-blue-50 rounded-lg p-4 whitespace-pre-line">
                        {selectedRecord.ai_health_advice}
                      </div>
                    </div>
                  )}

                  {/* Medicine Suggestions */}
                  {selectedRecord.medicine_suggestions && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Medicine Suggestions</h4>
                      <div className="text-gray-700 bg-green-50 rounded-lg p-4 whitespace-pre-line">
                        {selectedRecord.medicine_suggestions}
                      </div>
                    </div>
                  )}

                  {/* Organic Remedies */}
                  {selectedRecord.organic_remedies && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Natural Remedies</h4>
                      <div className="text-gray-700 bg-yellow-50 rounded-lg p-4 whitespace-pre-line">
                        {selectedRecord.organic_remedies}
                      </div>
                    </div>
                  )}

                  {/* Nearby Hospitals */}
                  {selectedRecord.nearby_hospitals && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Nearby Hospitals</h4>
                      <div className="text-gray-700 bg-red-50 rounded-lg p-4 whitespace-pre-line">
                        {selectedRecord.nearby_hospitals}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {selectedRecord.location && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                      <p className="text-gray-700">{selectedRecord.location}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Record</h3>
                <p className="text-gray-600">Choose a health record from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthHistory