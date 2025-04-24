import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL_DEV}/api/newsletter`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 
        'Failed to subscribe. Please try again later.'
      );
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 py-12 px-4 mt-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Subscribe to our weekly Newsletter</h2>
        <p className="text-gray-700 mb-6">
          Subscribe to receive updates on our AI-driven healthcare features.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="border border-blue-300 rounded-md py-2 px-4 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${
            message.includes('Success') || message.includes('Thank') 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Newsletter;