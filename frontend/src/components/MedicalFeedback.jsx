import React from 'react';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const MedicalFeedback = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const feedback = state?.feedbackData || {
    symptoms: '',
    issue: '',
    timeOfInjury: '',
    prescribedSolution: '',
    followUpRecommendation: '',
    overallAssessment: 0,
    date: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">MediCare AI</h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-center mb-2">Medical Consultation Report</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Consultation Date: {new Date(feedback.date).toLocaleDateString()}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Assessment: {feedback.overallAssessment}/100
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">SYMPTOMS:</h3>
              <p className="text-gray-700">{feedback.symptoms}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">PRIMARY ISSUE:</h3>
              <p className="text-gray-700">{feedback.issue}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">TIME OF ONSET/INJURY:</h3>
              <p className="text-gray-700">{feedback.timeOfInjury || "Not specified"}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">PRESCRIBED SOLUTION:</h3>
              <p className="text-gray-700">{feedback.prescribedSolution}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">FOLLOW-UP RECOMMENDATION:</h3>
              <p className="text-gray-700">{feedback.followUpRecommendation}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ADDITIONAL NOTES:</h3>
              <p className="text-gray-700">
                This AI-generated report is for informational purposes only and should not replace 
                professional medical advice. If symptoms persist or worsen, please consult a 
                healthcare professional.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <FaCheckCircle className="text-lg" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalFeedback;