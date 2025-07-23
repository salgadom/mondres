import { MeshStandardMaterial } from 'three';
import './main.css';
import SceneManager from './scene/SceneManager.js';
import { loadGLBModel } from './utils/ModelLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { rotate } from 'three/src/nodes/TSL.js';

gsap.registerPlugin(ScrollTrigger)

const container = document.getElementById('wingedLionStage');
const navigation = document.getElementById('navigation')
const site_tagline = navigation.querySelector('.wp-block-site-tagline')
const site_logo = navigation.querySelector(".wp-block-site-logo")
const sceneManager = new SceneManager(container)

const tagline_setup = () => {
  const tagline = site_tagline.textContent
  const words = tagline.split(".").filter(t => t).map(t => `${t.trim()}.`)

  site_tagline.style.display = 'none'

  const container = document.createElement('div')
  container.classList.add("tagline-word-container", "fixed", "inset-0", "flex", "items-center", "justify-center", "z-20")

  const box = document.createElement('div')
  box.classList.add("relative", "translate-x-36", "translate-y-14")

  container.appendChild(box)

  words.forEach((word, index) => {
    const span = document.createElement('span')
    span.textContent = word
    span.classList.add(
      "tagline-word", 
      index < words.length - 1 ? "tagline-word-rollin": 
      "tagline-word-rollin2", 
      "text-nowrap", 
      "font-bold", 
      "text-5xl", 
      "absolute", 
      "left-0"
    )
    box.appendChild(span)
  })

  document.body.appendChild(container)
}
tagline_setup()

// document.body.insertAdjacentHTML("afterbegin", "<div class='pad-1 h-svh'></div>")

navigation.classList.add("fixed", "z-10", "inset-0", "bg-slate-50", "h-svh", "flex", "items-center", "justify-center")

const updateBodyPaddingTop = () => {
  gsap.set(document.body, { 
    paddingTop: 
      navigation.getBoundingClientRect().height 
        + window.scrollY  
        + (document.getElementById("wpadminbar")?.getBoundingClientRect().height ?? 0)
  })
}

updateBodyPaddingTop()

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "+=2000",
    scrub: true,
    // markers: true,
    onUpdate: () => {
      updateBodyPaddingTop()
    },
    onLeave: () => {
      document.querySelector(".tagline-word-container").classList.add("hidden")
    },
    onEnterBack: () => {
      document.querySelector(".tagline-word-container").classList.remove("hidden")
    }
  }
})

// gsap.set(navigation, { height: "100vh" })
gsap.set(site_logo, { transformOrigin: "50% 50%", scale: 2 })
gsap.set('.tagline-word', { autoAlpha: 0, transformOrigin: "0 bottom" })

const originalSize = getComputedStyle(document.querySelector(".tagline-word")).fontSize;

const rollin = {
  "0%": {
    fontSize: 0,
    autoAlpha: 0,
    marginLeft: -30,
    marginTop: 0,
    rotate: -25,
  },
  "3%": {
    autoAlpha: 1,
    rotate: 0,
  },
  "5%": {
    fontSize: originalSize,
    autoAlpha: 1,
    marginLeft: 0,
    marginTop: 0
  },
  "20%": {
    fontSize: originalSize,
    autoAlpha: 1,
    marginLeft: 0,
    marginTop: 0,
    rotate: 0
  },
  "27%": {
    fontSize: 0,
    autoAlpha: .5,
    marginLeft: 20,
    marginTop: 100
  },
  "100%": {
    fontSize: 0,
    autoAlpha: 0,
    marginLeft: -30,
    marginTop: 0,
    rotate: 15
  }
}

const rollin2 = {
  "0%": {
    fontSize: 0,
    autoAlpha: 0,
    marginLeft: -30,
    marginTop: 0,
    rotate: -25,
  },
  "3%": {
    autoAlpha: 1,
    rotate: 0,
  },
  "5%": {
    fontSize: originalSize,
    autoAlpha: 1,
    marginLeft: 0,
    marginTop: 0
  },
  "20%": {
    fontSize: originalSize,
    autoAlpha: 1,
    marginLeft: 0,
    marginTop: 0,
    rotate: 0
  },
  "37%": {
    fontSize: 1500,
    autoAlpha: 0,
    marginLeft: -1000,
    marginTop: -800
  },
  "100%": {
    fontSize: 0,
    autoAlpha: 0,
    marginLeft: -30,
    marginTop: 0,
    rotate: 15
  }
}

tl
  .to(
    '.tagline-word-rollin',
    { 
      keyframes: rollin,
      stagger: 6,
      duration: 24
    }, 
    ".1"
  )
  .to(
    '.tagline-word-rollin2',
    { 
      keyframes: rollin2,
      duration: 24
    }, 
    ">-=18"
  )
  .fromTo(navigation, { height: "100vh", backgroundColor: "#ffff" }, { height: 100, backgroundColor: "transparent", duration: 20 }, '>-=14')
  .to(site_logo, { 
    x: () => {
      return (
        site_logo.getBoundingClientRect().left 
          - navigation.getBoundingClientRect().left 
        ) * -1
    },
    scale: .5,
    duration: 20
  }, "<")
  // .to(navigation, { boxShadow: "0px 0px 10px 5px #00000044", ease: "power2.in" }, "<")

// gsap.from(site_logo, {
//   scale: 2,
//   duration: 3
// })


const gold = {
    color: "#C2B067",
    emissive: "#403301",
    roughness: 0.5,
    metalness: 1,
}
const blue = {
    color: "green",
    emissive: "blue",
    roughness: 0.8,
    metalness: 0.2,
}

loadGLBModel("/wp-content/themes/mondres/assets/models/majestic-winged-lion-gold-desktop.glb").then((model) => {
  model.scale.set(1, 1, 1);
  sceneManager.scene.add(model);

  model.traverse((child) => {
      if (child.isMesh) {
          child.material = new MeshStandardMaterial(blue)
      }
  })

  gsap.to(model.rotation, {
    y: Math.PI * 2,
    duration: 5,
    repeat: -1,
    ease: 'power1.inOut'
  });
});
