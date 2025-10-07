// src/components/pages/auth/LoginPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const result = await signIn(email, password)
      console.log('Login result:', result) // Debug log
      
      if (result.error) {
        // Handle specific authentication errors
        const errorMsg = result.error.message || result.error.toString()
        
        if (errorMsg.includes('Invalid login credentials') || 
            errorMsg.includes('invalid_credentials') ||
            errorMsg.includes('Email or password incorrect')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (errorMsg.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in.')
        } else if (errorMsg.includes('Too many requests')) {
          setError('Too many login attempts. Please try again in a few minutes.')
        } else if (errorMsg.includes('User not found')) {
          setError('No account found with this email address. Please sign up first.')
        } else {
          setError(errorMsg || 'Failed to login. Please try again.')
        }
      } else {
        // Successful login - navigation will be handled by AuthContext state change
        console.log('Login successful, waiting for auth state change...')
      }
    } catch (err) {
      console.error('Login error:', err)
      // Handle network errors or unexpected issues
      if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your internet connection and try again.')
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) setError('')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://media.istockphoto.com/id/1221256351/photo/mother-and-daughter-doing-yoga.jpg?s=612x612&w=0&k=20&c=OnaMkUiaKJNBoSKVsILCwoibKbPiSn8j6T6dylwy7xU=")',
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
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to your VitaHealth account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                className={`w-full outline-none px-4 py-3 border rounded-xl bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className={`w-full outline-none px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-in fade-in-50">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-red-800 block mb-1">
                      {error.includes('Invalid email or password') ? 'Authentication Failed' : 
                       error.includes('verify your email') ? 'Email Verification Required' :
                       error.includes('network') ? 'Connection Issue' : 'Login Error'}
                    </span>
                    <span className="text-sm text-red-700">{error}</span>
                    {error.includes('No account found') && (
                      <div className="mt-2 text-xs text-red-600">
                        <p>Don't have an account? <Link to="/signup" className="underline hover:text-red-800">Sign up here</Link></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Debug info (remove in production) */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <strong>Note:</strong> Enter wrong credentials to test error messages
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage