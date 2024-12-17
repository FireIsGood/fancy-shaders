// Register a callback function for a key press event
const keypressCallbacks = {};
export function registerKeypress(key, callback) {
  if ($.isEmptyObject(keypressCallbacks)) {
    $(window).on("keypress", (e) => {
      if (keypressCallbacks.hasOwnProperty(e.keyCode)) {
        keypressCallbacks[e.keyCode]();
      }
    });
  }

  keypressCallbacks[key.charCodeAt(0)] = callback;
}

export function createShaderManager(canvasControls, shaderList) {
  let shaderIndex = 0;

  const toggleShader = () => {
    const stopped = canvasControls.toggle();
    $("#shader-state").text(stopped ? "Paused" : "Playing");
  };
  const changeShader = async () => {
    const entry = shaderList[((shaderIndex % shaderList.length) + shaderList.length) % shaderList.length];
    $("#shader-name").text(entry.name);
    return await canvasControls.changeShader(entry.file);
  };
  return {
    toggleShader: toggleShader,
    nextShader: () => changeShader(++shaderIndex),
    prevShader: () => changeShader(--shaderIndex),
    setShader: changeShader,
  };
}
