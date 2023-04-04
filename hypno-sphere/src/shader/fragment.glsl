uniform vec3 uColor;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    float dist = length(vPosition);

    float gradient = dist * 0.2;

    gradient += 0.8 * sin(uTime + dist * 200.);

    vec3 finalColor = mix(vec3(0.1, 0.1, 0.2), uColor, gradient);

    gl_FragColor = vec4(finalColor, 1.0);
}