import Navbar from "../../components/navbar/navbar";
import React, { useEffect, useRef, useState } from "react";
import blur from "../../json/blurTest.json"
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BlurText = (props) => {

    const [count, setcount] = useState(0)
    const [result, setresult] = useState(0)
    const letterRef = useRef(null)

    const navigate = useNavigate()

    const NextLetter = () => {
        const input = document.querySelector("input#filled-basic").value
        // console.log(blur.words[count].word.replace(/\s+/g, ''))
        if (input.toUpperCase().replace(/\s+/g, '') === blur.words[count].word.toUpperCase().replace(/\s+/g, '')) {
            setresult(blur.words[count].blurValue)
        }
        if (letterRef.current) {
            setcount(count + 1);
        }
        document.querySelector("input#filled-basic").value = ""
    }

    const submit = () => {
        const input = document.querySelector("input#filled-basic").value
        let lastRes = result;
        if (input.toUpperCase().replace(/\s+/g, '') === blur.words[count].word.replace(/\s+/g, '')) {
            lastRes = blur.words[count].blurValue / 100
        }

        const obj = props.dataObj
        obj["Blur Sensitivity"] = lastRes
        // console.log(obj)
        props.setdataObj(obj)
        navigate("/LifeStyle")
    }

    // console.log(result)

    return (
        <div id="snellen" className=" bg-[#E8F9FF] min-h-screen" style={{backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"}}>
            <Navbar />
            <div className=" pt-[100px] flex flex-col items-center justify-center pb-4">
                <h4 className="md:w-8/12 sm:w-10/12 w-full px-6 font-serif font-light text-blue-800 text-4xl text-center">
                    Blur Sensitivity Test
                </h4>
                <p className=" text-sm font-base text-red-700">
                    To ensure accurate results, please maintain 20–28 inches yourself at the appropriate distance from your screen
                </p>
            </div>

            {/* text shown  */}
            <div className="visualText flex justify-center p-4 ">
                <div ref={letterRef} id="testLetter" className="user-select-none text-5xl md:w-7/12 sm:w-10/12 w-full p-10 border-dotted m-4 bg-[#C4D9FF] shadow-xl rounded-xl text-center" style={{ filter: `blur(${(blur.words[count].blurValue / 20)}px)` }}>
                    {`${blur.words[count].word}`}
                </div>
            </div>

            {/* input box  */}
            <div className=" flex justify-center p-6">
                <TextField required id="filled-basic" label="Enter" variant="filled" autoComplete="off" />
            </div>

            <div className="buttons flex justify-center w-full gap-5">

                {/* back button  */}
                {count > 0 &&
                    <div className="nextButton flex justify-center py-10">
                        <button onClick={() => {
                            setcount(count - 1)
                        }} className=" bg-blue-200 cursor-pointer uppercase  rounded-xl rounded-bl-none px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.2rem_0.2rem_#F44336,-0.3rem_-0.3rem_#00BCD4] transition">
                            Back
                        </button>
                    </div>}

                {/* next button  */}
                {count < blur.words.length - 1 &&
                    <div className="nextButton flex justify-center py-10">
                        <button onClick={() => {
                            NextLetter()
                        }} className=" bg-blue-200 cursor-pointer uppercase rounded-xl rounded-br-none  px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.2rem_0.2rem_#F44336,-0.2rem_-0.2rem_#00BCD4] transition">
                            Next
                        </button>
                    </div>}

                {/* submit btn  */}
                {count === blur.words.length - 1 &&
                    <div className=" submit flex justify-center py-10">
                        <button
                            onClick={() => {
                                submit()
                            }}
                            className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
                        >
                            View Result
                        </button>
                    </div>
                }
            </div>



        </div>
    );
};

export default BlurText;
