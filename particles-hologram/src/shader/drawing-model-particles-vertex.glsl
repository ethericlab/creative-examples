uniform float uCurrentLevel;

varying vec3 vUv;
varying float vYPosition;

void main()
{
    vUv = position;

    vec3 newPosition = position;

    vYPosition = vUv.y;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}