# a11y-action - Run accesibility (a11y) tests

Runs accesibility (a11y) tests for a set of urls using the amazing [pa11y](https://pa11y.org/) project.

This is a basic version with very little configuration to run accesibility tests before merging PRs.

The idea is to evolve this action with more configuration as we need it.

### Basic

```yml
name: Tests
on: [pull_request]
jobs:
  accessibility_job:
    runs-on: ubuntu-latest
    name: Runs accessibility tests
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Install NPM dependencies
      # I've used this action in the example but any other action
      # or custom command to install the dependencies if needed is enough
      - uses: bahmutov/npm-install@v1
      # If a build task is needed execute it before triggering the tests with
      # the start command
      - name: Run build
        run: npm run build
      - name: Run a11y tests
        uses: omboo/a11y-action@v0.3
        with:
          urls: "http://localhost:3000"
          fail-on-error: true
          start-command: "npm start"
```

### Wait On Server Started

Waits for the start url to be ready before running the tests.

```yml
name: Tests
on: [pull_request]
jobs:
  accessibility_job:
    runs-on: ubuntu-latest
    name: Runs accessibility tests
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Install NPM dependencies
      - uses: bahmutov/npm-install@v1
      - name: Run build
        run: npm run build
      - name: Run a11y tests
        uses: omboo/a11y-action@v0.3
        with:
          urls: "http://localhost:3000"
          fail-on-error: true
          start-command: "npm start"
          wait-on: "http://localhost:3000"
          wait-on-timeout: 60
```

By default, wait-on will retry for 60 seconds. You can pass a custom timeout in seconds using wait-on-timeout.

Inspired by [cypress-ci/action](https://github.com/cypress-io/github-action).

Made with :heart: by [omboo](http://omboo.io)
