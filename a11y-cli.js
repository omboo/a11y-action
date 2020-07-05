const core = require("@actions/core");
const exec = require("@actions/exec");
const fs = require("fs");
const got = require("got");
const pa11y = require("pa11y");
const quote = require("quote");

/**
 * A small utility for checking when an URL responds, kind of
 * a poor man's https://www.npmjs.com/package/wait-on
 */
const ping = (url, timeout) => {
  const start = +new Date();
  return got(url, {
    retry: {
      retries(retry, error) {
        const now = +new Date();
        core.debug(
          `${now - start}ms ${error.method} ${error.host} ${error.code}`
        );
        if (now - start > timeout) {
          console.error("%s timed out", url);
          return 0;
        }
        return 1000;
      },
    },
  });
};

const waitOnUrl = (waitOn, waitOnTimeout = 60) => {
  core.debug(
    'waiting on "%s" with timeout of %s seconds',
    waitOn,
    waitOnTimeout
  );

  const waitTimeoutMs = waitOnTimeout * 1000;
  return ping(waitOn, waitTimeoutMs);
};

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
      await waitOnUrl(waitOn, waitOnTimeout);
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
