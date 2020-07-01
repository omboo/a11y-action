const core = require("@actions/core");
const pa11y = require("pa11y");

module.exports = ({ urls, failOnError }) => {
  const logIssue = (issue) => {
    if (failOnError) {
      core.setFailed(issue.message);
    } else {
      core.warning(issue.message);
    }
  };

  try {
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
        logIssue(issue);
      });

      if (issues.length) {
        core.endGroup();
      }
    });
  } catch (ex) {
    throw ex;
  }
};
