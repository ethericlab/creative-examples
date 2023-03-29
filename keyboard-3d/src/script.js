import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import {FontLoader} from "three/addons/loaders/FontLoader";
import {TextGeometry} from "three/addons/geometries/TextGeometry";
import gsap from 'gsap'
import {Vector3} from "three";

const keys = [
    {
        label: 'Q',
        keyCode: 81,
        mesh: null,
        rowIndex: 1
    },
    {
        label: 'W',
        keyCode: 87,
        rowIndex: 1
    },
    {
        label: 'E',
        keyCode: 69,
        rowIndex: 1
    },
    {
        label: 'R',
        keyCode: 82,
        rowIndex: 1
    },
    {
        label: 'T',
        keyCode: 84,
        rowIndex: 1
    },
    {
        label: 'Y',
        keyCode: 89,
        rowIndex: 1
    },
    {
        label: 'U',
        keyCode: 85,
        rowIndex: 1
    },
    {
        label: 'I',
        keyCode: 73,
        rowIndex: 1
    },
    {
        label: 'O',
        keyCode: 79,
        rowIndex: 1
    },
    {
        label: 'P',
        keyCode: 80,
        rowIndex: 1
    },
    {
        label: 'A',
        keyCode: 65,
        rowIndex: 2
    },
    {
        label: 'S',
        keyCode: 83,
        rowIndex: 2
    },
    {
        label: 'D',
        keyCode: 68,
        rowIndex: 2
    },
    {
        label: 'F',
        keyCode: 70,
        rowIndex: 2
    },
    {
        label: 'G',
        keyCode: 71,
        rowIndex: 2
    },
    {
        label: 'H',
        keyCode: 72,
        rowIndex: 2
    },
    {
        label: 'J',
        keyCode: 74,
        rowIndex: 2
    },
    {
        label: 'K',
        keyCode: 75,
        rowIndex: 2
    },
    {
        label: 'L',
        keyCode: 76,
        rowIndex: 2
    },
    {
        label: 'Z',
        keyCode: 90,
        rowIndex: 3
    },
    {
        label: 'X',
        keyCode: 88,
        rowIndex: 3
    },
    {
        label: 'C',
        keyCode: 67,
        rowIndex: 3
    },
    {
        label: 'V',
        keyCode: 86,
        rowIndex: 3
    },
    {
        label: 'B',
        keyCode: 66,
        rowIndex: 3
    },
    {
        label: 'N',
        keyCode: 78,
        rowIndex: 3
    },
    {
        label: 'M',
        keyCode: 77,
        rowIndex: 3
    }
]

const keyDownAudio = new Audio('/key-down.mp3')
const keyUpAudio = new Audio('/key-up.mp3')

const keyCounter = {
    index: 0,
    rowIndex: 1
}

const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/droid_sans_regular.typeface.json',
    (droidfont) => {
        keys.forEach((key, index) => {
            creatButton(droidfont, key, index)
        })

        window.addEventListener('keydown', (e) => {
            const pressedKey = keys.find(key => key.keyCode === e.keyCode)

            if (pressedKey) {
                gsap.to(pressedKey.mesh.position, {
                    z: -0.25,
                    duration: 0.1,
                    ease: 'sine.out'
                })
                keyDownAudio.play()
            }
        })

        window.addEventListener('keyup', (e) => {
            const pressedKey = keys.find(key => key.keyCode === e.keyCode)

            if (pressedKey) {
                gsap.to(pressedKey.mesh.position, {
                    z: 0,
                    duration: 0.2,
                    ease: 'sine.out'
                })
                keyUpAudio.play()
            }
        })
    }
)
const textMaterial = new THREE.MeshNormalMaterial()

function createKeyBody(index) {
    const roundedRectShape = new THREE.Shape();

    function roundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
    }

    roundedRect(roundedRectShape, 0, 0, 2, 2, 0.01)

    const extrudeSettings = {
        depth: -0.6,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 0,
        bevelSize: 0.5,
        bevelThickness: 1
    };

    const geometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);

    return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x242526}));
}

// {
//     "x": 1,
//     "y": 1,
//     "z": -0.29999999701976776
// }

function createKeyLabel(droidfont, label) {
    const textGeometry = new TextGeometry(label, {
        height: 0.47,
        size: 0.9,
        font: droidfont
    })

    textGeometry.computeBoundingBox()
    const center = textGeometry.boundingBox.getCenter(new Vector3())

    console.log(label, center)

    const textMesh = new THREE.Mesh(textGeometry, textMaterial)

    textMesh.position.x = 1 -  center.x
    textMesh.position.y = 1 -  center.y

    return textMesh
}

function creatButton(droidfont, key, index) {
    if (index !== 0) {
        if (keyCounter.rowIndex === key.rowIndex) {
            keyCounter.index++
        } else {
            keyCounter.index = 0
            keyCounter.rowIndex = key.rowIndex
        }
    }

    const group = new THREE.Group()

    let positionX = -14 + keyCounter.index * 2.87
    let positionY = 2

    if (key.rowIndex === 2) {
        positionX = -14 + 0.8 + keyCounter.index * 2.87
        positionY = 2 - 3
    } else if (key.rowIndex === 3) {
        positionX = -14 + 2.1 + keyCounter.index * 2.87
        positionY = 2 - 6
    }

    group.position.x = positionX
    group.position.y = positionY
    group.position.z = -0.1

    const bodyMesh = createKeyBody(keyCounter.index)

    const labelMesh = createKeyLabel(droidfont, key.label)

    group.add(labelMesh)
    group.add(bodyMesh)
    scene.add(group)


    key.mesh = group
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const tableGeometry = new THREE.BoxGeometry(30, 10, 1)
const tableMaterial = new THREE.MeshBasicMaterial({color: 0x595857})
const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial)

tableMesh.position.z = -0.5
scene.add(tableMesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 0, 10);
scene.add(directionalLight);

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
camera.position.z = 10
camera.position.y = -6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()