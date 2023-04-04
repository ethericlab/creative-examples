import * as THREE from 'three'
import {throttle} from 'lodash'
import gsap from 'gsap'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const loader = new THREE.TextureLoader();

// Scene
const scene = new THREE.Scene()

const uniforms = {
    uColor: {
        value: new THREE.Color(0x213e61)
    },
    uTime: {
        value: 0
    }
}

const geometry = new THREE.SphereGeometry( 8, 32, 16 );
const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});
const sphere = new THREE.Mesh( geometry, material );
sphere.position.y = 5
scene.add( sphere );

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// directionalLight.position.set(5, 5, 5);
// scene.add(directionalLight)
//
// const ambient = new THREE.AmbientLight( 0xffffff, 1 );
// scene.add( ambient );
//
// const pointLight = new THREE.PointLight( 0xffffff, 2 );
// pointLight.position.set(5,5,5)
// scene.add( pointLight );


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    70,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(10, 10, 10);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0x2d78aa, 1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, canvas)
controls.object.position.set(0, 30, 0);
controls.target.set(0, 6, 0)
controls.enableDamping = true

/**
 * Animate
 */
let clock = new THREE.Clock()

const tick = () => {
    const time = clock.getElapsedTime()
    // Render
    renderer.render(scene, camera)

    controls.update()

    sphere.material.uniforms.uTime.value = time

    // Call tick again on the next frame
    requestAnimationFrame(tick)
}

tick()

