import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import logo from "../../assets/logo.png"
import gsap from '../../utiles/gsap.js'

const Navbar = () => {

  const navbarref = useRef(null)

  useEffect(() => {
    if (navbarref.current && window.location.pathname === "/") {
      // gsap.navBarElem(navbarref.current.getElementsByClassName("navbarElem"))
    }
  }, [navbarref.current])


  return (
    <nav id='navbar' ref={navbarref} className=' z-50 fixed top-0 left-0 w-full flex justify-between items-center p-3'>

      <Link to="/" className='logo w-16 navbarElem  '>
        <img src={logo} className='w-14'/>
      </Link>
      <div className={` flex justify-center items-center ${window.location.pathname==="/" ? "text-orange-100" : "text-black"}`}>
        <Link to="/" className="navbarElem hover:underline hover:underline-offset-8 startTest mx-4 text-lg cursor-pointer font-normal">Home</Link>
        <Link to="/digital/vision/test" className="navbarElem hover:underline hover:underline-offset-8 startTest mx-4 text-lg cursor-pointer font-normal">Start Test</Link>
        <Link to="/recomendation" className="navbarElem hover:underline hover:underline-offset-8 Recomendation mx-4 text-lg cursor-pointer font-normal">Ai Recomendation</Link>
        <Link to="/feedback" className="navbarElem hover:underline hover:underline-offset-8 feedback mx-4 text-lg cursor-pointer font-normal">Feedback</Link>
      </div>
    </nav>
  )
}

export default Navbar