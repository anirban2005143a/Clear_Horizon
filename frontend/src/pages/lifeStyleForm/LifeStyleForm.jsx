import React, { useState, useEffect, useRef } from 'react';
import { Clock, Activity, User, Users, Eye, Moon, Sun, Utensils, Scale, Book, AlignCenter } from 'lucide-react';
import Snowfall from 'react-snowfall'
import Fireworks from 'fireworks-js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../../components/navbar/navbar.jsx';

const LifestyleForm = (props) => {

  const navigate = useNavigate()
  const backgroundRef = useRef(null)
  const [prediction, setprediction] = useState(-1)
  const [fireworkInstance, setfireworkInstance] = useState(null)
  const [formData, setFormData] = useState({
    screenTime: '',
    outdoorActivity: '',
    posture: '',
    age: '',
    gender: '',
    ethnicity: '',
    parentalMyopia: '',
    sleepDuration: '',
    lightCondition: '',
    diet: '',
    bmi: '',
    readingDistance: ''
  });


  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(value => value !== '').length;
    return (filledFields / totalFields) * 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getprediction()
  };

  const SelectField = ({ icon: Icon, label, name, options, value, onChange }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-2 hover:border-blue-200 transition-colors">
      <div className="flex items-center gap-2 text-gray-700">
        <Icon size={18} />
        <label htmlFor={name} className="font-medium">{label}</label>
      </div>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const NumberField = ({ icon: Icon, label, name, min, max, step, value, onChange }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-2 hover:border-blue-200 transition-colors">
      <div className="flex items-center gap-2 text-gray-700">
        <Icon size={18} />
        <label htmlFor={name} className="font-medium">{label}</label>
      </div>
      <input
        type="number"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <div className="text-xs text-gray-500">
        Range: {min} - {max} {step && `(in steps of ${step})`}
      </div>
    </div>
  );

  const getprediction = async () => {
    const obj1 = props.dataObj
    // console.log(obj1)
    const obj = {
      "Snellen Chart": obj1["Snellen Chart"],
      "Astigmatism": obj1.Astigmatism,
      "Blur Sensitivity": 1 - obj1["Blur Sensitivity"],
      "Age": formData.age,
      "Gender": formData.gender,
      "Ethnicity": formData.ethnicity,
      "Parental Myopia": formData.parentalMyopia === "yes" ? true : false,
      "Screen Time": formData.screenTime,
      "Outdoor Activity": formData.outdoorActivity,
      "Posture": formData.posture,
      "Sleep Duration": formData.sleepDuration,
      "Lights": formData.lightCondition,
      "Diet": formData.diet,
      "BMI": formData.bmi,
      "Reading Distance": formData.readingDistance
    }
    console.log(obj)
    props.setdataObj(obj)

    const res = await fetch(`${import.meta.env.VITE_REACT_FLASK_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features: obj }), // Wrap in `features` key
    });
    console.log(res)
    const data = await res.json();
    console.log(data);

    if (data.error) {
      toast.error(data.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } else {
      setprediction(data.prediction)
    }
  }


  useEffect(() => {
    if (prediction !== -1) {
      const btn = document.querySelector("#lifeStyleForm #predictionModal")
      btn.click();

      if (prediction === 0) {
        const fireworks = new Fireworks(backgroundRef.current, {
          autoresize: true,
          opacity: 0.5,
          acceleration: 1.05,
          friction: 0.97,
          gravity: 1.5,
          particles: 170,
          traceLength: 3,
          traceSpeed: 10,
          explosion: 7,
          intensity: 30,
          flickering: 65.7,
          lineStyle: 'square',
          hue: {
            min: 0,
            max: 360
          },
          delay: {
            min: 30,
            max: 60
          },
          rocketsPoint: {
            min: 50,
            max: 50
          },
          lineWidth: {
            explosion: {
              min: 1,
              max: 3
            },
            trace: {
              min: 1,
              max: 2
            }
          },
          brightness: {
            min: 50,
            max: 80
          },
          decay: {
            min: 0.015,
            max: 0.03
          },
          mouse: {
            click: false,
            move: false,
            max: 1
          }
        })
        setfireworkInstance(fireworks)
        fireworks.start()
        document.querySelector("canvas").style.position = "fixed"
        document.querySelector("canvas").style.top = 0
        document.querySelector("canvas").style.left = 0
        document.querySelector("canvas").style.width = "100vw"
        document.querySelector("canvas").style.height = "100vh"
        document.querySelector("canvas").style.zIndex = "10"
      }
    }
  }, [prediction])


  return (
    <div id='lifeStyleForm' className="min-h-screen bg-gray-50 p-6" style={{ backgroundImage: " linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%)" }}>
      <ToastContainer/>
      <Navbar/>
      {/* modal  */}
      {window.location.pathname === "/LifeStyle" && <button id='predictionModal' type="button" className="btn btn-primary hidden" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>}

      {window.location.pathname === "/LifeStyle" && <div ref={backgroundRef} className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        {prediction === 1 &&
          <Snowfall
            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
            changeFrequency={200}
            color='#ffffff'
          />}
        <div className="modal-dialog z-20">
          <div className="modal-content"
            style={{
              backgroundImage: `${prediction === 0 ?
                "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" : "linear-gradient(to top, #ff0844 0%, #ffb199 100%)"}`
            }}>
            <div className="modal-header">
              <button onClick={() => {
                setTimeout(() => {
                  setprediction(-1)
                }, 200);
                if (fireworkInstance) {
                  fireworkInstance.stop(true)
                }
              }} type="button" id='close-modal' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h4 className=' text-2xl font-bold '>{prediction === 0 ? "🥳🥳 You don't have Myopia 🥳🥳" : "😕😕 You have myopia 😕😕"}</h4>
              <p className=''>
                <span className='text-sm font-normal'>🙂😇🙂 Check your</span>
                <span className={`font-bold text-2xl ${prediction === 0 ? " text-black " : " text-green-900 "} `} > AI </span>
                <span className='text-sm'>powered recomendation to
                  {prediction === 0 ? " maintain " : " improve "}your eyesight 🙂😇🙂
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                setTimeout(() => {
                  setprediction(-1)
                }, 200);

                if (fireworkInstance) {
                  fireworkInstance.stop(true)
                }
              }} type="button" className="btn btn-secondary" id="close-modal" data-bs-dismiss="modal">Close</button>
              <button onClick={(e) => {
                document.querySelector("#close-modal").click()
                navigate("/recomendation")
              }} type="button" className="btn btn-primary">Check</button>
            </div>
          </div>
        </div>
      </div>}

      <div className="max-w-4xl mx-auto  rounded-lg shadow-md mt-[100px] " style={{ backgroundImage: "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)" }}>
        <div className="text-center border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">Lifestyle Assessment Form</h1>
          <p className="text-gray-600 mt-2">Please complete all fields for accurate assessment</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{Math.round(calculateProgress())}% completed</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Activities Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Daily Activities</h3>
                <NumberField
                  icon={Clock}
                  label="Screen Time (hours)"
                  name="screenTime"
                  min={1}
                  max={12}
                  step={0.5}
                  value={formData.screenTime}
                  onChange={handleChange}
                />
                <NumberField
                  icon={Activity}
                  label="Outdoor Activity (hours)"
                  name="outdoorActivity"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={formData.outdoorActivity}
                  onChange={handleChange}
                />
                <SelectField
                  icon={AlignCenter}
                  label="Posture"
                  name="posture"
                  options={[
                    { value: 'Optimal', label: 'Optimal' },
                    { value: 'Suboptimal', label: 'Suboptimal' },
                    { value: 'Poor', label: 'Poor' }
                  ]}
                  value={formData.posture}
                  onChange={handleChange}
                />
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
                <NumberField
                  icon={User}
                  label="Age"
                  name="age"
                  min={5}
                  max={80}
                  value={formData.age}
                  onChange={handleChange}
                />
                <SelectField
                  icon={User}
                  label="Gender"
                  name="gender"
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={formData.gender}
                  onChange={handleChange}
                />
                <SelectField
                  icon={Users}
                  label="Ethnicity"
                  name="ethnicity"
                  options={[
                    { value: 'Asian', label: 'Asian' },
                    { value: 'Caucasian', label: 'Caucasian' },
                    { value: 'Hispanic', label: 'Hispanic' },
                    { value: 'African American', label: 'African American' }
                  ]}
                  value={formData.ethnicity}
                  onChange={handleChange}
                />
              </div>

              {/* Health Factors Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Health Factors</h3>
                <SelectField
                  icon={Eye}
                  label="Parental Myopia"
                  name="parentalMyopia"
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={formData.parentalMyopia}
                  onChange={handleChange}
                />
                <NumberField
                  icon={Moon}
                  label="Sleep Duration (hours)"
                  name="sleepDuration"
                  min={1}
                  max={10}
                  step={0.5}
                  value={formData.sleepDuration}
                  onChange={handleChange}
                />
                <SelectField
                  icon={Sun}
                  label="Light Condition"
                  name="lightCondition"
                  options={[
                    { value: 'Dim', label: 'Dim' },
                    { value: 'Bright', label: 'Bright' },
                    { value: 'Excessive Blue Light', label: 'Excessive Blue Light' }
                  ]}
                  value={formData.lightCondition}
                  onChange={handleChange}
                />
              </div>

              {/* Lifestyle Habits Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Lifestyle Habits</h3>
                <SelectField
                  icon={Utensils}
                  label="Diet"
                  name="diet"
                  options={[
                    { value: 'Poor', label: 'Poor' },
                    { value: 'Healthy', label: 'Healthy' }
                  ]}
                  value={formData.diet}
                  onChange={handleChange}
                />
                <SelectField
                  icon={Scale}
                  label="BMI"
                  name="bmi"
                  options={[
                    { value: 'Obese', label: 'Obese' },
                    { value: 'Normal', label: 'Normal' }
                  ]}
                  value={formData.bmi}
                  onChange={handleChange}
                />
                <SelectField
                  icon={Book}
                  label="Reading Distance"
                  name="readingDistance"
                  options={[
                    { value: 'Close', label: 'Close' },
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Far', label: 'Far' }
                  ]}
                  value={formData.readingDistance}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6 border-t mt-6">
              <div className="flex gap-4">
                <button

                  type="submit"
                  className={`flex-1 py-2 px-4 rounded-md text-white transition-colors duration-200 ${calculateProgress() === 100
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                    }`}
                  disabled={calculateProgress() !== 100}
                >
                  Submit Assessment
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({})}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md px-4 transition-colors duration-200"
                >
                  Reset
                </button>
              </div>
              {calculateProgress() !== 100 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Please complete all fields to submit the form
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};


export default LifestyleForm;