import { fetchLocal, createProgram, drawProgram } from "./util.mjs";
import { pointsToVertices } from "./util.mjs";

const ASPECT_RATIO = 1 / 1;
const CANVAS_SELECTOR = "#amogs";

let time = 0;

$(window).on("resize", function () {
  const canvasWidth = $(CANVAS_SELECTOR).parent().width();
  const canvasHeight = Math.round(canvasWidth / ASPECT_RATIO);
  $(CANVAS_SELECTOR).width(canvasWidth).height(canvasHeight);
});

$(async function () {
  const canvasWidth = $(CANVAS_SELECTOR).parent().width();
  const canvasHeight = canvasWidth / ASPECT_RATIO;

  // Get contexts
  const canvas = $(CANVAS_SELECTOR)[0];
  const gl = canvas.getContext("webgl2");
  const vertexBuffer = gl.createBuffer(); // vertex buffer

  // Set up canvas
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  gl.viewport(0, 0, canvasWidth, canvasHeight);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // buffer contexts
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // ----------
  // Draw stuff
  // ----------

  // Fill background
  gl.clearColor(0.5, 0.5, 0.5, 1);
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

  // Create vertex shader
  const vertexShaderSource = await fetchLocal("/shader.vert");
  const fragmentShaderSource = await fetchLocal("/shader.frag");

  // Create the program
  const program = createProgram(vertexShaderSource, fragmentShaderSource, gl);
  gl.useProgram(program);

  // Pass in parameters
  const vertexPositionLoc = gl.getAttribLocation(program, "vertex_position");
  gl.enableVertexAttribArray(vertexPositionLoc);
  gl.vertexAttribPointer(vertexPositionLoc, 2, gl.FLOAT, true, 0, 0);

  // Draw vertex buffer
  requestAnimationFrame(() => drawProgram(program, gl, { time: time, vertices: 6 }));
});
