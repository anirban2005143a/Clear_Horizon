import React, { useEffect, useRef } from 'react'
import gsap from '../../utiles/gsap.js'

const MousePointer = () => {

    const pointer = useRef(null)
    useEffect(() => {
        if (pointer.current) {
            window.addEventListener("mousemove", (e) => {
                gsap.MousePointer( pointer.current ,e.x, e.y)
            })
        }

    }, [pointer.current])


    return (
        <div ref={pointer} className='w-3 h-3 z-[55] rounded-full fixed  pointer-events-none' style={{backgroundImage: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)"}}></div>
    )
}

export default MousePointer