import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div>
        <div className='flex flex-col sm:flex-row border border-gray-400 h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden mt-10'>
      {/* Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="text-[#414141] space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2">
                <p className='w-8 h-[2px] bg-[#414141]'></p>
                <p className='font-medium text-xs sm:text-sm'>
                  TELECARE HUB       
                </p>
            </div>
            <h1 className='prata-regular text-2xl sm:text-3xl md:text-4xl leading-tight'>
                Your Health, Anywhere, Anytime.
            </h1>
            <div className="flex items-center gap-2">
                <Link to={"/services"} className="border font-semibold rounded-full px-2 py-2 text-xs sm:text-sm">CALL NOW</Link>
                <p className="w-8 h-[2px] bg-[#414141]"></p>
            </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="w-full sm:w-1/2 h-full">
        {/* <img src={assets.hero_img} alt="" /> */}
        <img src={assets.aiDoctor3} alt="" />
      </div>
    </div>
    </div>
  )
}

export default Hero