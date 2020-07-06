const core = require("@actions/core");
const exec = require("@actions/exec");
const io = require("@actions/io");
const fs = require("fs");
const quote = require("quote");
const waitOnUrl = require("wait-on");
const cliParser = require("argument-vector")();
const pa11y = require("pa11y");

const startServer = (startCommand) => {
  const cwd = process.cwd();

  const args = cliParser.parse(startCommand);
  core.debug(`parsed command: ${args.join(" ")}`);

  return io.which(args[0], true).then((toolPath) => {
    core.debug(`found command "${toolPath}"`);
    core.debug(`with arguments ${args.slice(1).join(" ")}`);

    const toolArguments = args.slice(1);
    const argsString = toolArguments.join(" ");
    core.debug(`running ${quote(toolPath)} ${argsString} in ${cwd}`);

    exec.exec(quote(toolPath), toolArguments);
  });
};

const logIssue = (issue, failOnError) => {
  core.debug(failOnError);
  if (failOnError) {
    core.setFailed(issue.message);
  } else {
    core.warning(issue.message);
  }
};

module.exports = async ({
  urls,
  failOnError,
  startCommand,
  waitOn,
  waitOnTimeout,
}) => {
  try {
    if (startCommand) {
      await startServer(startCommand);
    }

    if (waitOn) {
      await waitOnUrl({
        resources: [waitOn],
        interval: 1000,
        timeout: waitOnTimeout * 1000,
      });
    }

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
