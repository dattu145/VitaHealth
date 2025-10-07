// src/components/pages/auth/AuthCallback.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../services/supabase'

const AuthCallback = () => {
  const [status, setStatus] = useState('processing')
  const [message, setMessage] = useState('Verifying your email...')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash which contains the access token
        const hash = window.location.hash
        if (!hash) {
          throw new Error('No authentication data found')
        }

        // Parse the hash to get the token
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        console.log('Auth callback - Type:', type, 'Token present:', !!accessToken)

        if (accessToken && refreshToken) {
          // Set the session using the tokens from the URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            throw error
          }

          // Wait a moment for the session to be properly established
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Get the current session to verify it's set correctly
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            throw sessionError
          }

          if (!session) {
            throw new Error('Session not established properly')
          }

          console.log('Session established successfully:', session.user.email)

          // Success - email verified and user signed in
          setStatus('success')
          setMessage(`Welcome! Email verified successfully. Redirecting to dashboard...`)

          // Clear the URL hash to remove tokens from address bar
          window.location.hash = ''

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true })
          }, 2000)
        } else {
          throw new Error('Invalid authentication data')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        
        // More user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          setMessage('Invalid verification link. Please try signing up again.')
        } else if (error.message.includes('Email not confirmed')) {
          setMessage('Email verification failed. Please try the verification link again.')
        } else if (error.message.includes('User not found')) {
          setMessage('Account not found. Please sign up again.')
        } else {
          setMessage('Failed to verify email. Please try again or contact support.')
        }

        // Clear the URL hash on error too
        window.location.hash = ''

        // Redirect to login after error with longer delay
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 5000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        // backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundAttachment: 'fixed',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-300 text-center">
          {/* Loading Spinner */}
          {status === 'processing' && (
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            </div>
          )}

          {/* Success Icon */}
          {status === 'success' && (
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Error Icon */}
          {status === 'error' && (
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {status === 'processing' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>

          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Additional info for success */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-green-700 space-y-2">
                <p className="font-semibold">🎉 Welcome to VitaHealth!</p>
                <p>Your email has been successfully verified. You'll be automatically redirected to your dashboard.</p>
              </div>
            </div>
          )}

          {/* Additional info for error */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-red-700 space-y-2">
                <p className="font-semibold">⚠️ Verification Issue</p>
                <p>We encountered an issue verifying your email. This might be because:</p>
                <ul className="text-left list-disc list-inside space-y-1 mt-2">
                  <li>The verification link has expired</li>
                  <li>The link was already used</li>
                  <li>There was a temporary server issue</li>
                </ul>
              </div>
            </div>
          )}

          {/* Progress bar for processing state */}
          {status === 'processing' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Manual navigation links */}
          <div className="space-y-3">
            {status === 'error' && (
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200"
              >
                Try Sign Up Again
              </button>
            )}
            
            {status === 'error' && (
              <button
                onClick={() => navigate('/login')}
                className="w-full border-2 border-blue-600 text-blue-600 font-medium py-2 px-4 rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                Go to Login
              </button>
            )}

            {(status === 'success' || status === 'processing') && (
              <button
                onClick={() => navigate('/')}
                className="w-full border-2 border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Back to Home
              </button>
            )}
          </div>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-500">
              <p>Hash: {window.location.hash.substring(0, 50)}...</p>
              <p>Status: {status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthCallback