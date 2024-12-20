// Register a callback function for a key press event
const keypressCallbacks = {};
export function registerKeypress(key, callback) {
  if ($.isEmptyObject(keypressCallbacks)) {
    $(window).on("keydown", (e) => {
      const noActiveFocus = e.target === document.body;
      if (noActiveFocus && keypressCallbacks.hasOwnProperty(e.key)) {
        e.preventDefault();
        keypressCallbacks[e.key]();
      }
    });
  }

  keypressCallbacks[key] = callback;
}

export function createShaderManager(canvasControls, shaderList, toggleCallback, changeCallback) {
  let shaderIndex = 0;

  const toggleShader = () => {
    const stopped = canvasControls.toggle();
    if (toggleCallback !== undefined) {
      toggleCallback(stopped);
    }
  };
  const changeShader = async () => {
    // Wrap index
    shaderIndex = ((shaderIndex % shaderList.length) + shaderList.length) % shaderList.length;

    const entry = shaderList[shaderIndex];

    if (changeCallback !== undefined) {
      changeCallback(shaderIndex, entry);
    }

    return await canvasControls.changeShader(entry.file);
  };
  return {
    toggleShader: toggleShader,
    nextShader: () => changeShader(++shaderIndex),
    prevShader: () => changeShader(--shaderIndex),
    setShader: changeShader,
  };
}
