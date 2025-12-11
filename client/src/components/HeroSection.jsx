import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Calendar1Icon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-start justify-center gap-4
    px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.jpg")] bg-cover
    bg-center h-screen '>
        <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20'/>

        <h1 className='text-5xl md:text-[70px] md:leading-18
        font-semibold max-w-110'>Avengers: <br/> Infinity War</h1>

        <div className='flex items-center gap-4 text-gray-300'>
            <span>Action | Adventure | Sci-Fi</span>
            <div className='flex items-center gap-1'>
                <Calendar1Icon className='w-4.5 h-4.5'/> 2018
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/> 2h 8min
            </div>
        </div>
        <p className='max-w-md text-gray-300'>
          Avengers: Infinity War follows the Avengers and their allies as they unite to stop Thanos,
           a powerful cosmic warlord determined to collect all six Infinity 
          Stones. With these stones, he aims to wipe out half of all life in the universe. 
          As battles rage across Earth and space, the heroes face their greatest threat 
          yet—one they may not be strong enough to defeat. The film builds intense
           suspense, emotional weight, and ends with a
           shocking twist that changes the Marvel universe forever.
        </p>
        <button onClick={() => {navigate('/movies')}}
          className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull
          transition rounded-full font-medium cursor-pointer'>
          Explore Movies
          <ArrowRight className='w-5 h-5'/>
        </button>
      
    </div>
  )
}

export default HeroSection
