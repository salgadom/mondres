import { MeshStandardMaterial } from 'three';
import './main.css';
import SceneManager from './scene/SceneManager.js';
import { loadGLBModel } from './utils/ModelLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import manageScrollMemory from './utils/manageScrollMemory.js';
import { home_setup } from './scrollTriggers/home.js';

  // if ('scrollRestoration' in history) {
  //   history.scrollRestoration = 'manual';
  // }

document.addEventListener('DOMContentLoaded', () => {

  home_setup()

  const container = document.getElementById('wingedLionStage')
  const sceneManager = new SceneManager(container)

  manageScrollMemory()

  const circle = document.getElementById('circleBorder');
  const button = document.getElementById('circleBtn');

  const tl2 = gsap.timeline({ paused: true });
  tl2.to(circle, {
    strokeDashoffset: 0,
    duration: 0.5,
    ease: 'power1.out'
  });

  button.addEventListener('mouseenter', () => tl2.play());
  button.addEventListener('mouseleave', () => tl2.reverse());


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
  })

})