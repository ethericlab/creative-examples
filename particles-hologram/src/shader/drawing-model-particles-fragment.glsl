uniform float uCurrentLevel;

varying float vYPosition;

void main() {

    float alpha = vYPosition > uCurrentLevel ? 0.0 : 1.0;

    gl_FragColor = vec4( 1.0, 1.0, 1.0, alpha);

}