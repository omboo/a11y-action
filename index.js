const core = require("@actions/core");

const a11yCli = require("./a11y-cli");

try {
  const urls = core.getInput("urls");
  const failOnError = core.getInput("fail-on-error");

  a11yCli({
    urls: urls.split(","),
    failOnError,
  });
} catch (error) {
  core.setFailed(error.message);
}
