var HyperMD = require("hypermd");

// Load PowerPacks if you want to utilize 3rd-party libs
require("hypermd/powerpack/fold-math-with-katex"); // implicitly requires "katex"
require("hypermd/powerpack/hover-with-marked"); // implicitly requires "marked"

var myTextarea = document.getElementById("myTextarea");
var editor = HyperMD.fromTextArea(myTextarea, {
  /* optional editor options here */
  hmdModeLoader: false, // see NOTEs below
});

let pages = [];
let page_index = 0;

window.onload = function() {
  if (localStorage.getItem("pages") !== null) {
    pages = JSON.parse(localStorage.getItem("pages"));
    editor.setValue(pages[0].content);
  }
};

document.addEventListener("keyup", function() {
  savePage();
});

function savePage() {
  if (pages[page_index]) {
    pages[page_index].content = editor.getValue();
  } else {
    pages[page_index] = { content: editor.getValue(), timestamp: Date.now() };
  }
  localStorage.setItem("pages", JSON.stringify(pages));
}

function addPage() {
  savePage();
  pages.push({ content: "# Page " + (pages.length + 1), timestamp: Date.now() });
  page_index = pages.length - 1;
  editor.setValue(pages[page_index].content);
  localStorage.setItem("pages", JSON.stringify(pages));
}

function switchPage(index) {
  if (index < 0 || index >= pages.length) return;
  savePage();
  page_index = index;
  editor.setValue(pages[page_index].content);
}

// Example event listeners for navigating between pages
document.getElementById("next").addEventListener("click", function() {
  if (page_index < pages.length - 1) {
    switchPage(page_index + 1);
  } else {
    addPage();
  }
});

document.getElementById("prev").addEventListener("click", function() {
  if (page_index > 0) {
    switchPage(page_index - 1);
  }
});

document.getElementById('sidebar').addEventListener("mouseover", function() {
  document.getElementById('sidebar').style.opacity = 1;
});

document.getElementById('sidebar').addEventListener("mouseout", function() {
  document.getElementById('sidebar').style.opacity = 0;
});

let menu_state = false;

document.getElementById('settings').addEventListener("click", function() {
  if (menu_state === false) {
    document.getElementById('menu').style.display = 'block';
    menu_state = true;
  } else {
    document.getElementById('menu').style.display = 'none';
    menu_state = false;
  }

  
});