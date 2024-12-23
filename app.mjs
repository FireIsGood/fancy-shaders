import { createCanvas } from "./createCanvas.mjs";
import { createShaderManager, registerKeypress } from "./util.mjs";

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
  { name: "Tunnel", file: "./shaders/tunnel.frag" },
  { name: "Noise", file: "./shaders/noise.frag" },
  { name: "Template", file: "./shaders/template.frag" },
];

function toggleCallback(stopped) {
  $("#shader-state").text(stopped ? "Paused" : "Playing");
}
function changeCallback(index, entry, error) {
  $("#shader-name").text(entry.name);
  const shaderList = $("#shader-list").children();
  shaderList.removeClass("selected");
  shaderList.eq(index).addClass("selected");
  $("#shader-select").val(index).select();

  if (error) {
    const errorText = $("<pre/>").text(error);
    $("#shader-name").html(errorText);
  }
}

$(async function () {
  // Set up canvas
  const canvasControls = await createCanvas({
    canvasSelector: CANVAS_ELEMENT,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
  });
  const sm = createShaderManager(canvasControls, shaderList, toggleCallback, changeCallback);

  // Register key press handlers
  registerKeypress(" ", sm.toggleShader);
  registerKeypress("ArrowLeft", sm.prevShader);
  registerKeypress("ArrowRight", sm.nextShader);
  registerKeypress("k", sm.prevShader);
  registerKeypress("j", sm.nextShader);
  registerKeypress("p", () => $(CANVAS_ELEMENT).toggleClass("pixelated"));
  $("#shader-pause").click(sm.toggleShader);
  $("#shader-next").click(sm.nextShader);
  $("#shader-previous").click(sm.prevShader);

  $("#canvas-size").on("input", (e) => {
    let value = Number(e.target.value);
    if (value > CANVAS_MAX_SIZE) value = CANVAS_MAX_SIZE;
    if (value < CANVAS_MIN_SIZE) value = CANVAS_MIN_SIZE;
    canvasControls.changeCanvasSize(value, value);
  });
  $("#canvas-pixilated").on("change", (e) => $(CANVAS_ELEMENT).toggleClass("pixelated", e.target.checked));
  $("#shader-select").on("change", (e) => {
    const index = e.target.options[e.target.selectedIndex].value;
    const entry = shaderList[index];
    canvasControls.changeShader(entry.file);
    sm.apiSetIndex(index);
  });

  // Load first time state
  const shaderNameList = shaderList.map(({ name }) => $("<li></li>").text(name));
  $("#shader-list").empty().append(shaderNameList);

  const shaderOptionList = shaderList.map(({ name }, index) => $("<option></option>").attr("value", index).text(name));
  $("#shader-select").empty().append(shaderOptionList);

  // Load first shader
  const stopped = await sm.setShader(0);
  $("#shader-state").text(stopped ? "Paused" : "Playing");
  $("#canvas-size").val(CANVAS_WIDTH);
});
