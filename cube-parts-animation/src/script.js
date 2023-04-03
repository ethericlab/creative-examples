import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const manager = new THREE.LoadingManager();

/**
 * Models
 */
const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

const smallCubes = []

let bigCube = null
let smallCube = null

const material = new THREE.MeshPhysicalMaterial(
    {
        metalness: 0,
        roughness: 0.7,
        transmission: 1,
        thickness: 0.5
    }
)

gltfLoader.load(
    '/models/cube/CubeRelay/RelayCube.glb',
    (gltf) => {
        bigCube = gltf.scene
    }
)

manager.onLoad = () => {
    const cube = bigCube.children[0]
    cube.scale.set(0.5, 0.5, 0.5)
    console.log(cube)
    scene.add(cube)

    cube.traverse(child => {
        if (child.isMesh) {
            child.material = material
            smallCubes.push(child)
        }
    })

    animateCubes()
}

function animateCubes() {
    const firstCube = smallCubes[1]

    const secondCube = smallCubes[4]

    const thirdCube = smallCubes[3]

    const fourthCube = smallCubes[0]

    const fifthCube = smallCubes[2]

    const sixthCube = smallCubes[6]

    const seventhCube = smallCubes[5]

    const stepSize = 6

    const tl = gsap.timeline()

    tl.to(firstCube.position, {
        z: stepSize,
        duration: 0.4
    }).to(secondCube.position, {
        y: stepSize,
        duration: 0.4
    }).to(thirdCube.position, {
        x: stepSize,
        duration: 0.4
    }).to(fourthCube.position, {
        y: -stepSize,
        duration: 0.4
    }).to(fifthCube.position, {
        z: -stepSize,
        duration: 0.4
    }).to(sixthCube.position, {
        y: stepSize,
        duration: 0.4
    }).to(seventhCube.position, {
        x: -stepSize,
        duration: 0.4
    }).to(firstCube.position, {
        y: -stepSize,
        duration: 0.4
    })
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 4)
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(2.87, 6.56, 10)
scene.add(directionalLight)

const secondDirectionalLight = new THREE.DirectionalLight(0xaaaaaa, 4)
secondDirectionalLight.shadow.mapSize.set(1024, 1024)
secondDirectionalLight.shadow.camera.far = 15
secondDirectionalLight.shadow.camera.left = -7
secondDirectionalLight.shadow.camera.top = 7
secondDirectionalLight.shadow.camera.right = 7
secondDirectionalLight.shadow.camera.bottom = -7
secondDirectionalLight.position.set(10, 6.07, 0.9)
scene.add(secondDirectionalLight)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 10, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.object.position.set(15, 16, 15)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0x1d1d1d)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

