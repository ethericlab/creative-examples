varying vec3 vPosition;
varying float vYPosition;

void main()
{
    vPosition = position;

    vec3 newPosition = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}