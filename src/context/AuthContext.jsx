// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

// Create context without default values
const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener')
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    setAuthLoading(true)
    try {
      console.log('Signing up:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setAuthLoading(true)
    try {
      console.log('Signing in:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Signout error:', error)
      return { error }
    }
  }

  // Health Records Functions
  const saveHealthRecord = async (healthData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          bmi: healthData.bmi,
          bmi_category: healthData.bmiCategory,
          symptoms: healthData.symptoms,
          ai_health_advice: healthData.aiHealthAdvice,
          medicine_suggestions: healthData.medicineSuggestions,
          organic_remedies: healthData.organicRemedies,
          nearby_hospitals: healthData.nearbyHospitals,
          location: healthData.location
        })
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error saving health record:', error)
      return { data: null, error }
    }
  }

  const getHealthRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching health records:', error)
      return { data: null, error }
    }
  }

  const deleteHealthRecord = async (recordId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user.id)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error deleting health record:', error)
      return { data: null, error }
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    saveHealthRecord,
    getHealthRecords,
    deleteHealthRecord,
    loading: loading || authLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}