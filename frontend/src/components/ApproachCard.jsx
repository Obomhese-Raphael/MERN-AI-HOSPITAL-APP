import React from 'react'

const ApproachCard = ({ icon, title, description }) => {
  return (
    <div>
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300 h-full">
    <div className="flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
    </div>
  )
}

export default ApproachCard