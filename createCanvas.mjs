// Global State
let stopDraw = false;
let animationFrameId;

function pointsToVertices(vertices) {
  return new Float32Array(vertices.flat());
}

// Compile a program from source code of shaders
function compileProgram(vertexShaderSource, fragmentShaderSource, gl) {
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

// Compiles a shader given the source code and type of shader
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

// Create a program given the vertex shader and fragment shader files
async function createProgram(vertexShaderFile, fragmentShaderFile, gl) {
  const vertexShaderSource = await fetchLocal(vertexShaderFile);
  const fragmentShaderSource = await fetchLocal(fragmentShaderFile);

  // Create the program
  const program = compileProgram(vertexShaderSource, fragmentShaderSource, gl);
  gl.useProgram(program);

  // Pass in parameters
  const vertexPositionLocation = gl.getAttribLocation(program, "vertex_position");
  gl.enableVertexAttribArray(vertexPositionLocation);
  gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, true, 0, 0);

  // Draw vertex buffer
  return program;
}

// Draw a frame of the program recursively
function drawProgram(program, gl, context) {
  // Update variables
  const timeLocation = gl.getUniformLocation(program, "time");
  gl.uniform1f(timeLocation, context.time);
  context.time += 1 / 60;

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, context.vertices); // number of vertices

  // recursive unless stop drawing is set
  if (!stopDraw) {
    animationFrameId = requestAnimationFrame(() => drawProgram(program, gl, context));
  }
}

// Start the recursive function
function runProgram(program, gl, context) {
  animationFrameId = requestAnimationFrame(() => drawProgram(program, gl, context));
}

// Fetch a local file (doesn't handle errors, too bad!)
async function fetchLocal(src) {
  const req = await fetch(src);
  const text = await req.text();
  return text;
}

// Create a shader canvas given a config
// Returns functions to run shaders in it
export async function createCanvas(userConfig) {
  const defaultConfig = {
    canvasSelector: "canvas", // CSS selector for the Canvas element
    canvasWidth: 400, // Width in pixels
    canvasHeight: 400, // Height in pixels
    placeholderColor: [0.4, 0.4, 0.4, 1.0], // Placeholder for if no shader is drawn
    vertexShader: "/shaders/default.vert", // Vertex shader file name
    fragmentShader: "/shaders/default.frag", // Fragment shader file name
  };

  const config = { ...defaultConfig, ...userConfig };

  // Get contexts
  const canvas = $(config.canvasSelector)[0];
  const gl = canvas.getContext("webgl2");

  // Set up canvas
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;
  gl.viewport(0, 0, config.canvasWidth, config.canvasHeight);
  const vertexBuffer = gl.createBuffer(); // vertex buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // buffer contexts
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // ----------
  // Draw stuff
  // ----------

  // Fill background
  gl.clearColor(...config.placeholderColor);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Create square for the background
  const triangleVertices = pointsToVertices([
    [1, -1],
    [1, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

  // State
  let program;
  const defaultContext = { time: 0, vertices: 6 };
  let context = { ...defaultContext };

  // Functions for the caller
  const stop = () => {
    cancelAnimationFrame(animationFrameId);
    stopDraw = true;
    return stopDraw;
  };
  const start = () => {
    cancelAnimationFrame(animationFrameId);
    stopDraw = false;
    runProgram(program, gl, context);
    return stopDraw;
  };
  const toggle = () => {
    stopDraw = !stopDraw;
    stopDraw ? stop() : start();
    return stopDraw;
  };
  const changeShader = async (fragmentShader) => {
    program = await createProgram(config.vertexShader, fragmentShader, gl);
    cancelAnimationFrame(animationFrameId);
    context = { ...defaultContext };
    runProgram(program, gl, context);
    return stopDraw;
  };

  return {
    stop,
    start,
    toggle,
    changeShader,
  };
}
