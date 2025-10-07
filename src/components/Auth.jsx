// src/components/Auth.jsx
import React, { useState } from 'react'
import Login from './pages/auth/LoginPage'
import Signup from './pages/auth/SignupPage'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleAuth = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div>
      {isLogin ? (
        <Login onToggleAuth={toggleAuth} />
      ) : (
        <Signup onToggleAuth={toggleAuth} />
      )}
    </div>
  )
}

export default Auth