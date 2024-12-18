#version 300 es
precision highp float;

uniform float time;

in vec2 texture_coordinates;

out vec4 frag_color;

const float PI = 3.1415;
const float TAU = PI * 2.0;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
    vec3 color_out = vec3(rand(texture_coordinates));

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
