#version 300 es
precision highp float;

uniform float time;

in vec2 texture_coordinates;

out vec4 frag_color;

const float PI = 3.1415;
const float TAU = PI * 2.0;

float time_loop(float offset) {
    return (sin(TAU * (time + offset)) + 1.0);
}

void main(void) {
    vec2 coord_normalized = vec2(0.5) - texture_coordinates;
    float angle = (atan(coord_normalized.y, coord_normalized.x) + PI) / 2.;

    vec3 color_out = vec3(angle / PI);

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
