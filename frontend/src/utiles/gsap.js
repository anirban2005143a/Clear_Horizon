import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

let pointer

const MousePointer = (element, x, y) => {
    pointer = element
    gsap.to(element, {
        x: x,
        y: y,
        duration: 1.5,
        ease: "back.out(5)",
    })

}

const HomeCenter = (component) => {
    gsap.fromTo(component, {
        translateY: "100%",
        scale: 0,
    },{
        translateY: "0%",
        scale: 1,
        duration: 1.5,
        ease: "elastic.out(1,0.8)"
    })
}

const ScaleUpOnHover = (component) => {
    component.addEventListener("mouseover", () => {
        gsap.to(pointer, {
            scale: 2,
            duration: 2,
            ease: "elastic.out(1,0.3)"
        })
    })

}

const ScaleDownOnHover = (component) => {
    component.addEventListener("mouseout", () => {
        gsap.to(pointer, {
            scale: 1,
            duration: 2,
            ease: "elastic.out(1,0.3)"
        })
    })
}

const navBarElem = (component) => {
//    gsap.fromTo(component , {
//     translateY:"-50px",
//     opacity:0,
//    },{
//     translateY:0,
//     opacity:1,
//     duration:2000,
//     stagger:0.8
//    })
}

const HomeSecond = (component) => {
    gsap.to(component, {
        backgroundImage:"linear-gradient(159deg, rgba(0,51,102,1) 0%, rgba(15,82,186,1) 100%)",
        scrollTrigger: {
            trigger: component,
            scroller: "#home .home",
            start: "top -10%",
            end: "top -60%",
            scrub: 2
        }
    })
}

const Feature1 = (component) => {
    gsap.fromTo(component, {
        translateX: "150%"
    }, {
        translateX: "0",
        scrollTrigger: {
            trigger: component,
            scroller: "#home .home",
            // markers:true,
            start: "top 80%",
            end: "top 60%",
            scrub: 3
        }
    })
}
const Feature2 = (component) => {
    gsap.fromTo(component, {
        translateX: "-150%"
    }, {
        translateX: "0",
        scrollTrigger: {
            trigger: component,
            scroller: "#home .home",
            // markers:true,
            start: "top 80%",
            end: "top 60%",
            scrub: 3
        }
    })
}
const Feature3 = (component) => {
    gsap.fromTo(component, {
        translateX: "150%"
    }, {
        translateX: "0",
        scrollTrigger: {
            trigger: component,
            scroller: "#home .home",
            // markers:true,
            start: "top 80%",
            end: "top 60%",
            scrub: 3
        }
    })
}


export default {
    MousePointer,
    HomeCenter,
    ScaleUpOnHover,
    ScaleDownOnHover,
    navBarElem,
    HomeSecond,
    Feature1,
    Feature2,
    Feature3
}