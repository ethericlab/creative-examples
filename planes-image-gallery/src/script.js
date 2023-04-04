import * as THREE from 'three'
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

const gallery = []

for (let i = 0; i < 13; i++) {
    textures.push(loader.load(`/textures/${i}.webp`))
}

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(1, 1, 1)

textures.forEach((texture, index) => {

    const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})

    const mesh = new THREE.Mesh(geometry, material)
    mesh.material.map = texture

    setPositionAndRotation(mesh, index)

    gallery.push(mesh)
    scene.add(mesh)
})

function setPositionAndRotation(mesh, index) {
    mesh.position.x = Math.sin(Math.PI * (index + currentTextureIndex) * 0.222) * 2
    mesh.position.z = Math.cos(Math.PI * (index + currentTextureIndex) * 0.222) * 2.6
    mesh.position.y = (index + currentTextureIndex) * -1.1

    mesh.rotation.y = Math.PI * (index - currentTextureIndex) * 0.222
}

const handleWheelEvent = (e) => {
    currentTextureIndex = window.scrollY / 200

    gallery.forEach((gallery, index) => {
        animateMesh(gallery, index)
    })
};

const animateMesh = (mesh, index) => {
    gsap.to(mesh.position, {
        x: Math.sin(Math.PI * (index - currentTextureIndex) * 0.222) * 2,
        duration: 0.6
    })
    gsap.to(mesh.position, {
        z: Math.cos(Math.PI * (index - currentTextureIndex) * 0.222) * 2.6,
        duration: 0.6
    })
    gsap.to(mesh.position, {
        y: (index - currentTextureIndex) * - 1.1,
        duration: 0.6
    })
    gsap.to(mesh.rotation, {
        y: Math.PI * (index - currentTextureIndex) * 0.222,
        duration: 0.6
    })
}

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
camera.position.set(0, 0, 4.5);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0x111111, 1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

/**
 * Animate
 */
let clock = new THREE.Clock()

const tick = () => {
    // Render
    renderer.render(scene, camera)

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    gallery.forEach(mesh => {
        gsap.to(mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.25
        })
    })

    for ( let i = 0; i < intersects.length; i ++ ) {
        const mesh = intersects[i].object
        gsap.to(mesh.scale, {
            x: 1.35,
            y: 1.35,
            z: 1.35,
            duration: 0.3
        })
    }

    // Call tick again on the next frame
    requestAnimationFrame(tick)
}


console.log('addEventListener')

window.addEventListener('wheel', throttle(handleWheelEvent, 150), false)
window.addEventListener( 'pointermove', onPointerMove );

tick()

