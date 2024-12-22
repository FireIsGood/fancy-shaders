#version 300 es
precision highp float;

uniform float time;

in vec2 texture_coordinates;

out vec4 frag_color;

const float PI = 3.1415;
const float TAU = PI * 2.0;

void main(void) {
    float duration = 4.;
    vec3 color_out = cos((1. / duration) * TAU * time + texture_coordinates.xyx + vec3(0., 2., 4.)) * 0.5 + 0.5;

    // Loop bar
    if (texture_coordinates.y <= 0.025) {
        // Full bar
        color_out = vec3(0.0, 0.6, 1.0);

        // Empty bar
        if (fract(time / duration) < texture_coordinates.x) {
            color_out = vec3(0.87);
        }
    }

    // Final output is set to 1.0 alpha
    frag_color = vec4(color_out, 1.0);
}
