import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import "./main.css"
import { MAJESTIC_WINGED_LION_GLB } from "./constants"

gsap.registerPlugin(ScrollTrigger)


// const majestic_winged_lion = "/wp-content/themes/mondres/assets/models/majestic_winged_lion-mobile.glb"

// Basic Three.js scene setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.8, 4)
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize(800, 800)

const stage = document.querySelector("#wingedLionStage")
const hero = document.querySelector("#wingedLionHero")

// hero.style.transition = `transform 800ms ease`

const bg = document.createElement("div")
bg.style.height = "900vh"

document.body.appendChild(bg)



document.body.appendChild(stage)

stage.appendChild(renderer.domElement)

// Add a simple model (e.g., BoxGeometry as placeholder)
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 7)
light.position.set(5, 5, 5).normalize()
scene.add(light)

const color = 0xffffff
const intensity = 1
const ambientLight = new THREE.AmbientLight(color, intensity)
scene.add(ambientLight)

camera.position.z = 2.4

// Scroll-driven rotation
// window.addEventListener('scroll', () => {
//     const rotation = window.scrollY * 0.01;
//     mesh.rotation.y = rotation;
// });

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

let model = null

const gold = {
    color: "#C2B067",
    emissive: "#403301",
    roughness: 0.5,
    metalness: 1,
}
const blue = {
    color: "#2D68C4",
    emissive: "#000",
    roughness: 0.8,
    metalness: 0.8,
}
const orange = {
    color: "#856A00",
    emissive: "red",
    roughness: 1,
    metalness: 0.5,
}

// const gold = {
//     color: 'gold',
//     emissive: '#000',
//     roughness: .2,
//     metalness: .5
// }
// const blue = {
//     color: '#049ef4',
//     emissive: '#000',
//     roughness: 1,
//     metalness: 0,
// }
// const white = {
//     color: 'green',
//     emissive: 'black',
//     roughness: 1,
//     metalness: 0
// }

const initialStageRight = 10
// const initialStageScale = 1
const initialRotation = -0.7

stage.style.position = "absolute"
// stage.style.right = `${initialStageRight}px`
// stage.style.top = `0px`
stage.style.zIndex = `9999`
// stage.style.transform = `scale(${initialStageScale})`

// stage.style.outline = `2px solid #fff`

const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)

loader.load(MAJESTIC_WINGED_LION_GLB, function (gltf) {
    model = gltf.scene

    model.traverse((child) => {
        if (child.isMesh) {
            // Check if the child is a mesh
            const goldMaterial = new THREE.MeshStandardMaterial(blue)
            child.material = goldMaterial
        }
    })

    // model.scale.set(1, 1, 1);
    // const initialY = -160*0.005
    // model.rotation.y = initialY

    // const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    // const mesh = new THREE.Mesh(model, material);
    scene.add(model)

    model.rotation.y = initialRotation

    // stage.classList.add('top-[500vh]')

    // gsap.to(stage, {
    //     y: 270,
    //     scrollTrigger: {
    //         trigger: document.body,
    //         start: "top+=100 top",
    //         end: "top+=493 top", 
    //         scrub: true,
    //         onLeave: () => {
    //             console.log('leave');
                
    //         }
    //     }
    // })

    const section_1 = document.querySelector(".section-1")
    const promo = document.querySelector(".section-promo")
    const section_2 = document.querySelector(".section-2")

    promo.style.height = 280 + 'vh'

    const customLogo = promo.querySelector(".custom-logo")
    const figure = promo.querySelector("figure")

    // figure.style.display = 'none'
    figure.style.transform = `translateY(100vh)`

    customLogo.style.position = 'fixed'
    customLogo.style.width = 300 + 'px'
    customLogo.style.top = 300 + 'px'
    customLogo.style.left = 50 + '%'
    customLogo.style.right = 50 + '%'
    customLogo.style.marginLeft = -150 + 'px'

    // gsap.to(customLogo, {
    //     left: "3rem",
    //     top: "3rem",
    //     width: 120,
    //     marginLeft: 0,
    //     scrollTrigger: {
    //         trigger: promo,
    //         start: "top top",
    //         end: "top+=500 top",
    //         scrub: true
    //     }
    // })

    ScrollTrigger.create({
        trigger: promo,
        start: "top top",
        end: "top+=500 top",
        scrub: true,
        onUpdate: () => {
            gsap.to(customLogo, {
                left: "3rem",
                top: "3rem",
                width: 120,
                marginLeft: 0,
                duration: .3
            })
        }
    })

    ScrollTrigger.create({
        trigger: figure,
        start: "center center", 
        end: "+=800",
        pin: true,  
        pinSpacing: true,
        markers: true
    })
    

    // navigation.style.height = "100vh"

    // customLogo.style.transform = 'scale(3) translateX(calc(10vw))'

    
    stage.style.top = section_1.getBoundingClientRect().top + window.scrollY + 150 + 'px'

    const initialLeft = document.body.clientWidth - stage.getBoundingClientRect().width
    stage.style.left = initialLeft + 'px'


    gsap.to(stage, {
        top: () => section_1.getBoundingClientRect().top + window.scrollY - 90,
        ease: "power2.in",
        scrollTrigger: {
            trigger: ".section-1",
            start: "top-=400 center",
            end: "bottom bottom",
            scrub: true,            
            onEnterBack: () => { 
                model.traverse((child) => {
                    if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                        const target = new THREE.Color(blue.color);
                        gsap.to(child.material.color, {
                            r: target.r,
                            g: target.g,
                            b: target.b,
                            duration: .5
                        });
                    }
                })
            }
        }
    })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-2",
            start: "top-=100 center",
            end: "bottom bottom",
            scrub: true,
            // markers: true, 
            onUpdate: () => {
                model.traverse((child) => {
                    if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                        const target = new THREE.Color(gold.color);
                        tl.to(child.material.color, {
                            r: target.r,
                            g: target.g,
                            b: target.b
                        }, 0);
                    }
                })
            }
        }
    })

    tl.to(stage, { 
        top: () => section_2.getBoundingClientRect().top + window.scrollY, 
        left: 10,
        scale: .8
    }, 0)
        // .to(model.rotation, { y: Math.PI, x: Math.PI / 3 }, 0) // birde-eye view
        .to(model.rotation, { y: 1, x: 0 }, 0)
    
    // gsap.to(stage, {
    //     top: () => {
    //         const target = document.querySelector(".section-2")
    //         return target.getBoundingClientRect().top + window.scrollY
    //     },  
    //     left: 10,
    //     scrollTrigger: {
    //         trigger: ".section-2",
    //         start: "top+=100 bottom",
    //         end: "bottom bottom",
    //         scrub: true,
    //         markers: true, 
    //         onUpdate: () => {
                
    
    //             // gsap.to(stage, {
    //             //     top: absoluteTop - 100,
    //             //     right: "auto",
    //             //     left: 10,
    //             //     duration: .3,
    //             // })
    
    //             gsap.to(model.rotation, { 
    //                 y: Math.PI,
    //                 x: Math.PI / 3,
    //                 // x: Math.PI,
    //                 duration: 1,
    //             })
    //             // gsap.to(model.rotation, { 
    //             //     y: 1,
    //             //     duration: 1,
    //             // })
    
    //             model.traverse((child) => {
    //                 if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
    //                     const target = new THREE.Color(gold.color);
    //                     gsap.to(child.material.color, {
    //                         r: target.r,
    //                         g: target.g,
    //                         b: target.b,
    //                         duration: 1
    //                     });
    //                 }
    //             })
    //         }
    //     }
    // })

    // gsap.to(stage, {
    //     scrollTrigger: {
    //         trigger: ".section-1",
    //         start: "top+=300 bottom",
    //         end: "bottom top",
    //         scrub: true,
    //         // markers: true,
    //         onUpdate: self => {
    //             const target = document.querySelector(".section-1");
    //             const rect = target.getBoundingClientRect();

    //             stage.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    //         }
    //     }
    // })

    // const tl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: document.body,
    //         start: "top+=900 top",
    //         end: "top+=1500 top",
    //         scrub: true,
    //         onEnter: () => {
    //             model.traverse((child) => {
    //                 if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
    //                     const target = new THREE.Color(gold.color);
    //                     gsap.to(child.material.color, {
    //                         r: target.r,
    //                         g: target.g,
    //                         b: target.b,
    //                         duration: 1
    //                     });
    //                 }
    //             });
    //         },
    //         onLeaveBack: () => {
    //             model.traverse((child) => {
    //                 if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
    //                     const target = new THREE.Color(blue.color);
    //                     gsap.to(child.material.color, {
    //                         r: target.r,
    //                         g: target.g,
    //                         b: target.b,
    //                         duration: .5
    //                     });
    //                 }
    //             });
    //         }
    //         // markers: true, // optional
    //     }
    // });

    // tl.to(model.rotation, { y: 1 }, 0)
    //     .to(stage, { translateX: -900 }, 0)

})