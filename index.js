const core = require("@actions/core");

const a11yCli = require("./a11y-cli");

const getBooleanInput = (name) => core.getInput(name).toLowerCase() === "true";

try {
  const urls = core.getInput("urls");
  const failOnError = getBooleanInput("fail-on-error");
  const install = getBooleanInput("install");
  const startCommand = core.getInput("start-command");

  a11yCli({
    urls: urls.split(","),
    failOnError,
    install,
    startCommand,
  });
} catch (error) {
  core.setFailed(error.message);
}
