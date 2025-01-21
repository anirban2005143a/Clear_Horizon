import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import NETWORK from "vanta/dist/vanta.net.min";
import Center from "./center.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import gsap from "../../utiles/gsap.js"
import eyeImg from "../../assets/eye.png"
import Footer from "../../components/footer/Footer.jsx";
import Features from "./features.jsx";

const Home = () => {

    window.THREE = THREE

    const [vantaEffect, setVantaEffect] = useState(null);
    const myRef = useRef(null);
    const second = useRef(null)

    useEffect(() => {
        if (!vantaEffect) {
            try {
                setVantaEffect(
                    NETWORK({
                        el: myRef.current,
                        THREE: THREE,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        color: 0x5d434d,
                        backgroundColor: 0x000000,
                        points: 13.00,
                        maxDistance: 18.00,
                        spacing: 19.00
                    })
                );
            } catch (error) {
                console.error("[VANTA] Init error:", error);
            }
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    useEffect(() => {
        if (second.current) {
            gsap.HomeSecond(second.current)
        }
    }, [second.current])



    return <>
        <div id="home" ref={myRef} className=" relative overflow-hidden bg-black h-screen"  >
            <div className="fixed w-full h-full top-0 right-0 flex justify-end">
                {/* <div className="h-full w-full ">
                </div> */}
                <img src={eyeImg} alt="" className="  w-1/2 object-cover" style={{ height: `${window.innerHeight}px` }} />
            </div>

            <div ref={second} className=" home h-screen overflow-y-auto overflow-x-hidden">
                <Navbar />
                {/* center  */}
                <div className=" relative w-full min-h-screen flex justify-start items-center mt-[50px] py-10 " >
                    <Center />
                </div>

                {/* feature  */}
                <Features />
                {/* footer / */}
                <Footer/>


            </div>


        </div>
    </>

};

export default Home;
