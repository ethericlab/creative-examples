import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertetShader from './shader/drawing-model-particles-vertex.glsl'
import fragmentShader from './shader/drawing-model-particles-fragment.glsl'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let model = null
const modelParticles = {
    mesh: null,
    start: Math.floor(100 + 200 * Math.random()),
    verticesDown: 0,
    verticesUp: 0,
    direction: 0,
    speed: 15,
    delay: Math.floor(200 + 200 * Math.random()),
    verticeDownNextStep: 0
}

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

        const vertices = [];

        try {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    vertices.push(...child.geometry.attributes.position.array);
                }
            });
        } catch (e) {
        }

        const uniforms = {
            uCurrentLevel: {
                type: 'float',
                value: modelParticles.verticeDownNextStep
            }
        }

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertetShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        const p_geom = new THREE.BufferGeometry();

        const finalPositionArray = new THREE.Float32BufferAttribute(vertices, 3)

        const alphas = new Float32Array(finalPositionArray.count)

        for (let i = 0; i < finalPositionArray.count; i++) {
            alphas[i] = 0;
        }

        p_geom.setAttribute('position', finalPositionArray);
        p_geom.setAttribute('initialPosition', finalPositionArray.clone());
        p_geom.setAttribute('alpha', finalPositionArray.clone());

        const p = new THREE.Points(p_geom, shaderMaterial);
        p.position.set(0, 0, 0)
        p.scale.set(2, 2, 2)

        modelParticles.mesh = p

        const positions = modelParticles.mesh.geometry.attributes.position;

        const count = positions.count;

        for (let i = 0; i < count; i++) {

            const px = positions.getX(i);
            const pz = positions.getZ(i);

            positions.setXYZ(
                i,
                px,
                0,
                pz
            );
        }

        modelParticles.mesh.material.uniforms.uCurrentLevel.value = modelParticles.verticeDownNextStep - 0.01

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
camera.position.set(0, 10.75, 11.89)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.object.position.set(0, 10.75, 11.89)
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

const animateParticles = (delta) => {
    const data = modelParticles;
    const positions = data.mesh.geometry.attributes.position;
    const initialPositions = data.mesh.geometry.attributes.initialPosition;

    const count = positions.count;

    if (data.direction === 0) {
        data.direction = -1;
    }

    let counterAlreadyFallen = 0
    let counterAlreadyUp = 0

    for (let i = 0; i < count; i++) {

        const px = positions.getX(i);
        const py = positions.getY(i);
        const pz = positions.getZ(i);

        if (data.direction < 0) {
            if (py > data.verticeDownNextStep) {
                positions.setXYZ(
                    i,
                    px,
                    Math.max(py - 0.01, 0),
                    pz
                );

            }
            if (py === 0) {
                counterAlreadyFallen++;
            }
        }

        if (data.direction > 0) {
            const iy = initialPositions.getY(i);
            const newPy = py + 0.009

            if (py < iy) {
                positions.setXYZ(
                    i,
                    px,
                    newPy,
                    pz
                );
            } else {
                counterAlreadyUp++;
            }
        }
    }

    if (data.direction < 0) {
        data.verticeDownNextStep -= 0.009
        data.mesh.material.uniforms.uCurrentLevel.value = modelParticles.verticeDownNextStep - 0.01
        if (counterAlreadyFallen === count) {
            data.direction = 1
        }
    }

    if (data.direction > 0) {
        data.verticeDownNextStep += 0.009
        data.mesh.material.uniforms.uCurrentLevel.value = modelParticles.verticeDownNextStep - 0.01
        if (counterAlreadyUp === count) {
            data.direction = -1
        }

    }

    positions.needsUpdate = true;
}

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const delta = deltaTime < 2 ? deltaTime : 2;

    // Update controls
    controls.update()

    if (modelParticles.mesh) {
        animateParticles(delta)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

