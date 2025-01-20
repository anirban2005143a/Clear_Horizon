import React, { useState } from 'react';
import Home from './pages/home/home';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import MousePointer from './components/mousePointer/MousePointer';
import SnellenChart from './pages/digitalVIsionTest/digitalVision';
import BlurText from './pages/blurTest/blurText';
import Astigmatism from './pages/astigmetism/astigmatism';
import LifestyleForm from './pages/lifeStyleForm/LifeStyleForm';
import Recomendation from './pages/recomandation/recomendation';
import Feedback from './pages/feedback/Feedback';

const App = () => {

  const [dataObj, setdataObj] = useState({})

  const router = createBrowserRouter([
    {
      path : "/",
      element : <><Home/></>
    },
    {
      path : "/LifeStyle",
      element : <><LifestyleForm dataObj={dataObj} setdataObj={setdataObj} /></>
    },
    {
      path : "/digital/vision/test",
      element : <><SnellenChart dataObj={dataObj} setdataObj={setdataObj}/></>
    },
    {
      path : "/astigmatism/test",
      element : <><Astigmatism dataObj={dataObj}  setdataObj={setdataObj}/></>
    },
    {
      path : "/blur/test",
      element : <><BlurText dataObj={dataObj}  setdataObj={setdataObj}/></>
    },
    {
      path : "/recomendation",
      element : <><Recomendation dataObj={dataObj} /></>
    },
    {
      path : "/feedback",
      element : <><Feedback/></>
    },
    
  ])

  console.log(dataObj)

  return (
    <div className=' overflow-x-hidden '>
      <MousePointer/>
      <RouterProvider router={router} />
     </div>
  );
};


export default App;
