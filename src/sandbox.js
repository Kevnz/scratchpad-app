function safeEval(untrustedCode) {
  const output = [];
  return new Promise(function(resolve, reject) {
    var blobURL = URL.createObjectURL(
      new Blob(
        [
          "(",
          function() {
            var _postMessage = postMessage;
            var _addEventListener = addEventListener;

            (function(obj) {
              "use strict";

              var current = obj;
              var keepProperties = [
                // required
                "Object",
                "Function",
                "Infinity",
                "NaN",
                "undefined",
                "caches",
                "TEMPORARY",
                "PERSISTENT",
                // optional, but trivial to get back
                "Array",
                "Boolean",
                "Number",
                "String",
                "Symbol",
                "Date",
                // optional
                "Map",
                "Math",
                "Set"
              ];
              const overwriteProperties = ["console"];
              const thisConsole = console;
              const thisOutput = [];
              const newProperties = {
                console: {
                  log: (...args) => {
                    args.forEach(a => thisOutput.push(a));
                  }
                }
              };
              do {
                Object.getOwnPropertyNames(current).forEach(function(name) {
                  if (keepProperties.indexOf(name) === -1) {
                    delete current[name];
                  }
                  if (overwriteProperties.indexOf(name) > -1) {
                    current[name] = newProperties[name];
                    current["thisOutput"] = thisOutput;
                  }
                });

                current = Object.getPrototypeOf(current);
              } while (current !== Object.prototype);
            })(this);

            _addEventListener("message", function(e) {
              const newF = `const x = function(){
                ${e.data}
                ;return 12;
              }(); return thisOutput;
                `;
              var f = new Function("", newF);
              _postMessage(f());
            });
          }.toString(),
          ")()"
        ],
        {
          type: "application/javascript"
        }
      )
    );

    var worker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    worker.onmessage = function(evt) {
      worker.terminate();
      resolve(evt.data);
    };

    worker.onerror = function(evt) {
      reject(new Error(evt.message));
    };

    worker.postMessage(untrustedCode);

    setTimeout(function() {
      worker.terminate();
      reject(new Error("The worker timed out."));
    }, 1000);
  });
}

module.exports = recorder => {
  return code => safeEval(code, recorder);
};
