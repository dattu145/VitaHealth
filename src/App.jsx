// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './components/pages/auth/LoginPage'
import SignupPage from './components/pages/auth/SignupPage'
import Dashboard from './components/Dashboard'
import './App.css'

// Separate component to handle auth-dependent routing
function AuthRoutes() {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('AuthRoutes - Loading:', loading, 'User:', user, 'Path:', location.pathname)

  // Show loading only on protected routes when authentication is in progress
  if (loading && location.pathname !== '/login' && location.pathname !== '/signup') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading VitaHealth...</h2>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/signup" 
        element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <AuthRoutes />
      </div>
    </Router>
  )
}

export default App