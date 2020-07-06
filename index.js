const core = require("@actions/core");

const a11yCli = require("./a11y-cli");

const getBooleanInput = (name) => core.getInput(name).toLowerCase() === "true";

try {
  const urls = core.getInput("urls");
  const failOnError = getBooleanInput("fail-on-error");
  const startCommand = core.getInput("start-command");
  const waitOn = core.getInput("wait-on");
  const waitOnTimeout = parseFloat(core.getInput("wait-on-timeout"));

  a11yCli({
    urls: urls.split(","),
    failOnError,
    startCommand,
    waitOn,
    waitOnTimeout,
  });
} catch (error) {
  core.setFailed(error.message);
  process.exit(1);
}
