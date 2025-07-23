import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
} from 'three';

export default class SceneManager {
  isometricPerspective() {
    this.camera.fov = 10
    this.camera.updateProjectionMatrix();
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);
  }
  constructor(container = document.body) {
    this.container = container;

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(75, 1, 0.1, 1000)
    // this.camera.position.set(0, .26, .56)
    this.camera.position.set(0, 0, 2.4)

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(800, 800)
    container.appendChild(this.renderer.domElement);
    
    const light = new DirectionalLight(0xffffff, 7);
    light.position.set(5, 5, 5).normalize()
    this.scene.add(light);
    
    window.addEventListener('resize', () => this.onWindowResize(), false);

    this.animate();
  }

  onWindowResize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}