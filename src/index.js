var HyperMD = require("hypermd");

// Load these modes if you want highlighting ...
require("codemirror/mode/htmlmixed/htmlmixed") // for embedded HTML
require("codemirror/mode/stex/stex") // for Math TeX Formular
require("codemirror/mode/yaml/yaml") // for Front Matters

// Load PowerPacks if you want to utilize 3rd-party libs
require("hypermd/powerpack/fold-math-with-katex") // implicitly requires "katex"
require("hypermd/powerpack/hover-with-marked") // implicitly requires "marked"


var myTextarea = document.getElementById("myTextarea")
var editor = HyperMD.fromTextArea(myTextarea, {
  /* optional editor options here */
  hmdModeLoader: false, // see NOTEs below
})

window.onload = function() {
  if (localStorage.getItem("content") === null) {
    return;
  }
  editor.setValue(localStorage.getItem("content"));
};


document.addEventListener("keyup", function() {
  console.log(editor.getValue());
  localStorage.setItem("content", editor.getValue());
});
