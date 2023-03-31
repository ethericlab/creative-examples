uniform float uTime;
varying vec2 v_uv;

void main() {
    v_uv = uv;

    vec3 newPosition = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}
