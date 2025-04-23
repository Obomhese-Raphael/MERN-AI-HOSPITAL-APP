import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Log to console
    console.log('Newsletter subscription submitted with email:', email);
    
    // Simulate API call delay
    setTimeout(() => {
      setMessage(`Thank you for subscribing with ${email}! Stay informed about AI-powered health insights.`);
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-blue-50 py-12 px-4 mt-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Stay Informed with AI Health Insights</h2>
        <p className="text-gray-700 mb-6">
          Unlock the future of healthcare! Subscribe to receive updates on our AI-driven features, personalized health tips, and the latest advancements in our E-Hospital App.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="border border-blue-300 rounded-md py-2 px-4 mb-4 sm:mb-0 sm:mr-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition ${
              isSubmitting ? 'opacity-75' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Newsletter;