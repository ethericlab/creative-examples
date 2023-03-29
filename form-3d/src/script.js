import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import gsap from 'gsap'
import {Text} from "troika-three-text";

import {preloadFont} from 'troika-three-text'

preloadFont(
    {
        font: '/fonts/LibertadMono-Regular.ttf',
        characters: 'abcdefghijklmnopqrstuvwxyz'
    },
    (e) => {
        const state = {
            initialLabelMesh: null,
            cursorMesh: null,
            inputValueGroup: new THREE.Group(),
            inputValue: null,
            letters: []
        }

        const input = document.querySelector('input')

        const letterMaterial = new THREE.MeshBasicMaterial({color: 0xfaff04})

        function onInputChange(e, font) {
            if (state.inputValue) {
                state.inputValue.geometry.dispose();
                state.inputValue.material.dispose();
                scene.remove(state.inputValue);
            }

            const text = new Text()
            text.text = e.target.value
            text.font = '/fonts/LibertadMono-Regular.ttf'
            text.color = '#faff04'
            text.fontSize = 1;
            text.position.y = 1;
            text.anchorX = 'center'
            text.anchorY = 'center'

            text.addEventListener('synccomplete', () => {
                state.inputValue = text
                text.geometry.computeBoundingBox();

                state.inputValueGroup.attach(text)


                const box = new THREE.Box3();
                box.copy(text.geometry.boundingBox).applyMatrix4(text.matrixWorld);

                const textSize = new THREE.Vector3()
                box.getSize(textSize)

                console.log(textSize)

                state.cursorMesh.position.x = textSize.x / 2 + 0.15

                console.log(text)

                scene.add(text)
            })

            text.sync();
        }

        function createTypeLabel() {
            const text = new Text()
            text.text = 'Type your email'
            text.font = '/fonts/LibertadMono-Regular.ttf'
            text.color = 'white'
            text.fontSize = 1;
            text.position.y = 1;
            text.sync();
            text.anchorX = 'center'

            text.position.set(0, 6, -10)
            text.rotation.x = Math.PI * 0.2

            state.initialLabelMesh = text

            scene.add(text)
        }

        function createInputCursor() {
            const geometry = new THREE.BoxGeometry(0.06, 1, 0.06);
            const material = letterMaterial.clone()
            material.transparent = true

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.y = 0.4
            state.inputValueGroup.attach(mesh)
            state.cursorMesh = mesh

            function infiniteBlinking() {
                const animateIn = () => {
                    gsap.to(material, {
                        opacity: 1,
                        duration: 0.45,
                        onComplete: animateOut
                    })
                }

                const animateOut = () => {
                    gsap.to(material, {
                        opacity: 0,
                        duration: 0.45,
                        onComplete: animateIn
                    })
                }

                animateIn()
            }

            infiniteBlinking()

            scene.add(mesh)
        }

        /**
         * Base
         */
// Canvas
        const canvas = document.querySelector('canvas.webgl')

// Scene
        const scene = new THREE.Scene()

        const geometry = new THREE.SphereGeometry(65, 20, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            flatShading: true,
            transparent: true,
            opacity: 0.2
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        state.inputValueGroup.position.y = 2
        scene.add(state.inputValueGroup)
        createTypeLabel()
        createInputCursor()
        input.addEventListener("input", (e) => onInputChange(e))

        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
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
            // Update controls
            controls.update()

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()
    }
)

