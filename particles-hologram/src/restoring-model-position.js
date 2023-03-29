import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import {Vector3} from "three";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let model = null
let modelParticles = null

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/models/mask/venice_mask.glb',
    (gltf) => {
        model = gltf.scene
        gltf.scene.scale.set(100, 100, 100)
        // scene.add(gltf.scene)

        console.log(gltf.scene)

        const vertices = [];
        //
        try {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    vertices.push(...child.geometry.attributes.position.array);
                }
            });
        } catch (e) {
        }

        const p_geom = new THREE.BufferGeometry();
        const p_material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.01
        });

        const initialPositionsArray = new Array(vertices.length)

        for (let i = 0; i < initialPositionsArray.length; i++) {
            initialPositionsArray[i] = (Math.random() - 0.5) * 150
        }

        const initialPositionsFloat32Array = new THREE.Float32BufferAttribute(initialPositionsArray, 3)

        console.log(initialPositionsFloat32Array)

        const finalPositionArray = new THREE.Float32BufferAttribute(vertices, 3)

        p_geom.setAttribute('position', initialPositionsFloat32Array);

        const p = new THREE.Points(p_geom, p_material);
        p.position.set(0, 0, 0)
        p.scale.set(2, 2, 2)

        modelParticles = p

        const finalPositionGeometry = new THREE.BufferGeometry();
        finalPositionGeometry.setAttribute('position', finalPositionArray);

        gsap.to(p.geometry.attributes.position.array, {
            endArray: finalPositionGeometry.attributes.position.array,
            duration: 4,
            ease: 'power2',
            // Make sure to tell it to update if not using the tick function
            onUpdate: () => {
                p.geometry.attributes.position.needsUpdate = true;
                camera.lookAt(p.position);
                renderer.render(scene, camera);
            },
        })

        scene.add(p)
    }
)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(-2, 2, 0)
scene.add(directionalLight)

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
camera.position.set(0,10.75,11.89)
scene.add(camera)

// camera.lookAt(0, 5.75,0)

// gui.add(camera.position, 'x', -50, 50, 0.01)
// gui.add(camera.position, 'y', -50, 50, 0.01)
// gui.add(camera.position, 'z', -50, 50, 0.01)

// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.object.position.set(0, 10.75,11.89)
controls.target.set(0, 6, 0)
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    if (model && modelParticles) {
        model.rotation.y += 0.01
        modelParticles.rotation.y += 0.01
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

