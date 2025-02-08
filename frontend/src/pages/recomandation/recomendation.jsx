import React, { useEffect, useState } from 'react'
import { HfInference } from "@huggingface/inference";
import Loader from '../../components/loader/loader.jsx';
import Navbar from '../../components/navbar/navbar.jsx';
import { ToastContainer , toast } from 'react-toastify';

const Recomendation = (props) => {

  const dataLen = Object.keys(props.dataObj).length
  const [recomendation, setrecomendation] = useState("")
  const [isdone, setisdone] = useState(-1)

  const getRecomendation = async () => {

    try {
      const inputObject = JSON.stringify(props.dataObj)
      const client = new HfInference(`${import.meta.env.VITE_REACT_HUGGING_FACE_API_KEY}`);
      const chatCompletion = await client.chatCompletion({
        model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
        messages: [
          {
            role: "developer",
            content: dataLen !== 15 ? "You are a excelent eye expert . Your job is to give recomendation pointwise how to improve eye sight and what are the things to avoid" :
              "You are a excelent eye expert . Your job is to give recomendation pointwise to maintain eyesight based on user given data object"
          },
          {
            role: "user",
            content: dataLen !== 15 ? "give me some recomendation to improve eye sight and what are the things which i must avoid to imporv eye sight" :
              `give me some recomendation how to maintain eyesight based on given data. Below there is my input data object \n ${inputObject}`
          }
        ],
        max_tokens: 1000
      });
      setrecomendation(chatCompletion.choices[0].message.content)
      setisdone(1)
    } catch (error) {
      setrecomendation("")
      setisdone(0)
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }

  }

  const organizeResponse = (response) => {

    console.log(response)
    const lines = response.split("\n");
    // console.log(lines)

    return lines.map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        // Section header
        return (
          <h4 key={index} className="section-header text-4xl underline-offset-8 lora underline py-4 font-semibold text-blue-900">
            {line.replace(/\*\*/g, "")}
          </h4>
        );
      }

      if (line.match(/\*\*(.*?)\*\*: (.*)/)) {
        // Line with a heading and description
        const match = line.match(/\*\*(.*?)\*\*: (.*)/);
        const heading = match[1];
        const description = match[2];

        return (
          <p key={index} className="recommendation py-2 relative px-4">
            <div className=' absolute top-5 left-0  inline-block w-2.5 h-2.5 rounded-full bg-black'></div>
            <span className="recommendation-heading text-xl font-bold">{heading}:</span>{" "}
            <span className="recommendation-description">{description}</span>
          </p>
        );
      }

      if (line.trim() === "") {
        // Skip empty lines
        return null;
      }

      // Default case for normal lines
      return (
        <p key={index} className="normal-line lora text-xl font-light text-red-800 py-8">
          {line}
        </p>
      );
    });
  }

  useEffect(() => {
    getRecomendation()
  }, [])


  return (

    <div id='recomendation' className=' min-h-screen w-full py-6 flex justify-center items-center'
      style={{ backgroundImage: "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)" }}>
      <Navbar />
      <ToastContainer/>
      {isdone === -1 && <Loader />}

      {
        isdone === 1 && recomendation !== "" &&
        <div className=' pt-[100px] md:w-10/12 w-full px-6' >
          {organizeResponse(recomendation)}
        </div>
      }
    </div>


  )
}

export default Recomendation