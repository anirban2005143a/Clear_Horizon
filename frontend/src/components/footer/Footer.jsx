import React from 'react'
import logo from "../../assets/logo.png"
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div id='footer' className=' pt-10 mt-5'>
            <footer className="bg-[#2E073F] text-center text-lg-start text-white py-4" >
                <div className="container p-4">
                    <div className=" flex justify-between">
                        <div className=" flex flex-col items-center mb-4 mb-md-0">

                            <div className="rounded-circle overflow-hidden shadow-1-strong d-flex align-items-center justify-content-center mb-4 mx-auto w-[150px] h-[150px] " >
                                <img src={logo} className='w-full h-full object-cover' alt=""
                                    loading="lazy" />
                            </div>

                            <p className="text-center raleway font-light text-2xl">
                                Clear Horizon
                            </p>

                        </div>

                        <div className=" flex flex-col items-center mb-4 mb-md-0">
                            <h5 className="text-uppercase mb-4  font-semibold text-center">Tests</h5>

                            <ul className="list-unstyled text-center font-extralight">
                                <li className="mb-2">
                                    <Link to="/digital/vision/test" className="text-white">Simulated Snellen chart</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/digital/vision/test" className="text-white">Astigmatism Grid</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/digital/vision/test" className="text-white">Blur Sensitivity Test</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/digital/vision/test" className="text-white">Lifestyle Data Collection</Link>
                                </li>

                            </ul>
                        </div>

                        <div className=" flex flex-col items-center mb-4 mb-md-0">
                            <h5 className="text-uppercase mb-4 font-semibold text-center">Routes</h5>

                            <ul className="list-unstyled text-center font-extralight">
                                <li className=' py-2'>
                                    <Link to="/" className=' hover:underline '>Home</Link>
                                </li>
                                <li className=' py-2'>
                                    <Link to="/" className=' hover:underline '>About</Link>
                                </li>
                                <li className=' py-2'>
                                    <Link to="/feedback" className=' hover:underline '>Feedback</Link>                                    </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </footer>
        </div>

    )
}

export default Footer