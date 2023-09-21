/* global process */

module.exports = (() => {
  const appEnv = process.env.APPENV || "dev";

  console.log(`APPENV: "${appEnv}"`);

  // for security reason don't let to require any arbitrary file defined in process.env
  if (["prod", "dev", "qa"].indexOf(appEnv) < 0) {
    return require("./dev");
  }

  return require("./" + appEnv);
})();

