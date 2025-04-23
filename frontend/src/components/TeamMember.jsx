import React from 'react'
import { FaUserMd } from 'react-icons/fa'

const TeamMember = ({ name, role, bio, specialty }) => {
  return (
    <div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
        <FaUserMd className="text-xl" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-blue-600 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 mb-3">{bio}</p>
    <div className="bg-blue-50 px-3 py-1 rounded-full inline-block">
      <span className="text-blue-600 text-sm font-medium">{specialty}</span>
    </div>
  </div>
    </div>
  )
}

export default TeamMember