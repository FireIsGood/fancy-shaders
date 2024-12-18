import { createCanvas } from "./createCanvas.mjs";
import { createShaderManager } from "./util.mjs";
import { registerKeypress } from "./util.mjs";

const ASPECT_RATIO = 1 / 1;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = CANVAS_WIDTH / ASPECT_RATIO;
const CANVAS_MAX_SIZE = 4096;
const CANVAS_MIN_SIZE = 1;
const CANVAS_ELEMENT = "#amogs";

const shaderList = [
  { name: "Gradient", file: "./shaders/gradient.frag" },
  { name: "Tiles", file: "./shaders/tiles.frag" },
  { name: "Rings", file: "./shaders/rings.frag" },
  { name: "Rings Colorful", file: "./shaders/rings_colorful.frag" },
  { name: "Rainbow Spinner", file: "./shaders/rainbow_spinner.frag" },
  { name: "Unpleasant Gradient", file: "./shaders/unpleasant_gradient.frag" },
  { name: "Unpleasant Gradient Spiral", file: "./shaders/unpleasant_gradient_spiral.frag" },
  { name: "Noise", file: "./shaders/noise.frag" },
];

function toggleCallback(stopped) {
  $("#shader-state").text(stopped ? "Paused" : "Playing");
}
function changeCallback(index, entry) {
  $("#shader-name").text(entry.name);
  const shaderList = $("#shader-list").children();
  shaderList.removeClass("selected");
  shaderList.eq(index).addClass("selected");
  $("#shader-select").val(index).select();
}

$(async function () {
  // Set up canvas
  const canvasControls = await createCanvas({
    canvasSelector: CANVAS_ELEMENT,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
  });
  const { toggleShader, nextShader, prevShader, setShader } = createShaderManager(
    canvasControls,
    shaderList,
    toggleCallback,
    changeCallback
  );

  // Register key press handlers
  registerKeypress(" ", toggleShader);
  registerKeypress("ArrowLeft", prevShader);
  registerKeypress("ArrowRight", nextShader);
  registerKeypress("p", () => $(CANVAS_ELEMENT).toggleClass("pixelated"));
  $("#shader-pause").click(toggleShader);
  $("#shader-next").click(nextShader);
  $("#shader-previous").click(prevShader);
  $("#canvas-size").on("input", (e) => {
    let value = Number(e.target.value);
    if (value > CANVAS_MAX_SIZE) value = CANVAS_MAX_SIZE;
    if (value < CANVAS_MIN_SIZE) value = CANVAS_MIN_SIZE;
    canvasControls.changeCanvasSize(value, value);
  });
  $("#canvas-pixilated").on("change", (e) => $(CANVAS_ELEMENT).toggleClass("pixelated", e.target.checked));
  $("#shader-select").on("change", (e) => {
    const entry = shaderList[e.target.options[e.target.selectedIndex].value];
    canvasControls.changeShader(entry.file);
  });

  // Load first time state
  const shaderNameList = shaderList.map(({ name }) => $("<li></li>").text(name));
  $("#shader-list").empty().append(shaderNameList);

  const shaderOptionList = shaderList.map(({ name }, index) => $("<option></option>").attr("value", index).text(name));
  $("#shader-select").empty().append(shaderOptionList);

  // Load first shader
  const stopped = await setShader(0);
  $("#shader-state").text(stopped ? "Paused" : "Playing");
  $("#canvas-size").val(CANVAS_WIDTH);
});
