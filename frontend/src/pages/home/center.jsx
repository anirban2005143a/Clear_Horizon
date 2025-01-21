import React, { useEffect, useRef } from 'react'
import GetstartedBTN from './getstartedBTN.jsx'
import gsap from '../../utiles/gsap.js'

const Center = () => {

  const centerRef = useRef(null)

  useEffect(() => {
    if (centerRef.current) {
      gsap.HomeCenter(centerRef.current)
    }
  }, [centerRef.current])

  return (
    <div ref={centerRef} id="center" className=' md:w-7/12 sm:w-10/12 w-full flex flex-col justify-center items-start px-5 py-8 '>

      <div><h2 className='playfair-display text-white font-semibold text-[5rem] py-2'>CLEAR</h2></div>
      <div><h2 className='playfair-display text-white font-semibold text-[3rem] py-2 '>HORIZON</h2></div>
      <div>
        <p className=' text-white text-lg text-[1rem] font-light py-4 pe-7'>
          Concerned about myopia? Our quick and accurate test helps you assess your vision and identify early signs of nearsightedness.
          Get personalized insights, practical recommendations, and expert tips to protect and enhance your eye health.
          Take control of your vision today.
        </p>
      </div>
      <div className="button my-4">
        <GetstartedBTN />
      </div>

    </div>
  )
}

export default Center