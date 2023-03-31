uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;

varying vec2 v_uv;

void main() {
    vec2 uv = v_uv;
    float wave = 0.0;

    vec2 mouse_dist = uv - u_mouse;
    if (length(mouse_dist) < 3.0 && length(mouse_dist - dFdx(u_mouse)) > 0.001 && length(mouse_dist - dFdy(u_mouse)) > 0.001) {
        wave = 0.05 * sin(2.0 + length(mouse_dist) * 3.0);
    }

    vec2 distortedUV = uv + vec2(wave, wave);
    vec4 texel = texture2D(u_texture, distortedUV);

    gl_FragColor = texel;
}



