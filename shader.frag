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
    // frag_color = vec4((sin(TAU * time) + 1.0) / 2.0, texture_coordinates, 1.0);
    float dist_from_center = distance(vec2(0.5), texture_coordinates) * 3.;
    vec2 off = vec2(cos(TAU * dist_from_center), sin(TAU * dist_from_center)) / 3.;

    vec2 coord_normalized = vec2(0.5) - texture_coordinates + off;
    float angle = (atan(coord_normalized.y, coord_normalized.x) + PI) / 2.;

    vec3 color_out = vec3(sin(angle), sin(angle), sin(angle));

    // color_out = vec3(1. - texture_coordinates.y);

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
