import * as THREE from 'three'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const loader = new THREE.TextureLoader();

const texture = loader.load('/textures/1.png');

const state = {
    animating: false
}

// Scene
const scene = new THREE.Scene()
scene.background = texture

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
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(0, 0, 1);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0x000000 ,1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0,
});
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(canvas.clientWidth, canvas.clientHeight);

const MagnifierShader = {
    uniforms: {
        uTime: {value: 0},
        uRandom: {value: Math.random()},
        texture1: { value: null },
        uMouse: {
            type: "v2",
            value: new THREE.Vector2()
        }
    },
    vertexShader,
    fragmentShader
}

const displacementPass = new ShaderPass(MagnifierShader);
displacementPass.material.uniforms.texture1.value = texture;
effectComposer.addPass(displacementPass);

canvas.onmousemove = function(e) {
    displacementPass.material.uniforms.uMouse.value.x = e.pageX / window.innerWidth;
    displacementPass.material.uniforms.uMouse.value.y = 1.0 - e.pageY / window.innerHeight;
}

/**
 * Animate
 */
let clock = new THREE.Clock()

const tick = () => {
    // Render
    renderer.render(scene, camera)
    effectComposer.render();

    // Call tick again on the next frame
    requestAnimationFrame(tick)
}

window.addEventListener('mousedown', () => {
    clock = new THREE.Clock()
    state.animating = true
    console.log(state.animating)
})

window.addEventListener('mouseup', () => {
    state.animating = false
    console.log(state.animating)
})

tick()

