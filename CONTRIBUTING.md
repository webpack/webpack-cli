# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcomed. If you're planning a new feature or change
the api please create an issue first. This way we can ensure that your precious
work is not in vain.

## Issues

Most of the time, when webpack does not work correctly, it might be a configuration issue.

If you are still having difficulty after looking over your configuration carefully, please post
a question to [StackOverflow with the webpack-cli tag](http://stackoverflow.com/tags/webpack-cli). Questions
that include your webpack.config.js and relevant files, this way you help others to help you.

**If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.**

## Setup

* Install [Node.js](https://nodejs.org/) if you don't have it already.
  *Note: Node 6 or greater would be better for "best results".*
* Fork the **webpack-cli** repo at [https://github.com/webpack/webpack-cli](https://github.com/webpack/webpack-cli).
* `git clone <your-clone-url> && cd webpack-cli`
* `git checkout develop`

### Setup with npm
* Install the dependencies: `npm install`
* Run the tests with: `npm test`

### Setup with yarn
* If you don't have yarn yet: `npm install -g yarn`
* Install the dependencies and link them

```bash
yarn install
yarn link
yarn link webpack-cli
```

To run the entire test suite use:

```bash
yarn test
```

## Editor Config

The [.editorconfig](https://github.com/webpack/webpack-cli/blob/master/.editorconfig) in the root should ensure consistent formatting. Please make sure you've [installed the plugin](http://editorconfig.org/#download) if your text editor needs one.

## Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes, improvements or implementation alternatives.

In case you've got a small change in most of the cases your pull request would be accepted quicker.

### How to increase chance of having a pull request accepted?

* Write tests
* Follow the existing coding style
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

## Documentation

webpack is insanely feature rich and documentation is a time sink. We
greatly appreciate any time spent fixing typos or clarifying sections in the
documentation.
