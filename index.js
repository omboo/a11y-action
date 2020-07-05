const core = require("@actions/core");

const a11yCli = require("./a11y-cli");

const getBooleanInput = (name) => core.getInput(name).toLowerCase() === "true";

try {
  const urls = core.getInput("urls");
  const failOnError = getBooleanInput("fail-on-error");
  const waitOn = core.getInput("wait-on");
  const waitOnTimeout = parseFloat(core.getInput("wait-on-timeout"));

  a11yCli({
    urls: urls.split(","),
    failOnError,
    waitOn,
    waitOnTimeout,
  });
} catch (error) {
  core.setFailed(error.message);
}
