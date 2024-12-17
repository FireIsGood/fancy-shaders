#version 300 es
precision highp float;

uniform float time;

in vec2 texture_coordinates;

out vec4 frag_color;

const float PI = 3.1415;
const float TAU = PI * 2.0;

float time_loop(float off) {
    return (sin(TAU * (time + off)) + 1.0);
}

float smooth_val(float val, float off) {
    return smoothstep(0., 1., (1. - sin(TAU * (val + off))) / 2.);
}

void main(void) {
    float dist_from_center = distance(vec2(0.5), texture_coordinates);
    vec2 off = vec2(cos(TAU * dist_from_center), sin(TAU * dist_from_center));

    vec2 coord_normalized = vec2(0.5) - texture_coordinates;
    float angle = mod((atan(coord_normalized.y, coord_normalized.x) + PI) / 2. - time, PI);

    float spiral_val_normalized = mod(angle / PI + dist_from_center, 1.);
    float spiral_val = smooth_val(spiral_val_normalized, 0.);

    vec3 color_out = vec3(
            smooth_val(spiral_val_normalized, 0.00),
            smooth_val(spiral_val_normalized, 0.25),
            smooth_val(spiral_val_normalized, 0.55));

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
