import React, { useEffect, useRef } from 'react'
import gsap from '../../utiles/gsap.js'

const Features = () => {

    const feature1 = useRef(null)
    const feature2 = useRef(null)
    const feature3 = useRef(null)

    useEffect(() => {
        if (feature1.current) {
            gsap.Feature1(feature1.current)
        }
    }, [feature1.current])

    useEffect(() => {
        if (feature2.current) {
            gsap.Feature2(feature2.current)
        }
    }, [feature2.current])

    useEffect(() => {
        if (feature3.current) {
            gsap.Feature3(feature3.current)
        }
    }, [feature3.current])


    return (
        <div id="features" className="relative w-[100vw] flex justify-center mt-10 py-10">
            <div className=" absolute top-[50px] h-full w-1 border-[2px] "></div>
            <div className=" top-0 left-0 w-full h-full">
                <div className="feature1 py-20 px-3 w-full flex items-center justify-between">
                    <p className=" lora w-1/2 flex flex-col items-center text-orange-200 text-7xl font-extralight px-6">
                        <div className=' -translate-x-20'>Simulated</div>
                        <div className=" translate-x-10">Snellen</div>
                        <div className=' -translate-x-24'>chart</div>
                    </p>
                    <p ref={feature1} className=" w-1/2 text-xl text-white font-light px-7">
                        Measure your visual sharpness with our quick and reliable Snellen Test. Determine how well you see at different distances and identify any potential vision issues.
                        Take the first step to understanding your visual clarity and get personalized recommendations for better eye health.
                    </p>
                </div>

                <div className="feature2 py-20 px-3 w-full flex items-center justify-between">
                    <p ref={feature2} className="text-xl w-1/2 text-end text-white font-light px-7">
                        Wondering if astigmatism is affecting your vision? Our specialized test helps detect irregularities in the curvature of your eye that may be causing blurred or distorted vision.
                        Receive expert tips and insights to manage and correct astigmatism effectively.
                    </p>
                    <p className=" lora w-1/2  text-orange-200 text-7xl font-extralight px-6">
                        <div className='text-center -translate-x-8'>Astigmatism  </div>
                        <div className="text-center translate-x-28">Grid</div>
                        <div className='text-center -translate-x-8'>Test</div>
                    </p>
                </div>

                <div className="feature3 py-20 px-3 w-full flex items-center justify-between">
                    <p className=" lora w-1/2 text-orange-200 text-7xl font-extralight px-6">
                        <div className=' text-center -translate-x-32'>Blur </div>
                        <div className=' text-center translate-x-7'>Sensitivity</div>
                        <div className=' text-center -translate-x-32'>Test</div>
                    </p>
                    <p ref={feature3} className="text-xl w-1/2  text-white font-light px-7">
                        Experiencing blurred vision? The Blur Test identifies potential causes, including myopia or other refractive errors, and provides insights into how you can restore clear vision.
                        Discover simple steps to improve your eye health and maintain sharper sight.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Features