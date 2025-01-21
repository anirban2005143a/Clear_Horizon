import React, { useState } from 'react'
import Navbar from '../../components/navbar/navbar.jsx'
import { ToastContainer, toast } from 'react-toastify'

const Feedback = () => {

  const [message, setmessage] = useState("")
  const [isProgress, setisProgress] = useState(false)

  const sendFeedback = async () => {
    try {
      setisProgress(true)
      const res = await fetch(`${import.meta.env.VITE_REACT_NODE_URL}/api/v1/feedback/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "feedback": message
        })
      })
      const data = await res.json()
      // console.log(data);
      setisProgress(false)
      data.error ? showToast(data.message, 1) : showToast(data.message, 0)
    } catch (error) {
      setisProgress(false)
      console.log(error)
      showToast(error.message, 1)
    }

  }

  const showToast = (str, e) => {
    e === 1 ? toast.error(str, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    }) :
      toast.success(str, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
  }

  return (
    <div>
      <ToastContainer />
      <div className="relative flex flex-col items-center justify-center min-h-screen text-white py-10"
        style={{ backgroundImage: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }}>
          <Navbar/>
        <div className="relative text-black z-10 max-w-2xl mt-[50px] p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
          <p className="text-center mb-8">
            We'd love to hear from you! Whether you have a question about our
            platform, a suggestion, or need assistance, feel free to reach out.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault()
            sendFeedback()
          }} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                required
                id="message"
                rows="4"
                value={message}
                onChange={e => setmessage(e.target.value)}
                className="w-full p-2 mt-1 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message"
              />
            </div>

            <div className="flex justify-center">
              {!isProgress && <button
                type="submit"
                disabled={isProgress}
                className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Message
              </button>}
              {isProgress &&
                < div className="flex flex-row gap-2 py-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:-.5s]"></div>
                </div>}
            </div>
          </form>
        </div>
      </div >
    </div >
  );
}

export default Feedback