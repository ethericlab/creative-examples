uniform float uTime;
varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}
