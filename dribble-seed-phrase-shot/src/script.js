import * as THREE from 'three'
import gsap from 'gsap'

const planes = []

function createPlane(index) {
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

    roundedRect(roundedRectShape, 0, 0, 2, 2, 0.03)

    const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: true,
        bevelSegments: 0,
        steps: 1,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);

    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
        color: index === 10 ? 0xff0000 : 0xededed,
        roughness: 1,
        metalness: 0,
        transmission: 0.1,
        thickness: 0.1
    }));

    mesh.geometry.computeBoundingBox();

    mesh.position.x = -8 + index / 3
    mesh.rotation.y = Math.PI * 0.5

    mesh.receiveShadow = true
    mesh.castShadow = true
    planes.push(mesh)
    scene.add(mesh)
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

for (let i = 0; i < 120; i++) {
    createPlane(i)
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.position.set(0, 10, 5);
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
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
camera.position.y = 7
camera.position.x = -2

camera.lookAt(6, 0, -4)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setClearColor(0xffffff)
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const updateNearMeshes = (index) => {
    if (planes[index - 6]) {
        updatePosition(planes[index - 6], 0.14)
    }
    if (planes[index - 5]) {
        updatePosition(planes[index - 5], 0.28)
    }
    if (planes[index - 4]) {
        updatePosition(planes[index - 4], 0.42)
    }
    if (planes[index - 3]) {
        updatePosition(planes[index - 3], 0.56)
    }
    if (planes[index - 2]) {
        updatePosition(planes[index - 2], 0.7)
    }
    if (planes[index - 1]) {
        updatePosition(planes[index - 1], 0.84)
    }
    updatePosition(planes[index], 1)
    if (planes[index + 1]) {
        updatePosition(planes[index + 1], 0.84)
    }
    if (planes[index + 2]) {
        updatePosition(planes[index + 2], 0.7)
    }
    if (planes[index + 3]) {
        updatePosition(planes[index + 3], 0.56)
    }
    if (planes[index + 4]) {
        updatePosition(planes[index + 4], 0.42)
    }
    if (planes[index + 5]) {
        updatePosition(planes[index + 3], 0.28)
    }
    if (planes[index + 6]) {
        updatePosition(planes[index + 4], 0.14)
    }
}

const updatePosition = (mesh, position) => {
    gsap.to(mesh.position, {
        y: position,
        duration: 0.5,
        ease: 'power2.out'
    })
}

const tick = () => {
    raycaster.setFromCamera(pointer, camera);

    let intersectionIndex = false

    for (let i = 0; i < planes.length; i++) {
        const result = raycaster.intersectObject(planes[i], false);
        if (result.length === 0) {
            if (i - intersectionIndex > 4) {
                updatePosition(planes[i], 0)
            }

        } else {
            if (intersectionIndex) {
                if (i - intersectionIndex > 4) {
                    updatePosition(planes[i], 0)
                }

            } else {
                intersectionIndex = i
                updateNearMeshes(i)
            }
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

window.addEventListener('pointermove', onPointerMove);

tick()