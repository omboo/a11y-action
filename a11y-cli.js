const core = require("@actions/core");
const exec = require("@actions/exec");
const fs = require("fs");
const pa11y = require("pa11y");
const quote = require("quote");

const useYarn = () => fs.existsSync(yarnFilename);

const install = () => {
  // prevent lots of progress messages during install
  core.exportVariable("CI", "1");

  if (useYarn()) {
    core.debug("installing NPM dependencies using Yarn");
    return io.which("yarn", true).then((yarnPath) => {
      core.debug(`yarn at "${yarnPath}"`);
      return exec.exec(quote(yarnPath), ["--frozen-lockfile"]);
    });
  } else {
    core.debug("installing NPM dependencies");
    return io.which("npm", true).then((npmPath) => {
      core.debug(`npm at "${npmPath}"`);
      return exec.exec(quote(npmPath));
    });
  }
};

const installMaybe = (shouldInstall) => {
  if (!shouldInstall) {
    return Promise.resolve();
  }

  return install();
};

const logIssue = (issue, failOnError) => {
  core.debug(failOnError);
  if (failOnError) {
    core.setFailed(issue.message);
  } else {
    core.warning(issue.message);
  }
};

module.exports = async ({ urls, failOnError, install, startCommand }) => {
  try {
    await installMaybe(install);

    urls.forEach(async (url) => {
      const { pageUrl, issues } = await pa11y(url, {
        chromeLaunchConfig: {
          args: ["--no-sandbox"],
        },
      });

      if (issues.length) {
        core.startGroup(pageUrl);
      }

      issues.forEach((issue) => {
        logIssue(issue, failOnError);
      });

      if (issues.length) {
        core.endGroup();
      }
    });
  } catch (ex) {
    core.debug(ex);
    throw ex;
  }
};
