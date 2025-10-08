# VitaHealth - AI-Powered Health Assistant

VitaHealth is a modern, responsive web application that provides personalized health insights using AI. Get instant health recommendations, medicine suggestions, natural remedies, and nearby hospital information based on your symptoms.

![VitaHealth Dashboard](https://github.com/user-attachments/assets/aeda174f-4b27-4cd3-8629-d8d898837644)

## Features

### Core Features
- **AI Health Analysis** - Get personalized health recommendations using Google Gemini AI
- **Medicine Suggestions** - AI-powered medicine recommendations with dosage instructions
- **Natural Remedies** - Home-based organic treatment suggestions
- **Hospital Locator** - Find nearby hospitals with map integration
- **BMI Calculator** - Automatic BMI calculation with health insights
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Authentication & Security
- **Secure Signup/Login** - Powered by Supabase Auth
- **Email Verification** - Secure account verification system
- **Protected Routes** - Role-based access control
- **Data Privacy** - Individual user data isolation

### Health Tracking
- **Health Records** - Save and manage your health analysis history
- **Progress Tracking** - Monitor your health journey over time
- **Export Data** - Download your health records

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vitahealth.git
   cd vitahealth
   ```
   
Install dependencies

```bash
npm install
```

## Environment Setup
- Create a .env file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Database Setup
- Run this SQL in your Supabase SQL editor:

-- Health records table
```sql
create table public.health_records (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  bmi numeric(4, 1) null,
  bmi_category text null,
  symptoms text null,
  ai_health_advice text null,
  medicine_suggestions text null,
  organic_remedies text null,
  nearby_hospitals text null,
  location text null,
  created_at timestamp with time zone null default now(),
  constraint health_records_pkey primary key (id),
  constraint health_records_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
);
```

-- Enable RLS
```sql
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own health records" ON public.health_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own health records" ON public.health_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own health records" ON public.health_records FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health records" ON public.health_records FOR DELETE TO authenticated USING (auth.uid() = user_id);
```
## Start development server

```bash
npm run dev
```
## Open your browser
- Navigate to http://localhost:5173

🏗️ Project Structure
```text
vitahealth/
├── src/
│   ├── components/
│   │   ├── pages/auth/          # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── steps/               # Multi-step health analysis
│   │   │   ├── step1.jsx        # Basic info
│   │   │   ├── step2.jsx        # Physical measurements
│   │   │   └── step3.jsx        # AI health analysis
│   │   ├── Layout/
│   │   │   └── Header.jsx       # Navigation header
│   │   └── HealthHistory.jsx    # Health records management
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── services/
│   │   └── supabase.js          # Supabase client configuration
│   └── App.jsx                  # Main app component
├── public/                      # Static assets
└── package.json

```

# Technology Stack

### - Frontend
React 18 - Modern React with hooks

Vite - Fast build tool and dev server

Tailwind CSS - Utility-first CSS framework

React Router - Client-side routing


### - Backend & Services
Supabase - Backend-as-a-Service (Auth + Database)

Google Gemini AI - AI-powered health analysis

PostgreSQL - Database (via Supabase)


### - Deployment

Render - Frontend deployment

Supabase - Backend deployment

## 🎨 UI/UX Features

Modern Design - Clean, professional healthcare aesthetic

Dark/Light Mode - Built-in theme support

Responsive - Mobile-first design approach

Loading States - Smooth animations and loading indicators

Error Handling - User-friendly error messages

Accessibility - WCAG compliant components

## 🔐 API Integration

Google Gemini AI

```javascript

// Health analysis prompt example
const prompt = `
  Provide health recommendations for ${user.name}, 
  aged ${user.age}, based on symptoms: ${symptoms}
`;

```
## Supabase Services

Authentication - Email/password with verification

Database - Real-time health records storage

Storage - User data management

Row Level Security - Data protection

## Usage Guide

### 1. Account Creation
   
Sign up with email and password

Verify email through confirmation link

Complete your profile

### 2. Health Analysis
Step 1: Enter basic information (name, age, gender)

Step 2: Provide physical measurements (height, weight)

Step 3: Describe symptoms for AI analysis

### 3. Results & Insights

AI health recommendations

Medicine suggestions

Natural remedies

Nearby hospitals with maps

### 4. History Management

View past health records

Track health progress

Delete old records


## Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
```

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guide for details.

1). Development Setup

2). Fork the repository

3). Create a feature branch

4). Make your changes

5). Add tests if applicable

6). Submit a pull request



### Support
-  Email: dattavignesh001@gmail.com


<div align="center">
Built with ❤️ for better health outcomes
</div> ```
