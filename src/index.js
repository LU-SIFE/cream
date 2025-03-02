var HyperMD = require("hypermd")


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