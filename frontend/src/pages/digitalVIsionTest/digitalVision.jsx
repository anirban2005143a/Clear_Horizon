import Navbar from "../../components/navbar/navbar.jsx";
import React, { useEffect, useRef, useState } from "react";
import snellenLetterChart from "../../json/letterSize.json"
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SnellenChart = (props) => {
    const chart = snellenLetterChart.snellenChart
    const [count, setcount] = useState(0)
    const [result, setresult] = useState(20 / 300)
    // const [fireWorkInstace, setfireWorkInstace] = useState(null)
    const letterRef = useRef(null)

    const navigate = useNavigate()

    const NextLetter = () => {
        //save marks
        const input = document.querySelector("input#filled-basic").value
        if (input.toUpperCase().replace(/\s+/g, '') === chart[count].letters.replace(/\s+/g, '')) {
            setresult(chart[count].marks)
        }
        if (letterRef.current) {
            setcount(count + 1);
        }
        document.querySelector("input#filled-basic").value = ""
    }

    const submit = () => {
        const input = document.querySelector("input#filled-basic").value
        let lastres = result
        if (input.toUpperCase().replace(/\s+/g, '') === chart[count].letters.replace(/\s+/g, '')) {
            lastres = chart[count].marks
        }
        const obj = props.dataObj
        obj["Snellen Chart"] = lastres
        // console.log(obj)
        props.setdataObj(obj)
        navigate("/astigmatism/test")
    }

    // console.log(result)

    return (
        <div id="snellen" className="  min-h-screen" style={{backgroundImage: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)"}}>
            <Navbar />
            <div className=" pt-[100px] flex flex-col items-center justify-center pb-4">
                <h4 className="md:w-8/12 sm:w-10/12 w-full px-6 font-serif font-light text-blue-800 text-4xl text-center">
                    Simulated Snellen Chart
                </h4>
                <p className=" text-sm font-base text-red-700">
                    Sit 2–4 feet (60–120 cm) away from the screen for an accurate test
                </p>
            </div>

            {/* text shown  */}
            <div className="visualText flex justify-center p-4">
                <div ref={letterRef} id="testLetter" className="user-select-none md:w-7/12 sm:w-10/12 w-full p-10 border-dotted m-4 bg-[#C4D9FF] shadow-xl rounded-xl text-center" style={{ fontSize: `${chart[count].baseSize * window.devicePixelRatio}px` }}>
                    {`${chart[count].letters}`}
                </div>
            </div>

            {/* input box  */}
            <div className=" flex justify-center p-6">
                <TextField required id="filled-basic" label="Enter " variant="filled" autoComplete="off" />
            </div>

            <div className=" buttons flex justify-center gap-5 items-center">
                {/* next button  */}
                {count > 0 && <div className="nextButton flex justify-center py-10">
                    <button onClick={() => {
                        setcount(count - 1)
                    }} className=" bg-blue-200 cursor-pointer uppercase rounded-xl rounded-bl-none  px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.2rem_0.2rem_#F44336,-0.3rem_-0.3rem_#00BCD4] transition">
                        Back
                    </button>
                </div>}

                {/* submit button  */}
                {count === chart.length - 1 &&
                    <div className=" submit flex justify-center py-10">
                        <button
                            onClick={() => {
                                submit()
                            }}
                            className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
                        >
                            Astigmatism test
                        </button>
                    </div>
                }

                {/* back button  */}
                {count < chart.length - 1 &&
                    <div className="nextButton flex justify-center py-10">
                        <button onClick={() => {
                            NextLetter()
                        }} className=" bg-blue-200 cursor-pointer uppercase  rounded-xl rounded-br-none px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.2rem_0.2rem_#F44336,-0.3rem_-0.3rem_#00BCD4] transition">
                            Next
                        </button>
                    </div>}
            </div>


        </div>
    );
};

export default SnellenChart;
