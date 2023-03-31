import * as THREE from 'three'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js";
import {throttle} from 'lodash'
import gsap from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const loader = new THREE.TextureLoader();

const textures = []
let currentTextureIndex = 0

for (let i = 0; i < 13; i++) {
    textures.push(loader.load(`/textures/${i}.webp`))
}

// Scene
const scene = new THREE.Scene()
scene.background = textures[currentTextureIndex]

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
renderer.setClearColor(0x000000, 1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0,
});
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(canvas.clientWidth, canvas.clientHeight);

const ScrollDistortionShader = {
    uniforms: {
        uMixFactor: {value: 0},
        uDistortionFactor: {value: 1},
        uNoiseFactor: {value: 0},
        texture1: {value: null},
        texture2: {value: null},
    },
    vertexShader,
    fragmentShader
}

const scrollDistortionPass = new ShaderPass(ScrollDistortionShader);
scrollDistortionPass.material.uniforms.texture1.value = textures[currentTextureIndex];
scrollDistortionPass.material.uniforms.texture2.value = textures[currentTextureIndex];
effectComposer.addPass(scrollDistortionPass);

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

const handleWheelEvent = throttle((e) => {
    if (e.wheelDelta > 0) {
        if (currentTextureIndex === 0) {
            return
        } else {
            scrollDistortionPass.material.uniforms.texture1.value = textures[currentTextureIndex];
            scrollDistortionPass.material.uniforms.texture2.value = textures[currentTextureIndex - 1];
            currentTextureIndex--
            gsap.fromTo(scrollDistortionPass.material.uniforms.uDistortionFactor, {
                value: -1
            }, {
                value: 0,
                duration: 0.75
            })
        }

    } else {
        if (currentTextureIndex === textures.length - 1) {
            return
        } else {
            scrollDistortionPass.material.uniforms.texture1.value = textures[currentTextureIndex];
            scrollDistortionPass.material.uniforms.texture2.value = textures[currentTextureIndex + 1];
            currentTextureIndex++
            gsap.fromTo(scrollDistortionPass.material.uniforms.uDistortionFactor, {
                value: 1
            }, {
                value: 0,
                duration: 0.75
            })
        }
    }
    gsap.fromTo(scrollDistortionPass.material.uniforms.uMixFactor, {
        value: 0
    }, {
        value: 1,
        duration: 1
    })
    const tl = gsap.timeline()
    tl.fromTo(scrollDistortionPass.material.uniforms.uNoiseFactor, {
        value: 0
    }, {
        value: 0.6,
        duration: 0.5
    }).to(scrollDistortionPass.material.uniforms.uNoiseFactor, {
        value: 0
    })
}, 1500)

console.log('addEventListener')
document.addEventListener('wheel', handleWheelEvent, false)


tick()

