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
    float dist_from_center = distance(vec2(0.5), texture_coordinates) * 10.;
    vec2 off = vec2(cos(TAU * dist_from_center), sin(TAU * dist_from_center));

    vec2 coord_normalized = vec2(0.5) - texture_coordinates;
    float angle = (atan(coord_normalized.y, coord_normalized.x) + PI) / 2.;

    float spiral_val_normalized = mod(angle / PI + dist_from_center, 1.);
    float spiral_val = smoothstep(0., 1., (1. - sin(TAU * spiral_val_normalized)) / 2.);

    vec3 color_out = vec3(spiral_val);

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
