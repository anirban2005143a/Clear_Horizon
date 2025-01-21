import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar.jsx'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import testImg from "../../assets/astigmetism.png"
import rightEye from "../../assets/righteye.png"
import leftEye from "../../assets/lefteye.png"
import { useNavigate } from 'react-router-dom'

const Astigmatism = (props) => {

    const [count, setcount] = useState(0)

    const [value1, setvalue1] = useState(-1)
    const [value2, setvalue2] = useState(-1)

    const navigate = useNavigate()

    useEffect(() => {
        const btn = document.querySelector("#modalBtn")
        btn.click()

    }, [count])

    return (
        <>
            <div id='astigmatism' className=" min-h-screen" style={{backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"}}>
                <Navbar />

                {/* modal  */}
                <button type="button" id='modalBtn' className="btn btn-primary hidden" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                </button>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div id='modal-body' className="modal-body flex-col items-center flex justify-center">
                                <p className=' font-sans font-semibold text-2xl py-2 text-blue-800'>{`Close your ${count === 0 ? "left" : "right"} eye`}</p>
                                <img src={count === 0 ? rightEye : leftEye} className='h-10 p-2' />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Okay</button>

                            </div>
                        </div>
                    </div>
                </div>


                <div className=' pt-[100px] flex flex-col items-center justify-center pb-4'>
                    <h4 className="md:w-8/12 sm:w-10/12 w-full px-6 py-1 font-serif font-light text-blue-800 text-4xl text-center">
                        Astigmatism Test
                    </h4>
                    <p className=" text-sm font-light text-black md:w-10/12 sm:w-10/12 w-full px-8 text-center">
                        Astigmatism is caused due to the imperfect curvature of either the lens of your eye or the front surface of your eye. This common condition can result in blurriness, vision distortion and even poor near vision. Take the test to know if you have Astigmatism or not
                    </p>
                    <div className="questionp pt-4 text-center w-full">
                        Do you see any sharper or darker/bolder line in any of the sets below?
                    </div>
                    <p className='warning text-red-600 text-center mx-auto'></p>

                    {/* question ans  */}
                    <div className='answer py-2'>
                        {count === 0 && <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="Yes" onChange={(e) => {
                                    setvalue1(1)
                                }} control={<Radio />} label="Yes" />
                                <FormControlLabel onChange={() => {
                                    setvalue1(0)
                                }} value="No" control={<Radio />} label="No" />

                            </RadioGroup>
                        </FormControl>}
                        {count === 1 && <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="Yes" onChange={(e) => {
                                    setvalue2(1)
                                }} control={<Radio />} label="Yes" />
                                <FormControlLabel onChange={() => {
                                    setvalue2(0)
                                }} value="No" control={<Radio />} label="No" />

                            </RadioGroup>
                        </FormControl>}
                    </div>

                    {/* test img  */}
                    <div className='img w-full flex justify-center py-10'>
                        <img src={testImg} alt="testImg" className=' w-72' />
                    </div>

                    {/* next button  */}
                    {count === 0 && <div className=" submit w-full flex justify-center py-10">
                        <button
                            onClick={(e) => {
                                if (value1 === -1) {
                                    document.querySelector(".warning").innerHTML = "Please select one"
                                } else {
                                    document.querySelector(".warning").innerHTML = ""
                                    document.querySelectorAll(".PrivateSwitchBase-input")[0].checked = false
                                    document.querySelectorAll(".PrivateSwitchBase-input")[1].checked = false
                                    setcount(count + 1)
                                }
                            }}
                            className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
                        >
                            Next
                        </button>
                    </div>}

                    {/* next test  */}
                    {count === 1 && <div className=" submit w-full flex justify-center py-10">
                        <button
                            onClick={(e) => {
                                if (value2 === -1) {
                                    document.querySelector(".warning").innerHTML = "Please select one"
                                } else {
                                    const obj = props.dataObj
                                    obj["Astigmatism"] = value1 || value2
                                    // console.log(obj)
                                    props.setdataObj(obj)
                                    navigate("/blur/test")
                                }
                            }}
                            className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
                        >
                            Blur Sensitive Test
                        </button>
                    </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Astigmatism