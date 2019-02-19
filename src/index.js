const fs = require("fs");
require.extensions[".css"] = (m, filename) => {
  const content = fs.readFileSync(filename, "utf-8");
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = content;
  document.head.appendChild(style);
};

const CodeMirror = require("codemirror");
const js = require("codemirror/mode/javascript/javascript");
const css = require("codemirror/lib/codemirror.css");
const theme = require("codemirror/theme/cobalt.css");
const sandbox = require("./sandbox");

require("./base.css");
require("./main.css");

const myCodeMirror = CodeMirror.fromTextArea(document.getElementById("cd"), {
  mode: "javascript",
  theme: "cobalt",
  lineNumbers: true,
  tabSize: 2
});
const $output = CodeMirror(document.querySelector("output"), {
  mode: "javascript",
  theme: "cobalt",
  lineNumbers: true,
  tabSize: 2
});
$output.setValue("");
const recorder = {
  log: args => {
    const currentValue = $output.getValue();
    console.log("current value", currentValue.length);
    const valToSet =
      currentValue.length > 0 ? currentValue + "\n" + args : args.toString();
    console.log("val to set", valToSet);
    $output.setValue(valToSet);
    //args.forEach(a => ($output.innerHTML = $output.innerHTML + "<br />" + a));
  }
};
const runner = document.querySelector("#run");
const clearer = document.querySelector("#clear");
runner.addEventListener("click", async (element, ev) => {
  const code = myCodeMirror.getValue();
  const api = {
    console: console
  };
  element.preventDefault();
  const box = sandbox(recorder);
  try {
    const output = await box(code);
    recorder.log(output);
  } catch (e) {
    console.log("e", e);
  }

  return false;
});
clearer.addEventListener("click", async (element, ev) => {
  element.preventDefault();
  $output.setValue("");

  return false;
});
