import { createCanvas } from "./createCanvas.mjs";
import { createShaderManager } from "./util.mjs";
import { registerKeypress } from "./util.mjs";

const ASPECT_RATIO = 1 / 1;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = CANVAS_WIDTH / ASPECT_RATIO;
const CANVAS_ELEMENT = "#amogs";

const shaderList = [
  { name: "Gradient", file: "/shaders/gradient.frag" },
  { name: "Tiles", file: "/shaders/tiles.frag" },
  { name: "Rings", file: "/shaders/rings.frag" },
  { name: "Rings Colorful", file: "/shaders/rings_colorful.frag" },
  { name: "Rainbow Spinner", file: "/shaders/rainbow_spinner.frag" },
  { name: "Unpleasant Gradient", file: "/shaders/unpleasant_gradient.frag" },
  { name: "Unpleasant Gradient Spiral", file: "/shaders/unpleasant_gradient_spiral.frag" },
];

function toggleCallback(stopped) {
  $("#shader-state").text(stopped ? "Paused" : "Playing");
}
function changeCallback(index) {
  const shaderList = $("#shader-list").children();
  shaderList.removeClass("selected");
  shaderList.eq(index).addClass("selected");
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
  registerKeypress("1", toggleShader);
  registerKeypress("2", prevShader);
  registerKeypress("3", nextShader);
  registerKeypress("p", () => $(CANVAS_ELEMENT).toggleClass("pixelated"));
  $("#shader-pause").click(toggleShader);
  $("#shader-next").click(nextShader);
  $("#shader-previous").click(prevShader);

  // Load first time state
  const shaderNamesList = shaderList.map(({ name }) => $("<li></li>").text(name));
  $("#shader-list").empty().append(shaderNamesList);

  // Load first shader
  const stopped = await setShader(0);
  $("#shader-state").text(stopped ? "Paused" : "Playing");
});
