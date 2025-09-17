import { BACKEND_URL } from '@/lib/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[name,setName] = useState('');
   
   const handleSubmit = async() => {
      console.log(email,password,name);
      const response = await axios.post(`${BACKEND_URL}/user/signup`,{
        email,
        password,   
        name
      })
      console.log(response.data);
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Header/Logo area */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">n8n</span>
          </div>
          <span className="text-gray-700 font-medium">Workflow Automation</span>
        </div>
      </div>

      {/* Main signup card */}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 text-sm">Start automating your workflows today</p>
        </div>

        <div className="space-y-6">
            {/* name field */}
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Username
            </label>
            <input
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your username"
                required
            />
        </div>
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{' '}
                <span className="text-red-600 hover:text-red-700 cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-red-600 hover:text-red-700 cursor-pointer">Privacy Policy</span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            onClick={handleSubmit}
          >
            Create account
          </button>
        </div>

        {/* Sign in link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <span className="text-red-600 hover:text-red-700 cursor-pointer font-medium">
             <a href="/signin">Sign in</a>
            </span>
          </p>
        </div>
        </div>

    </div>
  );
}
