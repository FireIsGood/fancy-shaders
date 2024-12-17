export function pointsToVertices(vertices) {
  return new Float32Array(vertices.flat());
}

export function createProgram(vertexShaderSource, fragmentShaderSource, gl) {
  // Compile shader
  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);

  // Create program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  // Handle errors
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw `Program compilation error!!!\n\n${info}`;
  }

  return program;
}

function compileShader(source, type, gl) {
  // Create a shader
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);

  // Compile it
  gl.compileShader(shader);

  // Handle errors
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    throw `Shader compilation error!!!\n\n${info}`;
  }

  return shader;
}

export function drawProgram(program, gl, context) {
  // Update variables
  const timeLoc = gl.getUniformLocation(program, "time");
  gl.uniform1f(timeLoc, context.time);
  context.time += 1 / 60;

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, context.vertices); // number of vertices

  // recursive
  requestAnimationFrame(() => drawProgram(program, gl, context));
}

export async function fetchLocal(src) {
  const req = await fetch(src);
  const text = await req.text();
  return text;
}
