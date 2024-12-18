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
    float dist_from_center = distance(vec2(0.5), texture_coordinates) * 30. + time;

    vec3 color_out = vec3(
            smooth_val(dist_from_center, 0.),
            smooth_val(dist_from_center, 0.),
            smooth_val(dist_from_center, 0.));

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
