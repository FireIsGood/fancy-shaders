#version 300 es
precision highp float;

in vec2 vertex_position;

out vec2 texture_coordinates;

void main(void) {
    gl_Position = vec4(vertex_position, 0.5, 1.0); // (x,y,z,1.0)

    texture_coordinates = vec2((vertex_position + vec2(1.0)) / 2.0);
}
