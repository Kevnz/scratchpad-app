const menubar = require("menubar");
console.log("CWD", process.cwd());
const mb = menubar({
  icon: "assets/icons/menubar/icon.png",
  index: "src/index.html",
  width: 600,
  height: 550,
  preloadWindow: false
});

mb.on("ready", function ready() {
  console.log("app is ready");
});

mb.on("show", function ready() {
  console.log("app is ready", arguments);
});

mb.on("after-create-window", () => {
  console.log("mb", mb);
  //mb.window.openDevTools();
});
