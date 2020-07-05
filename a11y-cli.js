const core = require("@actions/core");
const exec = require("@actions/exec");
const fs = require("fs");
const waitOnUrl = require("wait-on");
const pa11y = require("pa11y");

const logIssue = (issue, failOnError) => {
  core.debug(failOnError);
  if (failOnError) {
    core.setFailed(issue.message);
  } else {
    core.warning(issue.message);
  }
};

module.exports = async ({ urls, failOnError, waitOn, waitOnTimeout }) => {
  try {
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
