#define PI 3.1415926538
uniform sampler2D texture1;
uniform float uTime;
uniform float uRandom;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(texture1, vUv);

    vec3 newColor = color.xyz;
    vec3 colorToMix = vec3(0.,0.,0.);

    float distance = distance(vUv, uMouse);

    vec3 finalColor = mix(newColor, colorToMix, smoothstep(distance, 0.0, .05));

    gl_FragColor = vec4(finalColor, 1.0);
}